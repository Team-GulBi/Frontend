import { client } from '@/apis';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export type ProductApplicationRequest = {
  productId: number;
  date: string;
  timeSlot: string;
  message?: string;
};

export type ProductApplicationResponse = {
  status: string;
  code: string;
  message: string;
  data: {
    applicationId: number;
    status: string;
    createdAt: string;
  } | null;
};

const postProductApplication = async (data: ProductApplicationRequest) => {
  try {
    const response = await client.post<ProductApplicationResponse>(
      '/products/applications',
      data,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const usePostProductApplication = (): UseMutationResult<
  ProductApplicationResponse,
  AxiosError,
  ProductApplicationRequest
> => {
  return useMutation<
    ProductApplicationResponse,
    AxiosError,
    ProductApplicationRequest
  >({
    mutationFn: postProductApplication,
  });
};
