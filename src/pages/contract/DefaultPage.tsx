// src/pages/contract/DefaultPage.tsx
import { HeaderWithoutSearch } from "@/components/common/Header";
import { ContractInput } from "./components/ContractInput";
import { useEffect, useState } from "react";
import { getProductTemplate, postBorrowerApplication, ProductTemplateDTO } from "@/apis/contract";

// 하드코딩: productId = 1
const PRODUCT_ID = 1;

// 분·초 00:00 ISO로 만드는 헬퍼 (UTC 기준)
function toIsoAtMidnight(yyyy: number, mm: number, dd: number) {
  const d = new Date(Date.UTC(yyyy, mm - 1, dd, 0, 0, 0));
  return d.toISOString();
}

export default function DefaultContractPage() {
  // Borrower: 템플릿 표시 + 동의
  const [isChecked, setIsChecked] = useState(false);
  const [template, setTemplate] = useState<ProductTemplateDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // 예약 시간 — 추후 컴포넌트 연동 예정(지금은 하드코딩)
  const startDate = toIsoAtMidnight(2025, 8, 19);
  const endDate = toIsoAtMidnight(2025, 8, 21);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProductTemplate(PRODUCT_ID);
        setTemplate(res.data);
      } catch (e) {
        console.error("템플릿 조회 실패:", e);
        alert("계약 템플릿을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleCompleteClick = async () => {
    // 시작/종료 동일 차단
    if (startDate === endDate) {
      alert("시작일과 종료일이 같으면 예약할 수 없습니다.");
      return;
    }
    if (!isChecked) {
      alert("계약 내용에 동의해 주세요.");
      return;
    }

    try {
      await postBorrowerApplication({
        productId: PRODUCT_ID,
        startDate,
        endDate,
      });
      alert("예약(동의)이 완료되었습니다. (서버에서 borrower-approval 자동 처리)");
      // TODO: 라우팅 이동 등 후속 처리
    } catch (error) {
      console.error("예약 처리 중 오류:", error);
      alert("예약 처리 중 문제가 발생했습니다.");
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
          className="flex w-full max-w-[82%] max-h-[84%] overflow-y-auto overflow-x-hidden rounded-[27.42px] transform transition duration-170 hover:scale-[1.01] z-0 p-10"
          style={{
            boxShadow: "0px 3.8px 10.5px 0 rgba(0,0,0,0.35)",
            scrollMarginLeft: "1000px",
          }}
        >
          {loading ? (
            <div className="flex w-full min-h-[84%] items-center justify-center">
              템플릿을 불러오는 중...
            </div>
          ) : (
            <ContractInput template={template} startDate={startDate} endDate={endDate} />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-start pt-4 z-50 h-[16.3%]">
        <label className="flex items-center cursor-pointer">
          <span className="text-lg hover:scale-[101%]">계약서의 내용을 동의하시겠습니까?</span>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="w-5 h-5 ml-2 border-2 border-gray-400 rounded-lg text-[#357fff] hover:scale-[105%] cursor-pointer"
          />
        </label>

        {isChecked && (
          <button
            className="mt-4 px-6 py-2 bg-[#357fff] text-white rounded-lg hover:scale-[105%]"
            onClick={handleCompleteClick}
          >
            <span className="text-[17px]">예약(동의) 완료</span>
          </button>
        )}
      </div>
    </div>
  );
}
