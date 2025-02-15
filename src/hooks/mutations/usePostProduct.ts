import { client } from '@/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductDetailResponse } from '../queries/useGetProductDetail';

type ProductRequest = {
  tag: string;
  title: string;
  name: string;
  price: string;
  sido: string;
  sigungu: string;
  bname: string;
  description: string;
  bcategoryId: number;
  mcategoryId: number;
  scategoryId: number;
  images: File[];
  mainImage: File;
};

const postProduct = async (request: ProductRequest): Promise<ProductDetailResponse> => {
  const formData = new FormData();
  const productData = {
    tag: request.tag,
    title: request.title,
    name: request.name,
    price: request.price,
    sido: request.sido,
    sigungu: request.sigungu,
    bname: request.bname,
    description: request.description,
    bcategoryId: request.bcategoryId,
    mcategoryId: request.mcategoryId,
    scategoryId: request.scategoryId,
  };

  formData.append(
    'body',
    new Blob([JSON.stringify(productData)], {
      type: 'application/json',
    }),
  );

  if (request.mainImage) {
    formData.append('mainImage', request.mainImage);
  }

  request.images.forEach((file: File) => {
    formData.append('images', file);
  });

  const response = await client.post<ProductDetailResponse>('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

const usePostProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductDetailResponse, Error, ProductRequest>({
    mutationFn: postProduct,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default usePostProduct;
