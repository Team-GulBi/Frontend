import { client } from "@/apis";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type ProfileResponse = {
  image: string;
  intro: string;
  phone: string;
  signature: string;
  sido: string;
  sigungu: string;
  bname: string;
};

const getProfile = async(userId: number): Promise<ProfileResponse> => {
    const response = await client.get<ProfileResponse>(`/profiles/${userId}`);
    return response.data;
};

const useGetProfile = (userId: number): UseQueryResult<ProfileResponse, AxiosError> => {
    return useQuery<ProfileResponse, AxiosError>({
        queryKey: ['profile', userId],
        queryFn: () => (getProfile(userId)),
        enabled: !!userId,
    });
};

export default useGetProfile;