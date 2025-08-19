import { client } from '@/apis';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export type ProductDetailResponse = {
  status: string;
  code: string;
  message: string;
  data: ProductDetailResult | null;
};

type ProductDetailResult = {
  tag: string | null;
  title: string;
  productName: string;
  price: string;
  view?: string;
  sido: string;
  sigungu: string;
  bname: string;
  description: string;
  created_at: string;
  productCategories: {
    bigCategoryId: number;
    bigName: string;
    midCategoryId: number;
    midName: string;
    smallCategoryId: number;
    smallName: string;
  };
  productImages: {
    productImages: {
      id: number;
      url: string;
      main: boolean;
    }[];
  };
  reviews: {
    reviews: ReviewResult[];
  };
  userNickname: string;
};

type ReviewResult = {
  rating?: number;
  averageRating?: number;
  id?: number;
  content?: string;
};

const getProductDetail = async (productId: number) => {
  try {
    const response = await client.get<ProductDetailResponse>(
      `/products/${productId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const useGetProductDetail = (
  productId?: number,
): UseQueryResult<ProductDetailResponse | null, AxiosError> => {
  return useQuery<ProductDetailResponse | null, AxiosError>({
    queryKey: ['product', productId],
    queryFn: () =>
      productId ? getProductDetail(productId) : Promise.resolve(null),
    enabled: !!productId,
  });
};

export default useGetProductDetail;
