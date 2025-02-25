import { HeaderWithoutSearch } from '@/components/common/Header';
import { ContractCompleted, ContractCapture } from './components/ContractCompleted';
import { useState, useRef, useEffect } from "react";
import { useGetContract, useBorrowerApproval, getContractIdByApplication, useUploadContractFile } from '@/apis/contract';

export default function CompletedContractPage () {
  const [isChecked, setIsChecked] = useState(false);
  const contractRef = useRef<any>(null); // contractRef 정의
  const [contractId, setContractId] = useState<number | null>(null);
  const [createdDate, setcreatedDate] = useState<string | null>(null);
  const borrowerApprovalMutation = useBorrowerApproval();
  const uploadContractFileMutation = useUploadContractFile();

  useEffect(() => {
    const fetchContractId = async () => {
      const contractIdResponse = await getContractIdByApplication(1);
      const contractId = contractIdResponse[0]?.id;
      const createdDate = contractIdResponse[0]?.createdDate;
      if (contractId === undefined) {
        throw new Error("Contract ID is undefined");
      }
      setContractId(contractId);
      setcreatedDate(createdDate);
    };
    fetchContractId();
  }, []);

  const { data: contractData } = useGetContract(contractId || 0); 
  
  // 캡처 버튼 클릭 시 호출되는 함수
  const handleCompleteClick = async () => {
    if (contractId === null) {
      throw new Error("Contract ID is null");
    }

    if (contractRef.current) {
      try {
        const blob = await contractRef.current.capture(); // 캡처 함수 호출
        if (!blob) {
          throw new Error("캡처에 실패했습니다.");
        }
        // blob 데이터 확인
      console.log("Captured blob:", blob);
      console.log("Blob type:", blob.type);
      console.log("Blob size:", blob.size);

        const file = new File([blob], 'contract.png', { type: 'image/png' });
        const formData = new FormData();
        formData.append("file", file);
        // FormData 내용 확인
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }
        // 3. 계약 승인 API 호출
        await borrowerApprovalMutation.mutateAsync(contractId);

        // 4. 이미지 업로드 API 호출
        
        
        try {
          await uploadContractFileMutation.mutateAsync({
            contractId,
            file: formData
          });
          alert("계약서가 성공적으로 생성되었습니다."); 
          console.log("Contract Data:", contractData);
        } catch (uploadError: any) {
          console.error("파일 업로드 오류:", uploadError);
          console.error("응답 상태:", uploadError.response?.status);
          console.error("응답 데이터:", uploadError.response?.data);
          throw uploadError;
        }

      } catch (error) {
        console.error("계약 처리 중 오류 발생:", error);
        alert("계약 처리 중 문제가 발생했습니다.");
      }
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  // createdDate를 contractData에 추가하고 날짜 형식을 변환
  const formatDate = (isoString: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '-').replace(/ /g, '').replace(/-$/, '');
  };
  const additionalContractData = contractData ? { ...contractData,
    createdDate: formatDate(createdDate),
    rentalEndDate: formatDate(contractData.rentalEndDate),
    returnDate: formatDate(contractData.returnDate),
    paymentDate: formatDate(contractData.paymentDate)
  } : null;
  return (
    <div className="flex flex-col items-center w-screen h-screen">
      <div className="fixed top-0 left-0 w-full h-screen bg-cover" />
      <div className="relative flex -ml-[100%]">
        <HeaderWithoutSearch />
      </div>
      <div className="flex flex-col w-[65%] h-[83.7%] justify-end items-center font-extrabold">
      
        <div className="flex w-full justify-center max-w-[82%] min-h-[84%] max-h-[84%] overflow-y-auto overflow-x-hidden rounded-[27.42px] transform transition duration-170 hover:scale-[1.01] z-0 py-10 px-5" style={{ boxShadow: '0px 3.8px 10.5px 0 rgba(0,0,0,0.35)', scrollMarginLeft:'1000px'}}>
        <ContractCapture ref={contractRef}>
        {additionalContractData ? (
            <ContractCompleted {...additionalContractData} />
          ) : (
            <div className='flex w-full min-h-[84%] items-center justify-center'>계약 정보를 불러오는 중...</div>
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
            onChange={handleCheckboxChange}
            className="w-5 h-5 ml-2 border-2 border-gray-400 rounded-lg text-[#357FFF] hover:scale-[105%]"
          />
        </label>
        {isChecked && (
          <button
            className="mt-4 px-6 py- bg-[#357FFF] text-white rounded-lg hover:scale-[105%]"
            onClick={handleCompleteClick}
          >
            <span className='text-[17px]'>완료</span>
          </button>
        )}
      </div>
      {/* ContractCapture 추가, ref 전달 */}
      {/* <ContractCapture ref={contractRef} children={undefined}/> */}
    </div>
  );
};
