import { HeaderWithoutSearch } from "@/components/common/Header";
import { ContractInput } from "./components/ContractInput";
import { useState } from "react";
import { postContract } from "@/apis/contract";

export default function DefaultContractPage() {
  const [isChecked, setIsChecked] = useState(false);
  const [formValues, setFormValues] = useState<any>({});

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleCompleteClick = async () => {
    if (!formValues) {
      alert("계약 정보를 모두 입력해주세요.");
      return;
    }

    try {
      const productId = 1;

      const startDate = new Date("2025-08-07T00:00:00.000Z");
      const endDate = new Date("2025-08-08T00:00:00.000Z");
      if (startDate.getTime() === endDate.getTime()) {
        alert("시작일과 종료일이 같으면 계약서를 생성할 수 없습니다.");
        return;
      }

      const contractData = {
        ...formValues,
        rentalEndDate: new Date(formValues.rentalEndDate).toISOString(),
        returnDate: new Date(formValues.returnDate).toISOString(),
        paymentDate: new Date(formValues.paymentDate).toISOString(),
      };

      const applicationData = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      await postContract({
        productId,
        contractData,
        applicationData,
      });

      alert("계약서가 성공적으로 생성되었습니다.");
    } catch (error) {
      console.error("계약 처리 중 오류 발생:", error);
      alert("계약 처리 중 문제가 발생했습니다.");
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
          <ContractInput
            {...formValues}
            onInputChange={setFormValues}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-start pt-4 z-50 h-[16.3%]">
        <label className="flex items-center cursor-pointer">
          <span className="text-lg hover:scale-[101%]">
            계약서의 내용을 동의하시겠습니까?
          </span>
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
            <span className="text-[17px]">완료</span>
          </button>
        )}
      </div>
    </div>
  );
}
