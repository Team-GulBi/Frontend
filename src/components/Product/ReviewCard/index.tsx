import { ReactComponent as DefaultProfile } from '@/assets/svgs/defaultProfile.svg';
import { ReactComponent as Star } from '@/assets/svgs/star.svg';
import { ReactComponent as TrashBin } from '@/assets/svgs/trashbin.svg';
import { ReactComponent as EditReview } from '@/assets/svgs/pencil.svg';
import { useDeleteReview } from '@/hooks/mutations';
import { useState } from 'react';
import { DeleteModal } from '@/components/common/DeleteModal';
import { ReviewModal } from '../ReviewModal';

interface ReviewProps {
  reviewId: number;
  nickname: string;
  rating: number;
  createdAt: string;
  content: string;
}

export const ReviewCard = ({reviewId, nickname, rating, createdAt, content}: ReviewProps) => {
  const { mutate: deleteReview } = useDeleteReview();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = () => {
    deleteReview(reviewId);
    setIsDeleteModalOpen(false);
  };
  
  return (
    <div className="flex space-x-[13px] px-[24px]">
      <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-neutral-80 p-[13px]">
        <DefaultProfile />
      </div>
      <div className="flex w-full flex-col space-y-1">
        <div className="flex justify-between">
          <div className="flex items-end">
            <span className="mr-2 text-small16 font-semibold text-neutral-0">
              {nickname}
            </span>
            <Star width="15" height="15" viewBox="0 0 13 13" className="self-center text-[#FCAF15] mt-[2px]" />
            <span className="font-regular ml-1 pt-[1px] text-small16 text-neutral-0">
              {rating}
            </span>
          </div>
          <div className="flex space-x-2">
            <button className="p-1" onClick={() => setIsEditModalOpen(true)} >
              <EditReview width="21" height="21" className="text-neutral-40" />
            </button>
            <button className="p-1" onClick={() => setIsDeleteModalOpen(true)}>
              <TrashBin width="21" height="21" className="text-red-500" />
            </button>
          </div>
        </div>
        <span className="font-regular text-small16 text-neutral-30">{content}</span>
        <span className="font-regular text-xxsmall12 text-neutral-40">{createdAt}</span>
      </div>
      {isDeleteModalOpen && (
        <DeleteModal
          title1="리뷰를"
          title2="리뷰는"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {isEditModalOpen && (
        <ReviewModal
          mode='edit'
          reviewId={reviewId}
          initialRating={rating}
          initialContent={content}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};