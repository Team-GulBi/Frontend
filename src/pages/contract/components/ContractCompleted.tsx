import React, { useRef, forwardRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";

interface ContractProps {
  // ✅ API에서 내려오는 이름
  lenderName: string;
  borrowerName: string;

  // ✅ 물품/조항
  itemName: string;
  specifications: string;
  quantity: number;
  condition: string;
  notes?: string;

  // ✅ 기간/장소 (상세주소 제거)
  rentalStartDate: string;  // ← 추가
  rentalEndDate: string;
  rentalPlace: string;
  returnPlace: string;

  // ✅ 금액/비율
  rentalFee: number;
  lateInterestRate: number;
  latePenaltyRate: number;
  damageCompensationRate: number;

  // ✅ 날짜 표기(문서 하단 날짜)
  createdDate: string;

  // ✅ 서명(URL)
  borrowerSignatureUrl?: string;
  lenderSignatureUrl?: string;
  showLenderSignature?: boolean;

  // (선택) 승인 상태 뱃지용
  lenderApproval?: boolean;
  borrowerApproval?: boolean;
}

const fmt = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d
    .toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/\./g, ".")
    .replace(/-\s*(?=\d{2}:)/, " ") 
    .replace(/-+$/, ""); 
};

export const ContractCompleted = ({
  lenderName,
  borrowerName,
  itemName,
  specifications,
  quantity,
  condition,
  notes,
  rentalStartDate,
  rentalEndDate,
  rentalPlace,
  returnPlace,
  rentalFee,
  lateInterestRate,
  latePenaltyRate,
  damageCompensationRate,
  createdDate,
  borrowerSignatureUrl,
  lenderSignatureUrl,
  showLenderSignature = false,
  lenderApproval,
  borrowerApproval,
}: ContractProps) => {
  return (
    <div className="flex flex-col w-full h-full px-8">
      <div className="flex w-full h-[85%] justify-center items-center overflow-hidden" />
      <h1 className="text-3xl font-bold text-center mb-8">차용 계약서(대여인 ver)</h1>

      {/* 간단한 상태 뱃지 */}
      <div className="mb-4 flex gap-2 justify-center">
        {typeof lenderApproval === "boolean" && (
          <span className={`px-3 py-1 rounded-full text-sm ${lenderApproval ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
            대여인 승인 {lenderApproval ? "완료" : "대기"}
          </span>
        )}
        {typeof borrowerApproval === "boolean" && (
          <span className={`px-3 py-1 rounded-full text-sm ${borrowerApproval ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
            차용인 승인 {borrowerApproval ? "완료" : "대기"}
          </span>
        )}
      </div>

      {/* 당사자 */}
      <p className="font-extrabold">
        <strong>대여인:</strong>{" "}
        <span className="underline underline-offset-2">{lenderName}</span>
      </p>
      <p className="mt-1">
        <strong>차용인:</strong>{" "}
        <span className="underline underline-offset-2">{borrowerName}</span>
      </p>

      {/* 물품 정보 */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">제 1조 (물품 및 상태)</h2>
      <table className="table-auto border-collapse border border-gray-400 w-full text-left mb-6">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">물품명</th>
            <th className="border border-gray-400 px-4 py-2">형식 및 규격</th>
            <th className="border border-gray-400 px-4 py-2">수량</th>
            <th className="border border-gray-400 px-4 py-2">상태</th>
            <th className="border border-gray-400 px-4 py-2">비고</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 px-4 py-2 underline underline-offset-2">{itemName}</td>
            <td className="border border-gray-400 px-4 py-2 underline underline-offset-2">{specifications}</td>
            <td className="border border-gray-400 px-4 py-2 underline underline-offset-2">{quantity}</td>
            <td className="border border-gray-400 px-4 py-2 underline underline-offset-2">{condition}</td>
            <td className="border border-gray-400 px-4 py-2">{notes || "-"}</td>
          </tr>
        </tbody>
      </table>

      {/* 기간/장소 (상세주소 제거) */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">제 2조 (차용 기간 및 장소)</h2>
      <p>
        ① 차용 기간은{" "}
        <strong><span className="underline underline-offset-2">{fmt(rentalStartDate)}</span></strong>
        {" "}부터{" "}
        <strong><span className="underline underline-offset-2">{fmt(rentalEndDate)}</span></strong>
        {" "}까지로 한다.
      </p>
      <p className="mt-1">
        ② 대여 장소는{" "}
        <strong><span className="underline underline-offset-2">{rentalPlace}</span></strong>
        {" "}로 하고, 반납 장소는{" "}
        <strong><span className="underline underline-offset-2">{returnPlace}</span></strong>
        {" "}로 한다.
      </p>

      {/* 비용/지연 */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">제 3조 (임대료 및 지연 손해금)</h2>
      <p>
        ① 임대료는{" "}
        <strong><span className="underline underline-offset-2">{rentalFee ? rentalFee.toLocaleString() : "0"}원</span></strong>
        {" "}으로 한다.
      </p>
      <p className="mt-1">
        ② 차용인이 임대료 지급을 지체한 경우, 지연 이자율{" "}
        <strong><span className="underline underline-offset-2">{lateInterestRate}%</span></strong>
        {" "}를 적용한다.
      </p>
      <p className="mt-1">
        ③ 차용인이 반납을 지체한 경우, 지연 손해금{" "}
        <strong><span className="underline underline-offset-2">{latePenaltyRate}%</span></strong>
        {" "}를 적용한다.
      </p>

      {/* 손상/배상 */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">제 4조 (위험부담 및 면책)</h2>
      <p>
        ① 차용인의 귀책으로 물품에 파손·훼손·멸실이 발생한 경우, 차용인은 신품가의{" "}
        <strong><span className="underline underline-offset-2">{damageCompensationRate}%</span></strong>
        {" "}에 해당하는 금액을 배상한다.
      </p>
      <p className="mt-1">
        ② 천재지변, 사변, 국가 비상사태 등 불가항력 사유로 발생한 손해에 대해서는 배상책임을 면한다.
      </p>

      {/* 날짜 */}
      <p className="mt-6 font-bold text-center">
        <span className="underline underline-offset-2">{createdDate}</span>
      </p>

      {/* 서명 */}
      <div className="mt-8 text-center">
        <p className="mb-4">
          <strong>대여인:</strong>{" "}
          <span className="underline underline-offset-2">{lenderName}</span> (서명)
          {showLenderSignature && lenderSignatureUrl && (
            <img
              src={lenderSignatureUrl}
              alt="대여인 서명"
              crossOrigin="anonymous"
              className="inline-block ml-2 border border-gray-300"
              style={{ width: "100px", height: "auto" }}
            />
          )}
        </p>

        <p className="mb-8">
          <strong>차용인:</strong>{" "}
          <span className="underline underline-offset-2">{borrowerName}</span> (서명)
          {borrowerSignatureUrl && (
            <img
              src={borrowerSignatureUrl}
              alt="차용인 서명"
              crossOrigin="anonymous"
              className="inline-block ml-2 border border-gray-300"
              style={{ width: "100px", height: "auto" }}
            />
          )}
        </p>
      </div>
    </div>
  );
};

export const ContractCapture = forwardRef<any, { children: React.ReactNode }>((props, ref) => {
  const contractRef = useRef<HTMLDivElement>(null);

  const handleCapture = async () => {
    const el = contractRef.current;
    if (!el) return null;

    try {
      const original = el.style.cssText;
      el.style.height = "auto";
      el.style.width = "100vw";
      el.style.transform = "scale(1)";
      el.style.overflow = "visible";

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        width: el.scrollWidth,
        height: el.scrollHeight,
      });

      el.style.cssText = original;

      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      return blob;
    } catch (e) {
      console.error("캡처 오류:", e);
      return null;
    }
  };

  useImperativeHandle(ref, () => ({ capture: handleCapture }));
  return <div ref={contractRef}>{props.children}</div>;
});
