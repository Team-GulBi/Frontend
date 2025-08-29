import { client } from '@/apis';
import { useInfiniteQuery } from '@tanstack/react-query';

export interface UserProductsResponse {
  status: string;
  code: string;
  message: string;
  data: UserProductsData;
}

export interface UserProductsData {
  nickname: string;
  hasNext: boolean;
  products: ProductListResult[];
}

export interface ProductListResult {
  id: number;
  mainImage: string;
  title: string;
  price: number;
  createdAt: string;
}

export interface UserProductsParams {
  size: number;
  sort: string;
  lastId?: number;
  lastTime?: string;
}

export interface CursorParam {
  lastId: number;
  lastTime: string;
}

const getUserProducts = async (
  params: UserProductsParams,
): Promise<UserProductsResponse> => {
  const response = await client.get<UserProductsResponse>('/products/user', {
    params,
  });
  return response.data;
};

const getSpecificUserProducts = async (
  userId: number,
  params: UserProductsParams,
): Promise<UserProductsResponse> => {
  const response = await client.get<UserProductsResponse>(
    `/products/${userId}/user`,
    {
      params,
    },
  );
  return response.data;
};

export const useGetUserProducts = () => {
  const size = 12;

  return useInfiniteQuery({
    queryKey: ['user-products', size],
    queryFn: ({ pageParam }: { pageParam: CursorParam | undefined }) => {
      const params: UserProductsParams = {
        size,
        sort: 'createdAt,DESC',
      };

      if (pageParam) {
        params.lastId = pageParam.lastId;
        params.lastTime = pageParam.lastTime;
      }

      return getUserProducts(params);
    },
    initialPageParam: undefined as CursorParam | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.hasNext) return undefined;

      const lastProduct =
        lastPage.data.products[lastPage.data.products.length - 1];
      return {
        lastId: lastProduct.id,
        lastTime: lastProduct.createdAt,
      };
    },
  });
};

export const useGetSpecificUserProducts = (userId: number) => {
  const size = 12;

  return useInfiniteQuery({
    queryKey: ['specific-user-products', userId, size],
    queryFn: ({ pageParam }: { pageParam: CursorParam | undefined }) => {
      const params: UserProductsParams = {
        size,
        sort: 'createdAt,DESC',
      };

      if (pageParam) {
        params.lastId = pageParam.lastId;
        params.lastTime = pageParam.lastTime;
      }

      return getSpecificUserProducts(userId, params);
    },
    initialPageParam: undefined as CursorParam | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.hasNext) return undefined;

      const lastProduct =
        lastPage.data.products[lastPage.data.products.length - 1];
      return {
        lastId: lastProduct.id,
        lastTime: lastProduct.createdAt,
      };
    },
    enabled: !!userId,
  });
};
