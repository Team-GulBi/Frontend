import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
import { getChatMessages, markMessageAsRead } from '@/apis/chatMessages';
import { getChatRooms } from '@/apis/chatRoom';

interface Message {
  id: number;
  content: string;
  senderId: number;
  chatRoomId: number;
  timestamp: string;
  isRead: boolean;
}

interface ChatRoom {
  id: number; // 채팅방 ID
  user1Id: number; // 채팅방 사용자1 ID
  user1Nickname: string;
  // user1: { id: number; nickname: string };
  user2Id: number;
  user2Nickname: string;
  // user2: { id: number; nickname: string };
}

interface ChatState {
  chatRooms: ChatRoom[];
  setchatRooms: (rooms: ChatRoom[]) => void;
  messages: Record<number, Message[]>; // 채팅방별 메시지 관리
  fetchChatRooms: () => Promise<void>;
  fetchMessages: (roomId: number) => Promise<void>;
  addMessage: (roomId: number, message: Message) => void;
  markMessageAsRead: (messageId: number) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  
    (set, get) => ({
      chatRooms: [],
      messages: {},

      setchatRooms: (rooms) => {
        set({ chatRooms: rooms });
      },
      
      fetchChatRooms: async () => {
        console.log("🔵 getChatRooms API 호출"); // ✅ 확인 로그 추가
        const rooms = await getChatRooms();
        console.log("🟢 getChatRooms 응답 데이터:", rooms); // ✅ API 응답 확인
        set({ chatRooms: rooms });
        console.log("🟠 상태 업데이트 후 chatRooms:", get().chatRooms); // ✅ Zustand 상태 확인
      },

      fetchMessages: async (roomId) => {
        const messages = await getChatMessages(roomId);
        set((state) => ({
          messages: { ...state.messages, [roomId]: messages },
        }));
      },

      addMessage: (roomId, message) => {
        set((state) => {
          const currentMessages = state.messages[roomId] || [];
      
          const alreadyExists = currentMessages.some((msg) => msg.id === message.id);
          if (alreadyExists) {
            console.log("🟡 addMessage 중복 메시지 차단:", message);
            return {}; // 상태 변경 없음
          }
      
          return {
            messages: {
              ...state.messages,
              [roomId]: [...currentMessages, message],
            },
          };
        }); //messageid가 중복 아닐 경우에만 기존 메시지 배열에 추가함
        //상대방 오프라인일 경우 receiverId가 null일때 한 번, 상대방 구독시 상대id로 한 번 메시지가 두 번 오므로
        //sender측에서 sender가 전송한 메시지 두 번 뜨는 문제 해결   
      },
      

      markMessageAsRead: async (messageId) => {
        await markMessageAsRead(messageId);
      },
    }),
  
);
