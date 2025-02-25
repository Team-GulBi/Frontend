import { HeaderWithoutSearch } from "@/components/common/Header";
import { ContractInput } from "./components/ContractInput";
import { useState } from "react";
import { useCreateContract, useLenderApproval, getContractIdByApplication} from "@/apis/contract";
import { useQueryClient } from '@tanstack/react-query';

export default function DefaultContractPage() {
  const [isChecked, setIsChecked] = useState(false);
  // const [contractId, setContractId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<any>({});  // To store form values

  const createContractMutation = useCreateContract();
  const lenderApprovalMutation = useLenderApproval();
  const queryClient = useQueryClient();
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleCompleteClick = async () => {
    if (!formValues) {
      alert("계약 정보를 모두 입력해주세요.");
      return;
    }
  
    try {
      // 1. 계약 생성 API 호출
      // 날짜 변환
    const formattedValues = {
      ...formValues,
      rentalEndDate: new Date(formValues.rentalEndDate).toISOString(),
      returnDate: new Date(formValues.returnDate).toISOString(),
      paymentDate: new Date(formValues.paymentDate).toISOString(),
      createdDate: new Date(formValues.createdDate).toISOString(),
    };

      await createContractMutation.mutateAsync({
        contractData: formattedValues,
        applicationId: 1
      });
      // 2. 계약 ID 가져오기
      
      const contractIdResponse = await queryClient.fetchQuery({
        queryKey: ['getContractIdByApplication', 1],
        queryFn: () => getContractIdByApplication(1) //applicationId 임시 상수로 설정
      });
      
      // 응답이 배열 형태이므로 첫 번째 요소의 id를 가져옵니다.
      const contractId = contractIdResponse[0]?.id;
      if (contractId === undefined) {
        throw new Error("Contract ID is undefined");
      }
      // 3. 계약 승인 API 호출
      await lenderApprovalMutation.mutateAsync(contractId);
  
      alert("계약서가 성공적으로 생성성되었습니다.");
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
             {...formValues}  // contractData 상태 전달
             onInputChange={setFormValues}  // setContractData 함수 전달
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
            className="mt-4 px-6 py- bg-[#357fff] text-white rounded-lg hover:scale-[105%]"
            onClick={handleCompleteClick}
          >
            <span className="text-[17px]">완료</span>
          </button>
        )}
      </div>
    </div>
  );
}
