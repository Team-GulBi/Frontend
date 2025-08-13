import { HeaderWithoutSearch } from "@/components/common/Header";
import { ContractCompleted, ContractCapture } from "./components/ContractCompleted";
import { useState, useRef, useEffect } from "react";
import { getContractByApplicationId, putLenderApproval, ContractDTO } from "@/apis/contract";

export default function CompletedContractPage() {
  const [isChecked, setIsChecked] = useState(false);
  const contractRef = useRef<any>(null);

  const [contract, setContract] = useState<ContractDTO | null>(null);
  const [contractId, setContractId] = useState<number | null>(null);

  // 임시 하드코딩 (추후 상위 컴포넌트에서 prop으로 전달 예정)
  const applicationId = 1;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getContractByApplicationId(applicationId);
        const dto = res.data; // ContractDTO
        setContract(dto);
        setContractId(dto.id);
      } catch (e) {
        console.error("계약서 조회 실패:", e);
        alert("계약서를 불러오지 못했습니다.");
      }
    };
    load();
  }, [applicationId]);

  // 날짜 포맷팅
  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date
      .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
      .replace(/\./g, "-")
      .replace(/ /g, "")
      .replace(/-$/, "");
  };

  const viewData =
    contract && {
      // ✅ API의 이름 필드 사용
      lenderName: contract.lenderName,
      borrowerName: contract.borrowerName,
      itemName: contract.itemName,
      specifications: contract.specifications,
      quantity: contract.quantity,
      condition: contract.condition,
      notes: contract.notes,
      rentalEndDate: formatDate(contract.rentalEndDate),
      rentalPlace: contract.rentalPlace,
      rentalDetailAddress: contract.rentalDetailAddress,
      returnDate: formatDate(contract.returnDate),
      returnPlace: contract.returnPlace,
      returnDetailAddress: contract.returnDetailAddress,
      rentalFee: contract.rentalFee,
      paymentDate: formatDate(contract.paymentDate),
      lateInterestRate: contract.lateInterestRate,
      latePenaltyRate: contract.latePenaltyRate,
      damageCompensationRate: contract.damageCompensationRate,
      createdDate: formatDate(new Date().toISOString()),

      borrowerSignatureUrl: contract.borrowerSignature,
      lenderSignatureUrl: contract.lenderSignature,
      showLenderSignature: isChecked,
    };

  const handleCompleteClick = async () => {
    if (!contractId) {
      alert("계약 ID를 확인할 수 없습니다.");
      return;
    }
    if (!contractRef.current) return;

    try {
      const blob = await contractRef.current.capture();
      if (!blob) {
        alert("계약서 캡처에 실패했습니다.");
        return;
      }

      // 서버 명세: field name = finalContract
      const filename = "final_contract.png";
      await putLenderApproval({ contractId, file: blob, filename });

      alert("계약이 승인되어 최종 계약서가 업로드되었습니다.");
    } catch (e: any) {
      console.error("승인/업로드 실패:", e);
      alert("계약 승인 처리 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen">
      <div className="fixed top-0 left-0 w-full h-screen bg-cover" />
      <div className="relative flex -ml-[100%]">
        <HeaderWithoutSearch />
      </div>

      <div className="flex flex-col w-[65%] h-[83.7%] justify-end items-center font-extrabold">
        <div
          className="flex w-full justify-center max-w-[82%] min-h-[84%] max-h-[84%] overflow-y-auto overflow-x-hidden rounded-[27.42px] transform transition duration-170 hover:scale-[1.01] z-0 py-10 px-5"
          style={{ boxShadow: "0px 3.8px 10.5px 0 rgba(0,0,0,0.35)", scrollMarginLeft: "1000px" }}
        >
          <ContractCapture ref={contractRef}>
            {viewData ? (
              <ContractCompleted {...viewData} />
            ) : (
              <div className="flex w-full min-h-[84%] items-center justify-center">
                계약 정보를 불러오는 중...
              </div>
            )}
          </ContractCapture>
        </div>
      </div>

      <div className="flex flex-col items-center justify-start pt-4 z-50 h-[16.3%]">
        <label className="flex items-center cursor-pointer">
          <span className="text-lg hover:scale-[101%]">계약서의 내용을 동의하시겠습니까?</span>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="w-5 h-5 ml-2 border-2 border-gray-400 rounded-lg text-[#357FFF] hover:scale-[105%]"
          />
        </label>

        {isChecked && (
          <button
            className="mt-4 px-6 py-2 bg-[#357FFF] text-white rounded-lg hover:scale-[105%]"
            onClick={handleCompleteClick}
          >
            <span className="text-[17px]">완료</span>
          </button>
        )}
      </div>
    </div>
  );
}
