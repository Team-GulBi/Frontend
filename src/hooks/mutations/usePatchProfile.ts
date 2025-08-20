import { client } from '@/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export interface ProfileRequest {
  phoneNumber: string;
  file: File;
}

export interface ProfileResponse {
  message: string;
  status: string;
  data: null;
}

const patchProfile = async (
  request: ProfileRequest,
): Promise<ProfileResponse> => {
  const formData = new FormData();

  formData.append('file', request.file);

  const response = await client.patch<ProfileResponse>(
    `/users?phoneNumber=${request.phoneNumber}`,
    formData,
    {
      headers: { 'Content-Type': undefined as any },
      transformRequest: [
        (data, headers) => {
          if (data instanceof FormData) {
            if (headers) {
              delete (headers as any)['Content-Type'];
              delete (headers as any)['content-type'];
            }
            return data;
          }
          return data;
        },
      ],
    },
  );
  return response.data;
};

const usePatchProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileResponse, AxiosError, ProfileRequest>({
    mutationFn: patchProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export default usePatchProfile;
