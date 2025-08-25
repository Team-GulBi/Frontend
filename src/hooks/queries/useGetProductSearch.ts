import { client } from '@/apis';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export interface ProductListResponse {
  status: string;
  code: string;
  message: string;
  data: ProductListData;
}

export interface ProductListData {
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

export interface SearchParams {
  query: string;
  detail: string;
  size: number;
  sort?: string;
  lastId?: number;
  lastTime?: string;
}

export interface CursorParam {
  lastId: number;
  lastTime: string;
}

const getProductSearch = async (
  params: SearchParams,
): Promise<ProductListResponse> => {
  const response = await client.get<ProductListResponse>('/products/search', {
    params,
  });
  return response.data;
};

const useGetProductSearch = (query: string) => {
  const [size, setSize] = useState(6);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth >= 1024) {
        setSize(6);
      } else {
        setSize(4);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return useInfiniteQuery({
    queryKey: ['product', query, size],
    queryFn: ({ pageParam }: { pageParam: CursorParam | undefined }) => {
      const params: SearchParams = {
        query,
        detail: '제목', // 태그 추후 수정
        size,
        sort: 'createdAt,DESC',
      };

      if (pageParam) {
        params.lastId = pageParam.lastId;
        params.lastTime = pageParam.lastTime;
      }

      return getProductSearch(params);
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
    enabled: !!query,
  });
};

export default useGetProductSearch;
