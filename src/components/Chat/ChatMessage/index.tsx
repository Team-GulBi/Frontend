import { useEffect, useState, useRef } from "react";
import { useChatStore } from "@/libraries/stores/useChatStore";
import { useChatSocket } from "@/libraries/stores/useChatSocket";
import { useUserStore } from "@/libraries/stores";
import { convertToKST } from "../date";

interface ChatMessageProps {
  chatRoomId: number;
  name: string;
  selfIntroduction: string;
  imgSrc: string;
}

export const ChatMessage = ({ chatRoomId, name, selfIntroduction, imgSrc }: ChatMessageProps) => {
  const { messages, fetchMessages } = useChatStore();
  const { sendMessage } = useChatSocket();
  const myUserId = Number(useUserStore((state) => state.userId));
  const [messageInput, setMessageInput] = useState("");

  const isConnected = useChatSocket((state) => state.isConnected);

  // ✅ 스크롤 하단 이동용 ref
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [prevChatLog, setPrevChatLog] = useState("");

  useEffect(() => {
    if (chatRoomId) {
      fetchMessages(chatRoomId)
        .then(() => {
          console.log("✅ 채팅 내역 불러오기 완료:", chatRoomId);
          // const loadedMessages = useChatStore.getState().messages[chatRoomId];
          // console.log("📦 불러온 메시지:", loadedMessages);  // ✅ 여기 확인!
        })
        .catch((err) => console.error("❌ 채팅 내역 불러오기 실패:", err));
    }
  }, [chatRoomId]);
  
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleSend = () => {
    if (!messageInput.trim()) return;
    if (myUserId !== null && isConnected) {
      const newMessage = {
        chatRoomId,
        content: messageInput,
        senderId: myUserId,
        timestamp: new Date().toISOString(),
        id: Date.now(),
        isRead: false,
      };

      sendMessage(chatRoomId, messageInput, myUserId);
      // useChatStore.getState().addMessage(chatRoomId, newMessage);
      console.log("📤 메시지 전송 및 상태 업데이트:", newMessage);
    } else {
      console.log("⚠️ WebSocket 연결이 되어 있지 않습니다.");
    }
    setMessageInput("");
  };

  // ✅ 필터링된 메시지 목록
  const chatMessages = Array.isArray(messages[chatRoomId])
    ? messages[chatRoomId].filter((msg) => typeof msg === "object" && msg.content)
    : [];

  // ✅ 메시지 변경 시 스크롤 하단 이동
  useEffect(() => {
  const serialized = JSON.stringify(chatMessages);
  if (serialized !== prevChatLog) {
    console.log("👤 내 userId:", myUserId, " (typeof:", typeof myUserId, ")");
    console.log("🔍 받은 메시지 목록:", chatMessages);
    setPrevChatLog(serialized);
    scrollToBottom();
  }
}, [chatMessages, prevChatLog]);

  return (
    <div className="flex h-[650px] w-[800px] flex-col rounded-[16px] bg-white shadow-lg">
      <div className="flex w-full items-center justify-between rounded-t-[16px] bg-white py-4 px-6">
        <div className="flex items-center">
          <img src={imgSrc} alt="profile" className="mr-5 h-[60px] w-[60px] rounded-full border" />
          <div className="flex flex-col gap-[3px]">
            <span className="text-medium24 font-medium text-neutral-0">{name}</span>
            <span className="font-regular text-xxsmall12 text-neutral-40">{selfIntroduction}</span>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        {chatMessages.map((message, index) => {
          const isMyMessage = myUserId === message.senderId;

          const showDate =
            index === 0 ||
            chatMessages[index - 1]?.timestamp?.slice(0, 10) !== message.timestamp?.slice(0, 10);

          return (
            <div key={message.id || index}>
              {showDate && (
                <div className="flex w-full justify-center">
                  <span className="mb-6 mt-7 text-xsmall14 font-medium text-neutral-50">
                  {convertToKST(message.timestamp, "date") || "날짜 없음음"}
                  </span>
                </div>
              )}

              <div className={`mb-5 flex flex-col ${isMyMessage ? "mr-[20px] items-end" : "ml-[20px] items-start"}`}>
                <div className="flex gap-2">
                  {isMyMessage && (
                    <span className="font-regular self-end text-xxsmall10 text-neutral-50">
                      {convertToKST(message.timestamp)}
                    </span>
                  )}
                  <div className={`rounded-[8px] px-[15px] py-[7px] ${isMyMessage ? "bg-primary-100" : "bg-neutral-80"}`}>
                    <p className="font-regular text-xxsmall12 text-neutral-0">{message.content}</p>
                  </div>
                  {!isMyMessage && (
                    <span className="font-regular self-end text-xxsmall10 text-neutral-50">
                      {convertToKST(message.timestamp)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {/* ✅ 스크롤 이동을 위한 더미 div */}
        <div ref={messageEndRef} />
      </div>

      <div className="w-full rounded-b-[16px] border-t px-4 py-3">
        <div className="flex justify-between">
          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="채팅을 입력해주세요"
            className="font-regular mr-5 flex-grow text-xsmall14 text-neutral-30 outline-none"
          />
          <button onClick={handleSend} className="font-regular rounded-[8px] bg-primary-100 px-5 py-1 text-xsmall14 text-white">
            전송
          </button>
        </div>
      </div>
    </div>
  );
};
