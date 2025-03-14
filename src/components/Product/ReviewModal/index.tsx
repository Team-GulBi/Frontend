import { useState } from "react";
import { ReactComponent as HalfStar } from "@/assets/svgs/halfstar.svg";
import { ReactComponent as XIcon } from "@/assets/svgs/XIcon.svg";
import { usePatchReview, usePostReview } from "@/hooks/mutations";

interface ReviewModalProps {
  mode: "create" | "edit";
  productId?: number;
  reviewId?: number;
  initialRating?: number;
  initialContent?: string;
  onClose: () => void;
}

export const ReviewModal = ({ 
  mode,
  productId,
  reviewId,
  initialRating = 0,
  initialContent = "",
  onClose,
}: ReviewModalProps) => {
  const [reviewContent, setReviewContent] = useState(initialContent);
  const [rating, setRating] = useState(initialRating);
  const { mutate: postReview } = usePostReview();
  const { mutate: patchReview } = usePatchReview();

  const handleSubmit = () => {
    if (!reviewContent.trim()) return;

    if (mode === "edit" && reviewId) {
      if (rating !== initialRating || reviewContent !== initialContent) {
        patchReview(
          { reviewId, rating, content: reviewContent },
          {
            onSuccess: () => {
              onClose();
            },
          }
        );
      }
    } else if (mode === "create" && productId) {
      postReview(
        { productId, rating, content: reviewContent },
        {
          onSuccess: () => {
            setReviewContent("");
            setRating(0);
            onClose();
          },
        }
      );
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[550px]">
        <div className="flex justify-between">
          <div className="text-medium20 font-bold mb-4">
            {mode === "edit" ? "리뷰 수정" : "리뷰 작성"}
          </div>
          <XIcon className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="p-2 border border-neutral-60 h-[150px] bg-white rounded-sm ">
        <div className="my-2 flex justify-start">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="relative flex">
              <HalfStar
                width="19"
                height="19"
                viewBox="0 0 11 19"
                className={`cursor-pointer ${
                  rating >= star - 0.5 ? "text-[#FCAF15]" : "text-neutral-70"
                }`}
                onClick={() => setRating(star - 0.5)}
              />
              <HalfStar
                width="19"
                height="19"
                viewBox="0 0 11 19"
                className={`cursor-pointer transform scale-x-[-1] ml-[-11px] ${
                  rating >= star ? "text-[#FCAF15]" : "text-neutral-70"
                }`}
                onClick={() => setRating(star)}
              />
            </div>
          ))}
          <span className="ml-1 text-medium16 text-neutral-60">
            {rating > 0 ? `${rating}점` : "0점"}
          </span>
        </div>

        <textarea
          placeholder="사용 후기를 알려주세요"
          className="w-full resize-none text-neutral-0 placeholder:font-regular placeholder:text-neutral-40 focus:outline-none px-1"
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
        />
        </div>

        <div className="flex justify-center mt-6">
          <button 
            className="px-8 py-2 bg-secondary-dark text-white text-xsmall14 rounded-md"
            onClick={handleSubmit}
          >
            {mode === "edit" ? "저장" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
};