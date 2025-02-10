import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/libraries/reactQuery/queryKeys";
import client from "./client";

// 1. 계약서 생성 (Lender가 입력)
// export const useCreateContract = () => {
//   return useMutation({
//     mutationFn: async ({ applicationId, contractData }: { applicationId: number; contractData: any }) => {
//       const { data } = await client.post(`/application/${applicationId}/contracts`, contractData);
//       return data;
//     },
//   });
// };
export const useCreateContract = () => {
    return useMutation({
      mutationFn: async ({ applicationId, contractData }: { applicationId: number; contractData: any }) => {
        const { data } = await client.post(`/application/${applicationId}/contracts`, contractData);
        return data;
      },
    });
  };

// 2. 특정 계약서 조회 (Borrower가 확인)
export const useGetContract = (contractId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.CONTRACT.GET_CONTRACT(contractId),
    queryFn: async () => {
      const { data } = await client.get(`/application/1/contracts/${contractId}`);
      return data;
    },
    enabled: !!contractId,
  });
};

// 3. applicationId로 contractId 조회
export const getContractIdByApplication = async (applicationId: number) => {
    const { data } = await client.get(`/application/${applicationId}/contracts`);
    return data;
  };

// 4. Lender 승인
export const useLenderApproval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contractId: number) => {
      const { data } = await client.put(`/application/1/contracts/${contractId}/lender-approval`);
      return data;
    },
    onSuccess: (_, contractId) => {
      queryClient.invalidateQueries(QUERY_KEYS.CONTRACT.GET_CONTRACT(contractId));
    },
  });
};

// 5. Borrower 승인
export const useBorrowerApproval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contractId: number) => {
      const { data } = await client.put(`/application/1/contracts/${contractId}/borrower-approval`);
      return data;
    },
    onSuccess: (_, contractId) => {
      queryClient.invalidateQueries(QUERY_KEYS.CONTRACT.GET_CONTRACT(contractId));
    },
  });
};

// 6. 계약서 이미지 업로드
export const useUploadContractFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ contractId, file }: { contractId: number; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await client.post(`/application/1/contracts/${contractId}/file`, formData);
      return data;
    },
    onSuccess: (_, { contractId }) => {
      queryClient.invalidateQueries(QUERY_KEYS.CONTRACT.GET_CONTRACT(contractId));
    },
  });
};
