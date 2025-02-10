export const QUERY_KEYS = {
    CONTRACT: {
      GET_CONTRACT: (id: number) => ["contract", id], // 계약서 상세 조회
      GET_CONTRACT_BY_APPLICATION: (applicationId: number) => ["contractByApplication", applicationId], // 계약 ID 조회
    },
  };
export default QUERY_KEYS;