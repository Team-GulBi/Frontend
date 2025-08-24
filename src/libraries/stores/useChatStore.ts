import { create } from "zustand";
// import { persist } from "zustand/middleware";
import { getChatMessages, markMessageAsRead } from "@/apis/chatMessages";
import { getChatRooms } from "@/apis/chatRoom";

/** ---- Types ---- */
export interface Message {
  id: string; // string 통일
  content: string;
  senderId: string; // string 통일
  receiverId: string | null;
  chatRoomId: number;
  timestamp: string; // ISO UTC ("...Z")
  isRead: boolean;
  clientMessageId?: string; // 낙관적 상관키
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

  messages: Record<number, Message[]>;

  fetchChatRooms: () => Promise<void>;
  fetchMessages: (roomId: number) => Promise<void>;

  upsertMessage: (roomId: number, incoming: Message) => void;

  markMessageAsRead: (messageId: string) => Promise<void>;
  markMessagesAsReadInRoomAsync: (roomId: number, myUserId: string) => Promise<void>;
}

/** ---- Utils ---- */
const hasZoneInfo = (s: string) => /(?:Z|[+\-]\d{2}:\d{2}|[+\-]\d{4})$/.test(s);
const trimToMillis = (s: string) => s.replace(/\.(\d{3})\d+$/, ".$1");

/** 서버/소켓 timestamp → ISO UTC
 * - 타임존 없으면 UTC로 간주 (Z/+00:00 부착)
 * - 마이크로초 → 밀리초로 절삭
 */
export const normalizeToUtcIso = (raw: string): string => {
  if (!raw) return new Date().toISOString();
  let s = String(raw).trim();
  s = trimToMillis(s);
  if (!hasZoneInfo(s)) s = `${s}Z`; // 또는 `${s}+00:00`
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

/** 정렬(시간 asc, tie-breaker: id/clientMessageId) */
const sortMessages = (arr: Message[]) =>
  arr.slice().sort((a, b) => {
    if (a.timestamp < b.timestamp) return -1;
    if (a.timestamp > b.timestamp) return 1;
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

/** 서버/소켓 원본 → Message 정규화
 * - 스웨거 기준 필드명: messageId, read
 * - 과거 호환: id, isRead 도 함께 지원
 */
export const normalizeIncomingMessage = (raw: any): Message => {
  const id =
    raw?.messageId != null
      ? String(raw.messageId)
      : raw?.id != null
      ? String(raw.id)
      : "";

  const isRead =
    typeof raw?.read !== "undefined"
      ? Boolean(raw.read)
      : Boolean(raw?.isRead ?? false);

  // senderId/receiverId는 숫자일 수 있음 → string 또는 null
  const senderId =
    raw?.senderId != null ? String(raw.senderId) : "";
  const receiverId =
    raw?.receiverId == null ? null : String(raw.receiverId);

  const chatRoomId = Number(raw?.chatRoomId ?? raw?.roomId ?? 0);

  return {
    id,
    content: raw?.content ?? "",
    senderId,
    receiverId,
    chatRoomId,
    timestamp: normalizeToUtcIso(String(raw?.timestamp ?? new Date().toISOString())),
    isRead,
    clientMessageId: raw?.clientMessageId ? String(raw.clientMessageId) : undefined,
    status: raw?.status ?? "sent",
  };
};

export const useChatStore = create<ChatState>()((set, get) => ({
  chatRooms: [],
  messages: {},

  setchatRooms: (rooms) => {
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
      const m = normalizeIncomingMessage(raw); // ← messageId/read 반영
      m.status = "sent";
      return m;
    });
    set((state) => ({
      messages: { ...state.messages, [roomId]: sortMessages(normList) },
    }));
  },

  upsertMessage: (roomId, incoming) => {
  set((state) => {
    const list = state.messages[roomId] ?? [];
    const updated = [...list];

    // 0) 같은 messageId 이미 있으면 그걸 갱신 (중복 차단)
    if (incoming.id) {
      const i = updated.findIndex((m) => m.id === incoming.id);
      if (i >= 0) {
        updated[i] = { ...updated[i], ...incoming, status: incoming.status ?? "sent" };
        return { messages: { ...state.messages, [roomId]: sortMessages(updated) } };
      }
    }

    // 1) clientMessageId로 매칭 (서버가 반사해주면 여기서 끝)
    if (incoming.clientMessageId) {
      const i = updated.findIndex(
        (m) => m.clientMessageId && m.clientMessageId === incoming.clientMessageId
      );
      if (i >= 0) {
        updated[i] = { ...updated[i], ...incoming, status: "sent" as const };
        return { messages: { ...state.messages, [roomId]: sortMessages(updated) } };
      }
    }

    // 2) 근사 병합 (내용 동일 + 내 메시지 pending 또는 sent&no-id + 시간 근접)
    const IN_WINDOW_MS = 60_000; // 60초 권장
    const incomingTime = new Date(incoming.timestamp).getTime();
    const approxIdx = updated.findIndex((m) => {
      if (m.chatRoomId !== incoming.chatRoomId) return false;
      if (m.senderId !== incoming.senderId) return false;
      if (m.content !== incoming.content) return false;
      const dt = Math.abs(new Date(m.timestamp).getTime() - incomingTime);
      if (dt > IN_WINDOW_MS) return false;
      // receipt로 이미 sent가 되었지만 아직 서버 id가 없는 임시도 병합 허용
      const isPendingOrTemp = m.status === "pending" || (m.status === "sent" && !m.id);
      return isPendingOrTemp;
    });
    if (approxIdx >= 0) {
      updated[approxIdx] = { ...updated[approxIdx], ...incoming, status: "sent" as const };
      return { messages: { ...state.messages, [roomId]: sortMessages(updated) } };
    }

    // 3) 신규 추가
    updated.push(incoming);
    return { messages: { ...state.messages, [roomId]: sortMessages(updated) } };
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
          m.isRead = true;
        } catch (e) {
          console.error(`❌ 메시지 ${m.id} 읽음 처리 실패`, e);
        }
      })
    );

    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: sortMessages([...(state.messages[roomId] ?? [])]),
      },
    }));
  },
}));
