// src/libraries/stores/useChatSocket.ts
//
// ✅ 목적
// - 채팅 페이지에 들어오면 WebSocket은 "한 번"만 연결(activate)하고,
// - 사용자가 채팅방을 선택할 때마다 해당 방만 구독/해제하는 "단일 활성 구독" 패턴.
//
// ✅ 백엔드 설정(중요)
// - SEND(application prefix):  /pub  (예: @MessageMapping("/chat/message/room/{roomId}") → 클라에서는 "/pub/..." 로 보냄)
// - SUBSCRIBE(broker prefix): /sub  (예: convertAndSend("/sub/chat/room/{roomId}", ...))
// - 현재 전송 목적지:         /pub/chat/message/room/{roomId}
// - 현재 구독 목적지:         /sub/chat/room/{roomId}
//
// ✅ 이점
// - 방 이동 시마다 connect/disconnect 하지 않음(핸드셰이크/지연/실패 감소)
// - "선택한 방"만 큐를 비우며 전달(서버가 큐에서 꺼낼 때 읽음 처리하는 정책과 맞물림)
// - 코드 단순, 문제 추적 쉬움
//
// ------------------------------------------------------------

import { Client, StompSubscription } from "@stomp/stompjs";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useChatStore, normalizeIncomingMessage } from "@/libraries/stores/useChatStore";

interface ChatSocketState {
  // 연결 상태/오류
  isConnected: boolean;
  error: string | null;

  // 현재 "구독 중"인 방 (없으면 undefined)
  activeRoomId?: number;

  // 연결 제어
  connect: (token: string) => void;
  disconnect: () => void;

  // 방 전환 제어(단일 활성 구독)
  switchRoom: (roomId: number) => void; // 방을 클릭했을 때 호출: 기존 구독 해제 → 새 방 구독
  unsubscribeRoom: () => void;          // 현재 방 구독 해제(선택 사항)

  // 메시지 전송
  sendMessage: (
    roomId: number,
    content: string,
    senderId: string,
    clientMessageId?: string
  ) => void;
}

