import { client } from '@/apis';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export type ProfileResponse = {
  phoneNumber: string | null;
  signature: string | null;
};

const getProfile = async (): Promise<ProfileResponse> => {
  const response = await client.get<ProfileResponse>('/users');
  return response.data;
};

const useGetProfile = (): UseQueryResult<ProfileResponse, AxiosError> => {
  return useQuery<ProfileResponse, AxiosError>({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  });
};

export default useGetProfile;
