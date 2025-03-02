import { ReactComponent as DefaultProfile } from '@/assets/svgs/defaultProfile.svg';
import { ReactComponent as Star } from '@/assets/svgs/star.svg';

export const ReviewCard = () => {
  return (
    <div className="flex space-x-[13px] px-[24px]">
      <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-neutral-80 p-[13px]">
        <DefaultProfile />
      </div>
      <div className="flex w-full flex-col space-y-2">
        <div className="flex justify-between">
          <div className="flex items-end">
            <span className="mr-3 text-small16 font-semibold text-neutral-0">
              시험끝났다핑
            </span>
            <Star 
                width="18" height="18" viewBox="0 0 13 13"
                className="self-center text-[#FCAF15]" />
            <span className="font-regular ml-1 pt-[1px] text-small16 text-neutral-0">
              1.0
            </span>
          </div>
          <span className="font-regular text-xxsmall12 text-neutral-40">
            2024.09.27
          </span>
        </div>
        <span className="font-regular text-small16 text-neutral-30">
          시험이 이제 끝났으니까 열심히 퍼블리싱 해보자...
        </span>
      </div>
    </div>
  );
};
