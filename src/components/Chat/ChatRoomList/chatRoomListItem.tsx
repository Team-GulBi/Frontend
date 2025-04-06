interface ChatProps {
    name: string;
    product: string;
    imgSrc: string;
    time: string;
    recentMessage: string;
    chats: number;
    onClick: () => void;
  }
  
  export const ChatRoomListItem = ({
    name,
    product,
    imgSrc,
    time,
    recentMessage,
    chats,
    onClick,
  }: ChatProps) => {
    return (
      <div
        className="flex w-full cursor-pointer bg-white px-5 py-[10px] hover:bg-neutral-90"
        onClick={onClick}
      >
        <div className="flex w-full justify-between">
          <div className="flex items-center justify-center">
            <div className="mr-[11px] h-[50px] w-[50px] overflow-hidden rounded-full border">
              <img src={imgSrc} alt={name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col gap-[2px]">
              <div className="flex gap-1">
                <span className="self-center text-xsmall14 font-medium text-neutral-0">
                  {name}
                </span>
                <span className="font-regular self-end text-xxsmall10 text-neutral-40">
                  {product}
                </span>
              </div>
              <span className="font-regular text-xxsmall10 text-neutral-0">
                {recentMessage}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end justify-center gap-1">
            <span className="font-regular self-end text-xxsmall10 text-neutral-50">
              {time}
            </span>
            <div
              className={`flex h-[16px] w-[16px] items-center justify-center rounded-full pt-[2px] ${
                chats === 0 ? "bg-none" : "bg-primary-100"
              }`}
            >
              {chats > 0 && (
                <span className="text-xxsmall10 font-light text-white">
                  {chats}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  