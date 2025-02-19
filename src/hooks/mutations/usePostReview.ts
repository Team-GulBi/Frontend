import { client } from "@/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ReviewRequest {
    productId?: number;
    reviewId?: number;
    rating: number;
    content: string;
}

interface ReviewResponse {
    status: string;
    code: string;
    message: string;
    data: null;
}

const postReview = async (
    request: ReviewRequest
): Promise<ReviewResponse> => {
    const response = await client.post<ReviewResponse>("/review", request);
    return response.data;
};

const usePostReview = () => {
    const queryClient = useQueryClient();

    return useMutation<ReviewResponse, AxiosError, ReviewRequest>({
        mutationFn: postReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review"] });
        },
        onError: (error) => {
            console.error(error);
        }
    })
}

export default usePostReview;