import React, { useRef, forwardRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";

interface ContractProps {
  // ✅ 이름은 API에서 내려옴
  lenderName: string;
  borrowerName: string;

  itemName: string;
  specifications: string;
  quantity: number;
  condition: string;
  notes?: string;
  rentalEndDate: string;
  rentalPlace: string;
  rentalDetailAddress: string;
  returnDate: string;
  returnPlace: string;
  returnDetailAddress: string;
  rentalFee: number;
  paymentDate: string;
  lateInterestRate: number;
  latePenaltyRate: number;
  damageCompensationRate: number;
  createdDate: string;

  borrowerSignatureUrl?: string;
  lenderSignatureUrl?: string;
  showLenderSignature?: boolean;
}

export const ContractCompleted = ({
  lenderName,
  borrowerName,
  itemName,
  specifications,
  quantity,
  condition,
  notes,
  rentalEndDate,
  rentalPlace,
  rentalDetailAddress,
  returnDate,
  returnPlace,
  returnDetailAddress,
  rentalFee,
  paymentDate,
  lateInterestRate,
  latePenaltyRate,
  damageCompensationRate,
  createdDate,
  borrowerSignatureUrl,
  lenderSignatureUrl,
  showLenderSignature = false,
}: ContractProps) => {
  return (
    <div className="flex flex-col w-full h-full px-8">
      <div className="flex w-full h-[85%] justify-center items-center overflow-hidden" />
      <span className="text-3xl font-bold text-center mb-8">차용 계약서(차용인 ver)</span>

      <p className="font-extrabold">
        <strong>대여인:</strong>{" "}
        <span className="underline underline-offset-2">{lenderName}</span>
      </p>

      <p className="mt-1">
        <strong>차용인:</strong>{" "}
        <span className="underline underline-offset-2">{borrowerName}</span>
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">물품 정보</h2>
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

      <p className="mt-4">차용인은 위 물품을 틀림없이 차용(임대)하였으며, 아래와 같이 이행할 것을 확약한다.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">제 1조(차용기간 및 장소)</h2>
      <p>
        1. 본 계약에 따라 대여인은 차용인에게{" "}
        <strong><span className="underline underline-offset-2">{rentalEndDate}</span></strong>까지 해당 물품을 임대해야 한다. 해당 물품의 대여장소는{" "}
        <strong><span className="underline underline-offset-2">{rentalPlace}</span></strong>로 정한다.
      </p>
      <p>- 상세주소: <strong><span className="underline underline-offset-2">{rentalDetailAddress}</span></strong></p>

      <p className="mt-2">
        2. 본 계약에 따라 차용인은 임대기간 종료 후{" "}
        <strong><span className="underline underline-offset-2">{returnDate}</span></strong>까지 해당 물품을 대여인에게 반납해야 한다.
        반납장소는 <strong><span className="underline underline-offset-2">{returnPlace}</span></strong>로 정한다.
      </p>
      <p>- 상세주소: <strong><span className="underline underline-offset-2">{returnDetailAddress}</span></strong></p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">제 2조(임대료의 납부)</h2>
      <p>
        임대료는 <strong><span className="underline underline-offset-2">{rentalFee ? rentalFee.toLocaleString() : "0"}원</span></strong>이며,
        <strong><span className="underline underline-offset-2">{paymentDate}</span></strong>에 일시지급한다.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">제 3조(지연손해금)</h2>
      <p>1. 임대료 지연 시 일 <strong><span className="underline underline-offset-2">{lateInterestRate}%</span></strong>를 청구할 수 있다.</p>
      <p className="mt-2">2. 반납 지연 시 물품가액의 <strong><span className="underline underline-offset-2">{latePenaltyRate}%</span></strong>를 청구할 수 있다.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">제 4조(위험부담 및 면책조항)</h2>
      <p>1. 차용인의 귀책으로 파손/훼손/멸실 발생 시 신품가의 <strong><span className="underline underline-offset-2">{damageCompensationRate}%</span></strong> 배상.</p>
      <p className="mt-2">2. 불가항력 사유인 경우 면책.</p>

      <p className="mt-6 font-bold text-center">
        <span className="underline underline-offset-2">{createdDate}</span>
      </p>

      <div className="mt-8 text-center">
        <p className="mb-4">
          <strong>대여인:</strong>{" "}
          <span className="underline underline-offset-2">{lenderName}</span> (서명)
          {/* 동의 체크 시 노출 */}
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
          {/* 항상 노출 */}
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
