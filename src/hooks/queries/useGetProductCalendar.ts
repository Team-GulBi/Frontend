import { client } from '@/apis';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export type ProductCalendarResponse = {
  status: string;
  code: string;
  message: string;
  data: ProductCalendarResult | null;
};

export type ProductCalendarResult = {
  status: ReservationStatus[];
  owner: boolean;
};

export type ReservationStatus = {
  reservationDate: string;
  hasReserving: boolean;
  hasReservingOrUsing: boolean;
};

const getProductCalendar = async (
  productId: number,
  year: number,
  month: number,
) => {
  try {
    const response = await client.get<ProductCalendarResponse>(
      `/products/applications/calendar/${productId}/${year}-${month.toString().padStart(2, '0')}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useGetProductCalendar = (
  productId: number,
  year: number,
  month: number,
): UseQueryResult<ProductCalendarResponse, AxiosError> => {
  return useQuery<ProductCalendarResponse, AxiosError>({
    queryKey: ['product-calendar', productId, year, month],
    queryFn: () => getProductCalendar(productId, year, month),
    enabled: !!productId && !!year && !!month,
    staleTime: 10 * 60 * 1000,
  });
};
