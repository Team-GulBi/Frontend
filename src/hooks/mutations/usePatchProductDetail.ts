import { client } from '@/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductDetailResponse } from '../queries/useGetProductDetail';

export type ProductDetailRequest = {
  productId: number;
  productInfo?: {
    tag?: string;
    title?: string;
    name?: string;
    price?: number;
    sido?: string;
    sigungu?: string;
    bname?: string;
    description?: string;
  };
  category?: {
    bcategoryId?: number;
    mcategoryId?: number;
    scategoryId?: number;
  };
  addingImages?: File[];
  toBeUpdatedMainImageFile?: File | null;
  toBeUpdatedMainImageUrl?: string;
  deletedImageId?: number[];
};

const patchProductDetail = async (
  request: ProductDetailRequest,
): Promise<ProductDetailResponse> => {
  const formData = new FormData();

  if (request.productInfo) {
    formData.append(
      'productInfo',
      new Blob([JSON.stringify(request.productInfo)], { type: 'application/json' })
    );
  }

  if (request.category) {
    formData.append(
      'category',
      new Blob([JSON.stringify(request.category)], { type: 'application/json' })
    );
  }

  request.addingImages?.forEach((file) => {
    formData.append('addingImages', file);
  });

  if (request.toBeUpdatedMainImageFile) {
    formData.append('toBeUpdatedMainImageFile', request.toBeUpdatedMainImageFile);
  }

  if (request.toBeUpdatedMainImageUrl) {
    formData.append(
      'toBeUpdatedMainImageUrl',
      new Blob([JSON.stringify({ mainImageUrl: { imageUrl: request.toBeUpdatedMainImageUrl } })], { type: 'application/json' })
    );
  }

  if (request.deletedImageId && request.deletedImageId.length > 0) {
    formData.append(
      'deletedImageId',
      new Blob([JSON.stringify({ imagesId: request.deletedImageId })], { type: 'application/json' })
    );
  }

  const response = await client.patch<ProductDetailResponse>(
    `/api/v1/products/${request.productId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};

const usePatchProductDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductDetailResponse, Error, ProductDetailRequest>({
    mutationFn: patchProductDetail,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ['productDetail'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default usePatchProductDetail;
