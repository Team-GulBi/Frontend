import { client } from "@/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const patchProfileSignature = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await client.patch('/profiles/signature', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const usePatchProfileSignature = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: patchProfileSignature,
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries({queryKey: ["profile"]});
        },
        onError: (error) => {
            console.error(error);
        },
    });
};

export default usePatchProfileSignature;