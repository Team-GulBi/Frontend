// src/pages/contract/components/ContractInput.tsx
import { ProductTemplateDTO } from "@/apis/contract";

type Props = {
  template: ProductTemplateDTO | null; // GET /products/{productId}/template
  startDate: string; // ISO (분·초 00:00)
  endDate: string;   // ISO (분·초 00:00)
};

const fmt = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d
    .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .replace(/\./g, "-")
    .replace(/ /g, "")
    .replace(/-$/, "");
};

export function ContractInput({ template, startDate, endDate }: Props) {
  if (!template) {
    return (
      <div className="flex w-full min-h-[84%] items-center justify-center">
        템플릿을 불러오는 중...
      </div>
    );
  }

  const lenderName = template.lenderName ?? "대여인(확인중)";
  const borrowerName = template.borrowerName ?? "차용인(확인중)";
  const itemName = template.itemName ?? "물품명(확인중)";

  return (
    <div className="flex flex-col w-full h-full px-8">
      <h1 className="text-3xl font-bold text-center mb-8">차용 계약서(차용인 ver)</h1>

      {/* 당사자 표시 */}
      <div className="space-y-1">
        <p className="font-extrabold">
          <strong>대여인:</strong>{" "}
          <span className="underline underline-offset-2">{lenderName}</span>
        </p>
        <p>
          <strong>차용인:</strong>{" "}
          <span className="underline underline-offset-2">{borrowerName}</span>
        </p>
      </div>

      {/* 물품 정보 */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">제 1조 (물품 및 상태)</h2>
      <table className="table-auto border-collapse border border-gray-400 w-full text-left mb-4">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">물품명</th>
            <th className="border border-gray-400 px-4 py-2">형식 및 규격</th>
            <th className="border border-gray-400 px-4 py-2">상태</th>
            <th className="border border-gray-400 px-4 py-2">비고</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 px-4 py-2 underline underline-offset-2">
              {itemName}
            </td>
            <td className="border border-gray-400 px-4 py-2 underline underline-offset-2">
              {template.specification}
            </td>
            <td className="border border-gray-400 px-4 py-2 underline underline-offset-2">
              {template.condition}
            </td>
            <td className="border border-gray-400 px-4 py-2">
              {template.note || "-"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 장소/기간 */}
      <h2 className="text-2xl font-semibold mt-6 mb-2">제 2조 (차용 기간 및 장소)</h2>
      <div className="space-y-1">
        <p>
          ① 차용 기간은{" "}
          <strong className="underline underline-offset-2">{fmt(startDate)}</strong> 부터{" "}
          <strong className="underline underline-offset-2">{fmt(endDate)}</strong> 까지로 한다.
        </p>
        <p>
          ② 대여 장소는{" "}
          <strong className="underline underline-offset-2">{template.rentalPlace}</strong>
          {" "}로 하고, 반납 장소는{" "}
          <strong className="underline underline-offset-2">{template.returnPlace}</strong>
          {" "}로 한다.
        </p>
      </div>

      {/* 비용/지연 */}
      <h2 className="text-2xl font-semibold mt-6 mb-2">제 3조 (임대료 및 지연 손해금)</h2>
      <div className="space-y-1">
        <p>
          ① 임대료 및 지급 시점은 상품 상세 및 별도 안내에 따른다.
        </p>
        <p>
          ② 차용인이 약정된 기일을 초과하여 임대료 지급을 지체한 경우, 지연 이자율{" "}
          <strong className="underline underline-offset-2">{template.lateInterestRate}%</strong>
          {" "}를 적용한다.
        </p>
        <p>
          ③ 차용인이 약정된 반납일을 지체한 경우, 지연 손해금{" "}
          <strong className="underline underline-offset-2">{template.latePenaltyRate}%</strong>
          {" "}를 적용한다.
        </p>
      </div>

      {/* 손상/배상 */}
      <h2 className="text-2xl font-semibold mt-6 mb-2">제 4조 (위험부담 및 면책)</h2>
      <div className="space-y-1">
        <p>
          ① 차용인의 귀책사유로 물품에 파손·훼손·멸실이 발생한 경우, 차용인은 신품가의{" "}
          <strong className="underline underline-offset-2">{template.damageCompensationRate}%</strong>
          {" "}에 해당하는 금액을 배상한다.
        </p>
        <p>
          ② 천재지변, 사변, 국가 비상사태 등 불가항력 사유로 발생한 손해에 대해서는 배상책임을 면한다.
        </p>
      </div>

      {/* 유의/부가 조항 (선택적) */}
      <h2 className="text-2xl font-semibold mt-6 mb-2">제 5조 (기타)</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>본 계약에 명시되지 않은 사항은 관계 법령 및 일반 상관례를 따른다.</li>
        <li>필요 시 대여인과 차용인은 상호 합의하여 별도의 특약을 추가할 수 있다.</li>
      </ul>

      <p className="mt-6 text-center text-sm text-gray-500">
        ※ 본 화면은 템플릿 기반의 계약 요약본으로, 차용인이 동의 시 서버에서 예약 및 승인 절차가 자동 처리됩니다.
      </p>
    </div>
  );
}
