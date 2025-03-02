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
  tag: string;
  title: string;
  productName: string;
  price: string;
  view?: string;
  rating?: string;
  sido: string;
  sigungu: string;
  bname: string;
  description: string;
  bcategory: CategoryResult;
  mcategory: CategoryResult;
  scategory: CategoryResult;
  created_at: string;
  images: ProductImagesResult;
  reviews: ReviewResult[];
  userPhoto: imageUrl;
  userNickname: string;
};

type ProductImagesResult = {
  productImages: [
    {
      id: number;
      productid: number;
      url: string;
      main: boolean;
    }
  ]
}

type ReviewResult = {
  rating: number;
  averageRating: number;
  id: number;
  content: string;
}

type imageUrl = {
  imageUrl: string;
}

type CategoryResult = {
  id: number;
  name: string;
  parent: CategoryResult | null;
};

const getProductDetail = async (productId: number) => {  
  try {
    const response = await client.get<ProductDetailResponse>(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const useGetProductDetail = (productId?: number): UseQueryResult<ProductDetailResponse | null, AxiosError> => {
  return useQuery<ProductDetailResponse | null, AxiosError>({
    queryKey: ['product', productId],
    queryFn: () => (productId ? getProductDetail(productId) : Promise.resolve(null)),
    enabled: !!productId,
  });
};

export default useGetProductDetail;
