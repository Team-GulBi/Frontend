import { client } from '@/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductDetailResponse } from '../queries/useGetProductDetail';

type ProductRequest = {
  product: {
    title: string;
    name: string;
    price: number;
    sido: string;
    sigungu: string;
    bname: string;
    description: string;
    bcategoryId: number;
    mcategoryId: number;
    scategoryId: number;
  };
  template: {
    specification: string;
    condition: string;
    note: string;
    rentalPlace: string;
    returnPlace: string;
    lateInterestRate: number;
    latePenaltyRate: number;
    damageCompensationRate: number;
  };
  images: File[];
  mainImage: File;
};

const postProduct = async (
  request: ProductRequest,
): Promise<ProductDetailResponse> => {
  const formData = new FormData();
  const productData = {
    title: request.product.title,
    name: request.product.name,
    price: request.product.price,
    sido: request.product.sido,
    sigungu: request.product.sigungu,
    bname: request.product.bname,
    description: request.product.description,
    bcategoryId: request.product.bcategoryId,
    mcategoryId: request.product.mcategoryId,
    scategoryId: request.product.scategoryId,
  };

  const templateData = {
    specification: request.template.specification,
    condition: request.template.condition,
    note: request.template.note,
    rentalPlace: request.template.rentalPlace,
    returnPlace: request.template.returnPlace,
    lateInterestRate: request.template.lateInterestRate,
    latePenaltyRate: request.template.latePenaltyRate,
    damageCompensationRate: request.template.damageCompensationRate,
  };

  formData.append(
    'product',
    new Blob([JSON.stringify(productData)], {
      type: 'application/json',
    }),
  );

  formData.append(
    'template',
    new Blob([JSON.stringify(templateData)], {
      type: 'application/json',
    }),
  );

  if (request.mainImage) {
    formData.append('mainImage', request.mainImage);
  }

  request.images
    .filter((file) => file !== request.mainImage)
    .forEach((file) => {
      formData.append('images', file);
    });

  const response = await client.post<ProductDetailResponse>(
    '/products',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};

const usePostProduct = (
  onSuccess?: () => void,
  onError?: (error: Error) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation<ProductDetailResponse, Error, ProductRequest>({
    mutationFn: postProduct,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ['product'] });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error(error);
      if (onError) {
        onError(error);
      }
    },
  });
};

export default usePostProduct;
