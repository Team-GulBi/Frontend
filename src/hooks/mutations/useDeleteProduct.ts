import { client } from '@/apis';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteProduct = async (productId: number) => {
  await client.delete(`/products/${productId}`, {
    withCredentials: true,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};