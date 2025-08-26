// src/apis/contract.ts
import client from "./client";

/** 공통 API 응답 타입 */
export type ApiResponse<T> = {
  status: string;   // "OK"
  code: string;     // "C001" ...
  message: string;  // 메시지
  data: T;
};

/** 계약서 단건 (applicationId로 조회되는 전체 스키마) — Lender 조회용 */
export type ContractDTO = {
  id: number; // = contractId
  itemName: string;
  specifications: string;
  quantity: number;
  condition: string;
  notes: string;
  rentalStartDate?: string; // "2025-08-16T00:00:00"
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
  lenderName: string;
  borrowerName: string;
};

/** (1) applicationId로 계약서 전체 조회 — Lender 페이지에서 사용 */
export async function getContractByApplicationId(applicationId: number) {
  const { data } = await client.get<ApiResponse<ContractDTO>>(
    `/application/contracts/${applicationId}/applications`
  );
  return data; // ApiResponse<ContractDTO>
}

/** (2) Lender 승인: 최종 캡처본 업로드 (multipart/form-data, key=finalContract) */
export async function putLenderApproval(params: {
  contractId: number;
  file: File | Blob;
  filename?: string;
}) {
  const { contractId, file, filename } = params;
  const form = new FormData();
  form.append("finalContract", file, filename ?? "final_contract.png");

  const { data } = await client.put<ApiResponse<null>>(
    `/application/contracts/${contractId}/lender-approval`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data; // ApiResponse<null>
}

/** (3) (참고) 이전 생성 API — 필요시 유지 */
export async function postContract({
  productId,
  contractData,
  applicationData,
}: {
  productId: number;
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

/* ----------------------- 🔽 Borrower 새 플로우 추가 🔽 ----------------------- */

/** 템플릿 응답 — Borrower 화면 렌더용 */
export type ProductTemplateDTO = {
  templateId: number;
  specification: string;
  condition: string;
  note: string;
  rentalPlace: string;
  returnPlace: string;
  lateInterestRate: number;
  latePenaltyRate: number;
  damageCompensationRate: number;

  lenderName?: string;
  borrowerName?: string;
  productName?: string;
};

/** (A) 템플릿 조회 */
export async function getProductTemplate(productId: number) {
  const { data } = await client.get<ApiResponse<ProductTemplateDTO>>(
    `/products/${productId}/template`
  );
  return data; // ApiResponse<ProductTemplateDTO>
}

/** (B) Borrower 예약(=동의) — multipart/form-data: applicationCreateRequest */
export async function postBorrowerApplication(params: {
  productId: number;
  startDate: string; // ISO
  endDate: string;   // ISO
}) {
  const { productId, startDate, endDate } = params;

  const formData = new FormData();
  formData.append(
    "applicationCreateRequest",
    new Blob([JSON.stringify({ startDate, endDate })], {
      type: "application/json",
    })
  );

  const { data } = await client.post<ApiResponse<null>>(
    `/products/applications/${productId}/product`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data; // ApiResponse<null>
}
