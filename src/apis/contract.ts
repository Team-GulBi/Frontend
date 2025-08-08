// src/apis/contract.ts
import client from "./client";

/** 공통 API 응답 타입 */
export type ApiResponse<T> = {
  status: string;   // "OK"
  code: string;     // "C001" ...
  message: string;  // 메시지
  data: T;
};

/** 계약서 단건 (applicationId로 조회되는 전체 스키마) */
export type ContractDTO = {
  id: number; // = contractId
  itemName: string;
  specifications: string;
  quantity: number;
  condition: string;
  notes: string;
  rentalEndDate: string;       // "2025-08-16T00:00:00"
  rentalPlace: string;
  rentalDetailAddress: string;
  returnDate: string;          // "2025-08-19T00:00:00"
  returnPlace: string;
  returnDetailAddress: string;
  rentalFee: number;
  paymentDate: string;         // "2025-08-15T00:00:00"
  lateInterestRate: number;
  latePenaltyRate: number;
  damageCompensationRate: number;
  lenderApproval: boolean;
  borrowerApproval: boolean;
  url: string;
  lenderSignature: string;     // s3 url
  borrowerSignature: string;   // s3 url
};

/** (1) applicationId로 계약서 전체 조회 */
export async function getContractByApplicationId(applicationId: number) {
  const { data } = await client.get<ApiResponse<ContractDTO>>(
    `/application/contracts/applications/${applicationId}`
  );
  return data; // ApiResponse<ContractDTO>
}

/** (2) Lender 승인: 최종 캡처본 업로드 (multipart/form-data, key=finalContract) */
export async function putLenderApproval(params: {
  contractId: number;
  file: File | Blob; // canvas 캡처 Blob/파일
  filename?: string; // 선택: Blob일 때 서버가 확장자 유추 못 하면 넣어주기
}) {
  const { contractId, file, filename } = params;
  const form = new FormData();
  // 서버 명세: 필드명은 finalContract
  // Blob에 파일명이 없을 경우를 대비해 기본값 부여
  form.append("finalContract", file, filename ?? "final_contract.png");

  const { data } = await client.put<ApiResponse<null>>(
    `/application/contracts/${contractId}/lender-approval`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data; // ApiResponse<null>
}

/** (3) (참고) 계약 생성 API — 이전 작업물 유지가 필요하면 남겨둠 */
export async function postContract({
  productId,
  contractData,
  applicationData,
}: {
  productId: number; // 임시 1
  contractData: Record<string, any>;
  applicationData: { startDate: string; endDate: string };
}) {
  const formData = new FormData();
  formData.append(
    "contractCreateRequest",
    new Blob([JSON.stringify(contractData)], { type: "application/json" })
  );
  formData.append(
    "applicationCreateRequest",
    new Blob([JSON.stringify(applicationData)], { type: "application/json" })
  );

  const { data } = await client.post<ApiResponse<any>>(
    `/application/contracts/${productId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}
