import { client } from "@/apis"
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteReview = async (reviewId: number) => {
    const response = await client.delete(`/review/${reviewId}`);
    return response.data;
};

const useDeleteReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review"] });
        },
        onError: (error) => {
            console.error(error);
        },
    });
};

export default useDeleteReview;