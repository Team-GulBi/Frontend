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
    bCategoryId?: string;
    mCategoryId?: string;
    sCategoryId?: string;
  };
  addingImages?: File[] | null;
  toBeUpdatedMainImageFile?: File | null;
  toBeUpdatedMainimageUrl?: {
    mainImageUrl: string;
  };
  deletedImageId?: {
    imagesId: number[];
  };
};

const patchProductDetail = async (
  request: ProductDetailRequest,
): Promise<ProductDetailResponse> => {
  const formData = new FormData();

  if (request.productInfo && Object.keys(request.productInfo).length > 0) {
    formData.append("productInfo", JSON.stringify(request.productInfo));
  }

  if (request.category && Object.keys(request.category).length > 0) {
    formData.append("category", JSON.stringify(request.category));
  }

  if (request.addingImages && request.addingImages.length > 0) {
    request.addingImages.forEach((file) => {
      formData.append("addingImages", file);
    });
  }

  if (request.toBeUpdatedMainImageFile) {
    formData.append("toBeUpdatedMainImageFile", request.toBeUpdatedMainImageFile);
  }

  if (request.toBeUpdatedMainimageUrl) {
    formData.append("toBeUpdatedMainimageUrl", JSON.stringify(request.toBeUpdatedMainimageUrl));
  }

   if (request.deletedImageId && request.deletedImageId.imagesId.length > 0) {
    formData.append("deletedImageId", JSON.stringify(request.deletedImageId));
  }

  const response = await client.patch<ProductDetailResponse>(
    `/products/${request.productId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    }
  );

  return response.data;
};

const usePatchProductDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductDetailResponse, Error, ProductDetailRequest>({
    mutationFn: patchProductDetail,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export default usePatchProductDetail;