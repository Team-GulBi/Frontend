import { useEffect, useState, useRef } from "react";
import { useChatStore, Message } from "@/libraries/stores/useChatStore";
import { useChatSocket } from "@/libraries/stores/useChatSocket";
import { useUserStore } from "@/libraries/stores";
import { convertToKST } from "../date";

interface ChatMessageProps {
  chatRoomId: number;
  name: string;
  selfIntroduction: string;
  imgSrc: string;
}

function createClientMessageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // @ts-ignore
    return crypto.randomUUID();
  }
  return `cmsg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const ChatMessage = ({ chatRoomId, name, selfIntroduction, imgSrc }: ChatMessageProps) => {
  const { messages, fetchMessages, upsertMessage } = useChatStore();
  const { sendMessage } = useChatSocket();
  const myUserId = useUserStore((s) => s.userId); // string
  const isConnected = useChatSocket((s) => s.isConnected);

  const [messageInput, setMessageInput] = useState("");

  // scroll to bottom
  const messageEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // 최초 로딩 시 방 메시지 가져오기
  useEffect(() => {
    if (chatRoomId) {
      fetchMessages(chatRoomId)
        .then(() => {
          console.log("✅ 채팅 내역 불러오기 완료:", chatRoomId);
        })
        .catch((err) => console.error("❌ 채팅 내역 불러오기 실패:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomId]);

  // 메시지 리스트 선택
  const chatMessages: Message[] = Array.isArray(messages[chatRoomId])
    ? messages[chatRoomId].filter((m) => m && typeof m === "object" && m.content)
    : [];

  // 메시지 변경 시 하단 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleSend = () => {
    if (!messageInput.trim()) return;
    if (!myUserId) return;

    const clientMessageId = createClientMessageId();
    const nowUtcIso = new Date().toISOString();

    // 1) 낙관적 업서트(즉시 내 말풍선)
    const optimistic = {
      id: "", // 서버 id 미정
      content: messageInput,
      senderId: String(myUserId),
      receiverId: null,
      chatRoomId,
      timestamp: nowUtcIso, // 스토어는 UTC만
      isRead: false,
      clientMessageId,
      status: "pending" as const,
    };
    upsertMessage(chatRoomId, optimistic);

    // 2) 실제 전송 (서버가 clientMessageId를 무시해도, 수신 보정 로직이 pending과 매칭)
    if (isConnected) {
      sendMessage(chatRoomId, messageInput, String(myUserId), clientMessageId);
    } else {
      console.warn("⚠️ WebSocket 연결이 없음. 메시지 전송 대기/실패 처리 필요");
      // 필요 시 실패 처리로 전환 가능: upsertMessage(chatRoomId, { ...optimistic, status: "failed" })
    }

    setMessageInput("");
  };

  const isMyMessageRead = (message: Message): boolean => {
    return message.senderId === String(myUserId) && (message.receiverId !== null || message.isRead);
  };

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
          const isMyMessage = String(myUserId) === message.senderId;
          const prevKstDate = index > 0 ? convertToKST(chatMessages[index - 1]?.timestamp, "date") : null;
          const currKstDate = convertToKST(message.timestamp, "date");
          const showDate = index === 0 || prevKstDate !== currKstDate;

          return (
            <div key={message.clientMessageId || message.id || index}>
              {showDate && (
                <div className="flex w-full justify-center">
                  <span className="mb-6 mt-7 text-xsmall14 font-medium text-neutral-50">
                    {convertToKST(message.timestamp, "date") || "날짜 없음"}
                  </span>
                </div>
              )}

              <div
                className={`mb-5 flex flex-col ${
                  isMyMessage ? "mr-[20px] items-end" : "ml-[20px] items-start"
                }`}
              >
                <div className="flex gap-2">
                  {isMyMessage && (
                    <span className="font-regular self-end text-xxsmall10 text-neutral-50">
                      {convertToKST(message.timestamp)}
                    </span>
                  )}
                  <div
                    className={`rounded-[8px] px-[15px] py-[7px] ${
                      isMyMessage ? "bg-primary-100" : "bg-neutral-80"
                    }`}
                  >
                    <p className="font-regular text-xxsmall12 text-neutral-0">{message.content}</p>
                  </div>
                  {!isMyMessage && (
                    <span className="font-regular self-end text-xxsmall10 text-neutral-50">
                      {convertToKST(message.timestamp)}
                    </span>
                  )}
                </div>

                {/* 읽음/상태 표시 */}
                {isMyMessage && (
                  <span className="mt-1 text-[10px] text-neutral-40">
                    {message.status === "pending"
                      ? "전송 중…"
                      : isMyMessageRead(message)
                      ? "읽음"
                      : "전송됨"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
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
          <button
            onClick={handleSend}
            className="font-regular rounded-[8px] bg-primary-100 px-5 py-1 text-xsmall14 text-white"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};
