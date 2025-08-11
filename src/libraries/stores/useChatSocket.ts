import { Client } from "@stomp/stompjs";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useChatStore } from "@/libraries/stores/useChatStore";

interface ChatSocketState {
  isConnected: boolean;
  error: string | null;
  connect: (token: string) => void;
  disconnect: () => void;
  sendMessage: (roomId: number, content: string, senderId: number) => void;
}

// ✅ WebSocket URL 자동 선택 (ws:// 또는 wss://)
const getWebSocketURL = () => {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}/ws-stomp`;
};

// ✅ STOMP Client 초기화
const stompClient = new Client({
  brokerURL: getWebSocketURL(),
  debug: (str) => console.log(`STOMP: ${str}`),
  reconnectDelay: 5000, // 자동 재연결 (5초 후 재시도)
  
  onConnect: () => {
    console.log("✅ WebSocket 연결 성공");
    useChatSocket.setState({ isConnected: true, error: null });

    // ✅ 기존 채팅방 메시지 구독
    const { chatRooms, addMessage } = useChatStore.getState();

    if (!chatRooms || chatRooms.length === 0) {
      console.warn("⚠️ 구독할 채팅방이 없습니다.");
      return;
    }

    chatRooms.forEach((room) => {
      console.log(`📩 채팅방 구독 중: /sub/chat/room/${room.id}`);

      stompClient.subscribe(`/sub/chat/room/${room.id}`, (message) => {
        console.log("📩 받은 원본 메시지.body:", message.body); // 👈 이거 추가
        try {
          const parsedData = JSON.parse(message.body);
          console.log("📩 받은 메시지 파싱 결과과:", parsedData);

          if (parsedData && parsedData.chatRoomId) {
            addMessage(parsedData.chatRoomId, parsedData);
          } else {
            console.warn("⚠️ 올바르지 않은 메시지 데이터:", parsedData);
          }
        } catch (error) {
          console.error("🚨 메시지 JSON 파싱 오류:", error, "받은 데이터:", message.body);
        }
      });
    });
  },

  onStompError: (frame) => {
    console.error("🚨 STOMP 오류 발생:", frame.headers, frame.body);
    useChatSocket.setState({ isConnected: false, error: `STOMP 오류: ${frame.body}` });
  },

  onWebSocketError: (event) => {
    console.error("🚨 WebSocket 오류:", event);
    useChatSocket.setState({ isConnected: false, error: "WebSocket 연결 오류" });
  },

  onWebSocketClose: (event) => {
    console.log("❌ WebSocket 닫힘:", event.code, event.reason);
    if (event.code !== 1000) {
      useChatSocket.setState({ isConnected: false, error: `WebSocket 닫힘: ${event.reason}` });
    }
  },
});

export const useChatSocket = create<ChatSocketState>()(
  persist(
    (set) => ({
      isConnected: false,
      error: null,

      connect: (token) => {
        console.log("🔌 WebSocket 연결 시도 중...");
        console.log("🛡️ 사용 중인 토큰:", token);

        // ✅ 중복 연결 방지 (이미 연결된 경우 다시 연결하지 않음)
        if (stompClient.connected) {
          console.warn("⚠️ WebSocket이 이미 연결되어 있습니다.");
          return;
        }

        // ✅ 토큰 인증 설정
        stompClient.connectHeaders = { Authorization: `Bearer ${token}` };

        // ✅ WebSocket 연결 활성화
        stompClient.activate();

        // ✅ 연결 타임아웃 5초 설정
        setTimeout(() => {
          if (!stompClient.connected) {
            console.error("⏳ WebSocket 연결 타임아웃!");
            stompClient.deactivate();
            set({ isConnected: false, error: "연결 타임아웃" });
          }
        }, 5000);
      },

      disconnect: () => {
        if (stompClient.connected) {
          stompClient.deactivate();
          set({ isConnected: false });
          console.log("🔌 WebSocket 연결 해제됨.");
        } else {
          console.warn("⚠️ WebSocket이 이미 해제된 상태입니다.");
        }
      },

      sendMessage: (roomId, content, senderId) => {
        if (!stompClient.connected) {
          console.warn("⚠️ WebSocket이 연결되지 않아 메시지를 보낼 수 없습니다.");
          return;
        }
      
        const token = localStorage.getItem("token"); // ✅ 토큰 가져오기
        if (!token) {
          console.error("❌ 토큰 없음 - 메시지 전송 불가");
          return;
        }
      
        const messagePayload = JSON.stringify({
          chatRoomId: roomId,
          content,
          senderId,
        });
      
        stompClient.publish({
          destination: "/app/chat/message",
          body: messagePayload,
          headers: {
            Authorization: `Bearer ${token}`, // ✅ 헤더 포함!
          },
        });
      
        console.log(`📤 메시지 전송됨: ${messagePayload}`);
      },
      
    }),
    {
      name: "chat-socket",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        isConnected: state.isConnected,
        error: state.error,
      }),
    }
  )
);
(window as any).disconnectWS = () => stompClient.deactivate();