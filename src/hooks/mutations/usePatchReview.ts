import { client } from "@/apis";
import { ReviewRequest, ReviewResponse } from "./usePostReview";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const patchReview = async(
    request: ReviewRequest
): Promise<ReviewResponse> => {
    const response = await client.patch<ReviewResponse>("/review", request);
    return response.data;
};

const usePatchReview = () => {
    const queryClient = useQueryClient();

    return useMutation<ReviewResponse, AxiosError, ReviewRequest>({
        mutationFn: patchReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review"] });
        },
        onError: (error) => {
            console.error(error);
        },
    });
}

export default usePatchReview;