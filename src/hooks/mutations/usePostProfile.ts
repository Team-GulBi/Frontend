import { client } from "@/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface ProfileRequest {
    image: string;
    intro: string;
    phone: string;
    signature: string;
    sido: string;
    sigung: string;
    bname: string;
}

export interface ProfileResponse {
    message: string;
    status: string;
    data: null;
}

const postProfile = async (request: ProfileRequest): Promise<ProfileResponse> => {
    const response = await client.post<ProfileResponse>("/profiles", request);
    return response.data;
};


const usePostProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<ProfileResponse, AxiosError, ProfileRequest>({
        mutationFn: postProfile,
        onSuccess: (data) => {
            console.log(data.message);
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
        onError: (error) => {
            console.error(error);
        },
    });
};

export default usePostProfile;