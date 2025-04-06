import { useEffect, useState } from "react";

declare global {
  interface Window {
    stompClient?: any;
  }
}
import { ChatRoomListItem } from "@/components/Chat/ChatRoomList/chatRoomListItem";
import { ChatMessage } from "@/components/Chat/ChatMessage";
import { HeaderWithoutSearch } from "@/components/common/Header";
import { useUserStore } from "@/libraries/stores";
import { useChatSocket } from "@/libraries/stores/useChatSocket";
import { useChatStore } from "@/libraries/stores/useChatStore";

const ChatPage = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const { chatRooms, fetchChatRooms } = useChatStore();
  const myUserId = Number(useUserStore((state) => state.userId));
  const { connect, disconnect, isConnected } = useChatSocket();

  // ✅ WebSocket 연결 후 구독 로직
  const subscribeToRooms = () => {
    const { chatRooms, addMessage } = useChatStore.getState();

    chatRooms.forEach((room) => {
      console.log(`📩 구독 시도: /sub/chat/room/${room.id}`);
      window.stompClient?.subscribe(`/sub/chat/room/${room.id}`, (message: any) => {
        try {
          const parsed = JSON.parse(message.body);
          console.log("📥 받은 메시지:", parsed);
          if (parsed && parsed.chatRoomId) {
            addMessage(parsed.chatRoomId, parsed);
          }
        } catch (e) {
          console.error("❌ 메시지 파싱 실패:", message.body);
        }
      });
    });
  };

  // ✅ WebSocket 연결 + 채팅방 목록 로딩
  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetchChatRooms();
      connect(token);
    };
    initialize();

    return () => disconnect();
  }, []);

  // ✅ chatRooms 변경 시 구독 실행 (isConnected 보장)
  useEffect(() => {
    if (isConnected && chatRooms.length > 0) {
      console.log("🔔 구독 조건 만족, 채팅방 수:", chatRooms.length);
      subscribeToRooms();
    }
  }, [isConnected, chatRooms]);

  const selectedRoom = chatRooms.find((room) => room.id === selectedRoomId);

  return (
    <div className="min-h-screen flex w-screen">
      <HeaderWithoutSearch />
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-20 right-4 z-50 rounded bg-gray-800 p-2 text-white text-xs">
          웹소켓: {isConnected ? "연결됨 ✅" : "연결 안됨 ❌"}
        </div>
      )}
      <div className="flex h-screen w-screen">
        {/* 채팅방 목록 */}
        <div className="flex w-1/4 flex-col border-r bg-white pt-[100px]">
          <span className="mb-[7px] ml-5 text-xlarge26 font-semibold text-neutral-0">
            Chat
          </span>
          <div className="flex h-full w-full flex-col">
            {chatRooms.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <span className="pb-12 text-small16 font-regular text-neutral-30">
                  채팅 내역이 없습니다
                </span>
              </div>
            ) : (
              chatRooms.map((room) => {
                if (!myUserId) return null;
                const isUser1 = room.user1Id === myUserId;
                const otherUserNickname = isUser1 ? room.user2Nickname : room.user1Nickname;
                return (
                  <ChatRoomListItem
                    key={room.id}
                    name={otherUserNickname}
                    product="상품"
                    imgSrc="/default-profile.png"
                    time="시간"
                    recentMessage="최근 메시지"
                    chats={0}
                    onClick={() => setSelectedRoomId(room.id)}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* 채팅창 */}
        <div className="flex w-3/4 items-center justify-center bg-[#F7F7F7] pb-10 pt-[100px]">
          {!selectedRoom ? (
            <div className="flex flex-col items-center justify-center gap-6">
              <span className="text-medium18 font-regular text-neutral-30">
                Yajoba에서 다양한 상품을 경험해보세요!
              </span>
              <a
                href="/"
                className="font-regular rounded-[8px] bg-primary-100 px-[140px] py-3 text-small16 text-white"
              >
                상품 보러가기
              </a>
            </div>
          ) : (
            <ChatMessage
              chatRoomId={selectedRoom.id}
              name={selectedRoom.user1Id === myUserId ? selectedRoom.user2Nickname : selectedRoom.user1Nickname}
              selfIntroduction="상대방 소개"
              imgSrc="/default-profile.png"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
