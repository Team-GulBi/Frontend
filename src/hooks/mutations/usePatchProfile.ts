import { client } from "@/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface ProfileRequest {
    image?: string;
    intro: string;
    phone?: string;
    signature?: string;
    sido: string;
    sigungu: string;
    bname: string;
}

export interface ProfileResponse {
    message: string;
    status: string;
    data: null;
}

const patchProfile = async (request: ProfileRequest): Promise<ProfileResponse> => {
    const response = await client.patch<ProfileResponse>("/profiles", request);
    return response.data;
};


const usePatchProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<ProfileResponse, AxiosError, ProfileRequest>({
        mutationFn: patchProfile,
        onSuccess: (data) => {
            console.log(data.message);
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
        onError: (error) => {
            console.error(error);
        },
    });
};

export default usePatchProfile;