// ✅ 배포/로컬 모두 동작하도록 ws/wss 자동 선택
const getWebSocketURL = () => {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}/ws-stomp`;
};

// ✅ STOMP Client 생성
const stompClient = new Client({
  brokerURL: getWebSocketURL(),
  debug: (str) => console.log(`STOMP: ${str}`),
  reconnectDelay: 5000, // 5초 후 자동 재연결 시도
});

// 현재 "하나"만 유지하는 활성 구독 핸들
let activeSub: StompSubscription | null = null;

// 내부 유틸: 실제 구독을 세팅/이동
function subscribeRoom(roomId: number) {
  if (!stompClient.connected) return;

  // 이전 방 구독 해제
  if (activeSub) {
    try {
      activeSub.unsubscribe();
    } catch {}
    activeSub = null;
  }

  // 새 방 구독
  activeSub = stompClient.subscribe(`/sub/chat/room/${roomId}`, (message) => {
    try {
      const raw = JSON.parse(message.body);
      // 서버/소켓 응답을 프론트 표준 Message로 정규화(타입/시간/필드명 통일)
      const normalized = normalizeIncomingMessage({ ...raw, status: "sent" });
      // Zustand 스토어에 업서트(낙관적 메시지와 중복 방지)
      useChatStore.getState().upsertMessage(normalized.chatRoomId, normalized);
    } catch (e) {
      console.error("🚨 메시지 JSON 파싱 오류:", e, "raw:", message.body);
    }
  });

  // 구독 상태를 스토어에 반영
  useChatSocket.setState({ activeRoomId: roomId });
  console.log(`📩 구독 시작(단일): /sub/chat/room/${roomId}`);
}

// STOMP 라이프사이클 콜백
stompClient.onConnect = () => {
  console.log("✅ WebSocket 연결 성공");
  useChatSocket.setState({ isConnected: true, error: null });

  // 재연결된 경우, 마지막으로 보고 있던 방이 있으면 자동 재구독
  const { activeRoomId } = useChatSocket.getState();
  if (activeRoomId) {
    subscribeRoom(activeRoomId);
  }
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

  // 정상 종료(1000)가 아니면 에러 메시지 저장
  if (event.code !== 1000) {
    useChatSocket.setState({ isConnected: false, error: `WebSocket 닫힘: ${event.reason}` });
  }

  // 활성 구독 정리
  if (activeSub) {
    try {
      activeSub.unsubscribe();
    } catch {}
    activeSub = null;
  }
};

export const useChatSocket = create<ChatSocketState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      error: null,
      activeRoomId: undefined,

      // ✅ 페이지 진입 시 1회 연결: 방 클릭 전에는 구독하지 않음
      connect: (token) => {
        console.log("🔌 WebSocket 연결 시도");
        if (stompClient.connected) {
          console.warn("⚠️ 이미 연결됨");
          return;
        }

        // 서버가 CONNECT 프레임 헤더에서 Authorization을 읽는 경우
        stompClient.connectHeaders = { Authorization: `Bearer ${token}` };
        stompClient.activate();

        // 간단한 타임아웃 보호(5초 내 미연결 시 상태 리셋)
        setTimeout(() => {
          if (!stompClient.connected) {
            console.error("⏳ WebSocket 연결 타임아웃");
            stompClient.deactivate();
            set({ isConnected: false, error: "연결 타임아웃" });
          }
        }, 5000);
      },

      // ✅ 페이지 이탈 시 연결 해제(모든 구독도 함께 종료)
      disconnect: () => {
        if (!stompClient.connected) {
          console.warn("⚠️ 이미 해제됨");
          return;
        }
        stompClient.deactivate();
        set({ isConnected: false, activeRoomId: undefined });
      },

      // ✅ 방 전환: 기존 구독 해제 → 새 방 구독
      switchRoom: (roomId) => {
        if (!stompClient.connected) {
          console.warn("⚠️ WS 미연결 상태에서 switchRoom 호출됨. connect 후 다시 시도 필요");
          return;
        }
        const cur = get().activeRoomId;
        if (cur === roomId) return; // 동일 방이면 무시
        subscribeRoom(roomId);
      },

      // 선택: 현재 방 구독만 명시적으로 해제(채팅창 닫기 등)
      unsubscribeRoom: () => {
        if (activeSub) {
          try {
            activeSub.unsubscribe();
          } catch {}
          activeSub = null;
        }
        set({ activeRoomId: undefined });
        console.log("🛑 방 구독 해제");
      },

      // ✅ 메시지 전송
      // - 서버 application prefix가 '/pub' 이므로 '/pub/...' 로 보냄
      // - 서버가 senderId를 number로 기대할 수 있어 number로 캐스팅
      // - body에 chatRoomId를 포함(경로에도 있지만 서버 DTO 매핑 안전)
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

        const destination = `/pub/chat/message/room/${roomId}`;
        // const senderIdNum = Number(senderId);
        // if (Number.isNaN(senderIdNum)) {
        //   console.warn("⚠️ senderId가 숫자가 아닙니다. 서버가 number를 기대하면 매핑 실패 가능");
        // }

        const payload = JSON.stringify({
          chatRoomId: roomId,     // path에 있지만 body에도 포함(서버 DTO 바인딩 안전)
          content,
          senderId,  // 서버가 number 기대 시 안전
          clientMessageId,        // 서버가 그대로 반사해주면 업서트 정확도 ↑
        });

        // (옵션) 서버 수신 확인용 receipt
        // const receiptId = `send-${clientMessageId || Date.now()}`;
        // stompClient.watchForReceipt(receiptId, (frame) => {
        //   console.log("✅ 서버가 SEND를 수신했습니다 (receipt):", receiptId, frame);
        // });

        stompClient.publish({
          destination,
          body: payload,
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
            // receipt: receiptId, // 필요 시 주석 해제
          },
        });

        console.log(`📤 메시지 전송(${destination}): ${payload}`);
      },
    }),
    {
      name: "chat-socket",
      storage: createJSONStorage(() => sessionStorage),
      // 굳이 모든 함수를 영속화할 필요 없고, 상태 일부만 저장
      partialize: (s) => ({
        isConnected: s.isConnected,
        error: s.error,
        activeRoomId: s.activeRoomId,
      }),
    }
  )
);
