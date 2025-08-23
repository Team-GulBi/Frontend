import { client } from '@/apis';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export type ProductDateResponse = {
  status: string;
  code: string;
  message: string;
  data: ProductDateResult | null;
};

export type ProductDateResult = {
  status: ApplicationStatus[];
  owner: boolean;
};

export type ApplicationStatus = {
  startDate: string;
  endDate: string;
  status: 'USING' | 'RESERVING' | 'REJECTED' | 'RETURNED';
  applicationId: number;
};

const getProductDate = async (productId: number, date: string) => {
  try {
    const response = await client.get<ProductDateResponse>(
      `/products/applications/dates/${productId}/${date}`,
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product date:', error);
    throw error;
  }
};

export const useGetProductDate = (
  productId: number,
  date: string,
  enabled: boolean = true,
): UseQueryResult<ProductDateResponse, AxiosError> => {
  return useQuery<ProductDateResponse, AxiosError>({
    queryKey: ['product-date', productId, date],
    queryFn: () => getProductDate(productId, date),
    enabled: enabled && !!productId && !!date,
    staleTime: 5 * 60 * 1000,
  });
};
