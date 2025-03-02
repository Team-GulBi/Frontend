import { ReactComponent as Send } from "@/assets/svgs/send.svg";
import { ReactComponent as HalfStar } from "@/assets/svgs/halfstar.svg";
import { usePostReview } from "@/hooks/mutations";
import { useState } from "react";

interface ReviewInputProps {
    productId: number;
}

export const ReviewInput = ({ productId }: ReviewInputProps) => {
    const [reviewContent, setReviewContent] = useState("");
    const [rating, setRating] = useState(0);
    const { mutate } = usePostReview();

    const handleSubmit = () => {
        if (!reviewContent.trim()) return;
        mutate(
          {
            productId,
            rating,
            content: reviewContent,
          },
          {
            onSuccess: () => {
              setReviewContent("");
              setRating(0);
            },
          }
        );
      };

    return (
        <div className="flex flex-col w-full bg-white p-4 rounded-md border border-neutral-60">
            <div className="flex mb-2 items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="relative flex">
                        <HalfStar
                            width="11"
                            height="19"
                            viewBox="0 0 11 19"
                            className={`cursor-pointer ${
                                rating >= star - 0.5 ? "text-[#FCAF15]" : "text-gray-300"
                            }`}
                            onClick={() => setRating(star - 0.5)}
                        />
                        <HalfStar
                            width="11"
                            height="19"
                            viewBox="0 0 11 19"
                            className={`cursor-pointer transform scale-x-[-1] ml-[-2px] ${
                                rating >= star ? "text-[#FCAF15]" : "text-gray-300"
                            }`}
                            onClick={() => setRating(star)}
                        />
                    </div>
                ))}
                <span className="text-small15 ml-1 text-small16 text-neutral-60">
                    {rating > 0 ? `${rating}점` : "0점"}
                </span>
            </div>

            <textarea
                placeholder="사용 후기를 알려주세요"
                className="w-full bg-white rounded-sm resize-none text-xsmall14 text-neutral-0 placeholder:font-regular placeholder:text-neutral-40 focus:outline-none"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
            />

            <div className="flex justify-end mt-3">
                <Send
                    width="24"
                    height="24"
                    className={`cursor-pointer transition-opacity ${
                        rating === 0 || !reviewContent.trim() ? "opacity-50" : "opacity-100"
                    }`}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
};