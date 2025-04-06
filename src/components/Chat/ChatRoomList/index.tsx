import { useEffect } from "react";
import { useChatStore } from "@/libraries/stores/useChatStore";
import { useUserStore } from "@/libraries/stores";
import { ChatRoomListItem } from "./chatRoomListItem";


const ChatRoomList = ({ onSelectRoom }: { onSelectRoom: (roomId: number) => void }) => {
  const { chatRooms, fetchChatRooms } = useChatStore();
  const myUserId = useUserStore((state) => state.userId);
  
  useEffect(() => {
    fetchChatRooms();
  }, []);

  // ✅ chatRooms 상태 확인
  useEffect(() => {
    console.log("🟡 ChatRoomList - Zustand에서 가져온 chatRooms:", chatRooms);
  }, [chatRooms]);

  return (
    <div className="w-full">
      {chatRooms.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <span className="pb-12 text-small16 font-regular text-neutral-30">
            채팅 내역이 없습니다
          </span>
        </div>
      ) : (
        chatRooms.map((room, index) => {
          if (!myUserId) return null;
          const isUser1 = room.user1Id === myUserId;
          const otherUserNickname = isUser1 ? room.user2Nickname : room.user1Nickname;

          console.log(`🟢 채팅방 ${index} - 이름: ${otherUserNickname}, ID: ${room.id}`);

          return (
            <ChatRoomListItem
              key={room.id}
              name={otherUserNickname}
              product="상품명"
              imgSrc="/default-profile.png"
              time="시간"
              recentMessage="최근 메시지"
              chats={0}
              onClick={() => onSelectRoom(room.id)}
            />
          );
        })
      )}
    </div>
  );
};

export default ChatRoomList;
