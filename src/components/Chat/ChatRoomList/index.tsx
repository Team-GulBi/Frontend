import { useEffect } from "react";
import { useChatStore } from "@/libraries/stores/useChatStore";
import { useUserStore } from "@/libraries/stores";
import { ChatRoomListItem } from "./chatRoomListItem";
import { convertToKST } from "@/components/Chat/date"; 

const ChatRoomList = ({ onSelectRoom }: { onSelectRoom: (roomId: number) => void }) => {
  const { chatRooms, messages, fetchChatRooms } = useChatStore();
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
          const isUser1 = String(room.user1Id) === String(myUserId);
          const otherUserNickname = isUser1 ? room.user2Nickname : room.user1Nickname;

          console.log(`🟢 채팅방 ${index} - 이름: ${otherUserNickname}, ID: ${room.id}`);

          const roomMessages = messages[room.id] || [];
          const lastMessage = roomMessages[roomMessages.length - 1];
          const recentMessage = lastMessage?.content || "메시지가 없습니다";
          const time = convertToKST(lastMessage?.timestamp); // ✅ 한국시간 포맷
          const unreadCount = roomMessages.filter(
            (msg) => msg.senderId !== myUserId && !msg.isRead
          ).length;

          return (
            <ChatRoomListItem
              key={room.id}
              name={otherUserNickname}
              product="상품명"
              imgSrc="/default-profile.png"
              time={time}
              recentMessage={recentMessage}
              chats={unreadCount}

              onClick={() => onSelectRoom(room.id)}
            />
          );
        })
      )}
    </div>
  );
};

export default ChatRoomList;
