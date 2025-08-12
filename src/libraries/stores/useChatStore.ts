import { create } from "zustand";
// import { persist } from "zustand/middleware";
import { getChatMessages, markMessageAsRead } from "@/apis/chatMessages";
import { getChatRooms } from "@/apis/chatRoom";

/** ---- Types ---- */
export interface Message {
  id: string; // string으로 통일(서버 number라도 수신 시 string화)
  content: string;
  senderId: string; // string 통일
  receiverId: string | null;
  chatRoomId: number;
  timestamp: string; // 반드시 ISO UTC ("...Z")
  isRead: boolean;
  clientMessageId?: string; // 클라 생성 상관키(낙관적+업서트용)
  status?: "pending" | "sent" | "failed";
}

interface ChatRoom {
  id: number;
  user1Id: string;
  user1Nickname: string;
  user2Id: string;
  user2Nickname: string;
}

interface ChatState {
  chatRooms: ChatRoom[];
  setchatRooms: (rooms: ChatRoom[]) => void;

  messages: Record<number, Message[]>; // roomId -> messages

  fetchChatRooms: () => Promise<void>;
  fetchMessages: (roomId: number) => Promise<void>;

  /** 신규/수신 메시지 업서트(중복 제거 포함) */
  upsertMessage: (roomId: number, incoming: Message) => void;

  /** 읽음 처리(단건) */
  markMessageAsRead: (messageId: string) => Promise<void>;

  /** 방 기준 읽음 처리(내가 안 읽은 것만) */
  markMessagesAsReadInRoomAsync: (roomId: number, myUserId: string) => Promise<void>;
}

/** ---- Utils ---- */
const hasZoneInfo = (s: string) => /(?:Z|[+\-]\d{2}:\d{2}|[+\-]\d{4})$/.test(s);
const trimToMillis = (s: string) => s.replace(/\.(\d{3})\d+$/, ".$1");

/** 서버/소켓 timestamp를 ISO UTC로 표준화
 * - 타임존 없으면 UTC로 간주 
 * - 마이크로초 → 밀리초로 절삭
 */
