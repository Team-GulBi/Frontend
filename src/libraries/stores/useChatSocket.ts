import { Client, StompSubscription } from "@stomp/stompjs";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useChatStore, normalizeIncomingMessage } from "@/libraries/stores/useChatStore";

interface ChatSocketState {
  isConnected: boolean;
  error: string | null;

  connect: (token: string) => void;
  disconnect: () => void;

  sendMessage: (
    roomId: number,
    content: string,
    senderId: string,
    clientMessageId?: string
  ) => void;
}

const getWebSocketURL = () => {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}/ws-stomp`;
};

const stompClient = new Client({
  brokerURL: getWebSocketURL(),
  debug: (str) => console.log(`STOMP: ${str}`),
  reconnectDelay: 5000,
});

// 중복 구독 방지
const subscriptions = new Map<number, StompSubscription>();

const syncSubscriptions = () => {
  const { chatRooms } = useChatStore.getState();
  if (!stompClient.connected) return;

  const wantIds = new Set(chatRooms.map((r) => r.id));

  // 빠진 방 정리
  for (const [roomId, sub] of subscriptions.entries()) {
    if (!wantIds.has(roomId)) {
      try {
        sub.unsubscribe();
      } catch {}
      subscriptions.delete(roomId);
    }
  }

  // 신규 방 구독
  for (const room of chatRooms) {
    if (subscriptions.has(room.id)) continue;

    const sub = stompClient.subscribe(`/sub/chat/room/${room.id}`, (message) => {
      try {
        const raw = JSON.parse(message.body);
        const normalized = normalizeIncomingMessage({ ...raw, status: "sent" });
        useChatStore.getState().upsertMessage(normalized.chatRoomId, normalized);
      } catch (e) {
        console.error("🚨 메시지 JSON 파싱 오류:", e, "raw:", message.body);
      }
    });

    subscriptions.set(room.id, sub);
    console.log(`📩 구독 시작: /sub/chat/room/${room.id}`);
  }
};

stompClient.onConnect = () => {
  console.log("✅ WebSocket 연결 성공");
  useChatSocket.setState({ isConnected: true, error: null });

  // 최초 동기화
  syncSubscriptions();

  // 방 목록 변경 감지 (기본 subscribe 시그니처: listener(state, prevState))
  const unsubscribeStore = useChatStore.subscribe((state, prev) => {
    if (state.chatRooms !== prev.chatRooms) {
      syncSubscriptions();
    }
  });

  // 연결 끊길 때 스토어 watcher 해제
  (stompClient as any).__offRoomsWatcher = () => {
    try {
      unsubscribeStore();
    } catch {}
  };
};

stompClient.onStompError = (frame) => {
  console.error("🚨 STOMP 오류 발생:", frame.headers, frame.body);
  useChatSocket.setState({ isConnected: false, error: `STOMP 오류: ${frame.body}` });
};

stompClient.onWebSocketError = (event) => {
  console.error("🚨 WebSocket 오류:", event);
  useChatSocket.setState({ isConnected: false, error: "WebSocket 연결 오류" });
};

stompClient.onWebSocketClose = (event) => {
  console.log("❌ WebSocket 닫힘:", event.code, event.reason);
  if (event.code !== 1000) {
    useChatSocket.setState({ isConnected: false, error: `WebSocket 닫힘: ${event.reason}` });
  }
  // 구독 정리
  for (const [, sub] of subscriptions) {
    try {
      sub.unsubscribe();
    } catch {}
  }
  subscriptions.clear();

  // 방 watcher 해제
  if ((stompClient as any).__offRoomsWatcher) {
    (stompClient as any).__offRoomsWatcher();
    (stompClient as any).__offRoomsWatcher = undefined;
  }
};

export const useChatSocket = create<ChatSocketState>()(
  persist(
    (set) => ({
      isConnected: false,
      error: null,

      connect: (token) => {
        console.log("🔌 WebSocket 연결 시도");
        if (stompClient.connected) {
          console.warn("⚠️ 이미 연결됨");
          return;
        }
        stompClient.connectHeaders = { Authorization: `Bearer ${token}` };
        stompClient.activate();

        setTimeout(() => {
          if (!stompClient.connected) {
            console.error("⏳ WebSocket 연결 타임아웃");
            stompClient.deactivate();
            set({ isConnected: false, error: "연결 타임아웃" });
          }
        }, 5000);
      },

      disconnect: () => {
        if (!stompClient.connected) {
          console.warn("⚠️ 이미 해제됨");
          return;
        }
        stompClient.deactivate();
        set({ isConnected: false });
      },

      sendMessage: (roomId, content, senderId, clientMessageId) => {
        if (!stompClient.connected) {
          console.warn("⚠️ WebSocket 미연결 - 전송 불가");
          return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ 토큰 없음 - 전송 불가");
          return;
        }

        const payload = JSON.stringify({
          chatRoomId: roomId,
          content,
          senderId,          // string
          clientMessageId,   // 서버가 무시해도 OK
        });

        stompClient.publish({
          destination: "/app/chat/message",
          body: payload,
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(`📤 메시지 전송: ${payload}`);
      },
    }),
    {
      name: "chat-socket",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ isConnected: s.isConnected, error: s.error }),
    }
  )
);