export const normalizeToUtcIso = (raw: string): string => {
  if (!raw) return new Date().toISOString();
  let s = String(raw).trim();
  s = trimToMillis(s);
  if (!hasZoneInfo(s)) {
    s = `${s}+00:00`; // 타임존 없으면 UTC로 간주
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

/** 메시지 정렬(시간 asc, tie-breaker id/clientMessageId) */
const sortMessages = (arr: Message[]) => {
  return arr.slice().sort((a, b) => {
    if (a.timestamp < b.timestamp) return -1;
    if (a.timestamp > b.timestamp) return 1;
    // tie-breakers
    const ai = a.id ?? "";
    const bi = b.id ?? "";
    if (ai < bi) return -1;
    if (ai > bi) return 1;
    const ac = a.clientMessageId ?? "";
    const bc = b.clientMessageId ?? "";
    if (ac < bc) return -1;
    if (ac > bc) return 1;
    return 0;
  });
};

/** 수신 원본을 Message로 정규화(타입/시간/기본값) */
export const normalizeIncomingMessage = (raw: any): Message => {
  return {
    id: raw?.id != null ? String(raw.id) : "", // 서버가 아직 안 준 경우 빈 문자열 가능
    content: raw?.content ?? "",
    senderId: raw?.senderId != null ? String(raw.senderId) : "",
    receiverId: raw?.receiverId != null ? String(raw.receiverId) : null,
    chatRoomId: Number(raw?.chatRoomId ?? 0),
    timestamp: normalizeToUtcIso(String(raw?.timestamp ?? new Date().toISOString())),
    isRead: Boolean(raw?.isRead ?? false),
    clientMessageId: raw?.clientMessageId ? String(raw.clientMessageId) : undefined,
    status: raw?.status ?? "sent",
  };
};

export const useChatStore = create<ChatState>()((set, get) => ({
  chatRooms: [],
  messages: {},

  setchatRooms: (rooms) => {
    // 방 id/type 통일 (user1Id/user2Id를 string으로)
    const norm = rooms.map((r: any) => ({
      id: Number(r.id),
      user1Id: String(r.user1Id),
      user1Nickname: r.user1Nickname ?? "",
      user2Id: String(r.user2Id),
      user2Nickname: r.user2Nickname ?? "",
    }));
    set({ chatRooms: norm });
  },

  fetchChatRooms: async () => {
    const rooms = await getChatRooms();
    // API 형식이 number라도 저장은 string 통일
    const norm = (rooms ?? []).map((r: any) => ({
      id: Number(r.id),
      user1Id: String(r.user1Id),
      user1Nickname: r.user1Nickname ?? "",
      user2Id: String(r.user2Id),
      user2Nickname: r.user2Nickname ?? "",
    }));
    set({ chatRooms: norm });
  },

  fetchMessages: async (roomId: number) => {
    const res = await getChatMessages(roomId);
    const normList: Message[] = (Array.isArray(res) ? res : []).map((raw: any) => {
      const m = normalizeIncomingMessage(raw);
      // 서버 목록은 확정 메시지로 간주
      m.status = "sent";
      // 서버가 isRead 제공 안하면 false 기본
      if (typeof raw?.isRead === "undefined") m.isRead = Boolean(m.isRead);
      return m;
    });
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: sortMessages(normList),
      },
    }));
  },

  upsertMessage: (roomId, incoming) => {
    set((state) => {
      const list = state.messages[roomId] ?? [];

      // 1) clientMessageId 매칭
      if (incoming.clientMessageId) {
        const idx = list.findIndex(
          (m) => m.clientMessageId && m.clientMessageId === incoming.clientMessageId
        );
        if (idx >= 0) {
          const merged = { ...list[idx], ...incoming, status: "sent" as const };
          const updated = [...list];
          updated[idx] = merged;
          return {
            messages: { ...state.messages, [roomId]: sortMessages(updated) },
          };
        }
      }

      // 2) 보정 매칭 (같은 보낸이/내용/시간 근접/같은 방)
      const IN_WINDOW_MS = 0.1_000; // 15초 이내면 동일로 간주
      const incomingTime = new Date(incoming.timestamp).getTime();
      const approxIdx = list.findIndex((m) => {
        if (m.chatRoomId !== incoming.chatRoomId) return false;
        if (m.senderId !== incoming.senderId) return false;
        if (m.content !== incoming.content) return false;
        // pending만 보정 대상으로
        if (m.status !== "pending") return false;
        const dt = Math.abs(new Date(m.timestamp).getTime() - incomingTime);
        return dt <= IN_WINDOW_MS;
      });
      if (approxIdx >= 0) {
        const merged = {
          ...list[approxIdx],
          ...incoming,
          status: "sent" as const,
        };
        const updated = [...list];
        updated[approxIdx] = merged;
        return {
          messages: { ...state.messages, [roomId]: sortMessages(updated) },
        };
      }

      // 3) 신규 추가
      return {
        messages: {
          ...state.messages,
          [roomId]: sortMessages([...list, incoming]),
        },
      };
    });
  },

  markMessageAsRead: async (messageId: string) => {
    await markMessageAsRead(Number(messageId)); // API는 number 기대
  },

  markMessagesAsReadInRoomAsync: async (roomId: number, myUserId: string) => {
    const { messages } = get();
    const list = messages[roomId] ?? [];
    const unread = list.filter((m) => m.senderId !== myUserId && !m.isRead);
    if (unread.length === 0) return;

    await Promise.all(
      unread.map(async (m) => {
        try {
          await markMessageAsRead(Number(m.id));
          m.isRead = true; // mutate 후 아래 set으로 리렌더 트리거
        } catch (e) {
          console.error(`❌ 메시지 ${m.id} 읽음 처리 실패`, e);
        }
      })
    );

    // 얕은 복사로 리렌더 유도
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: sortMessages([...(state.messages[roomId] ?? [])]),
      },
    }));
  },
}));
