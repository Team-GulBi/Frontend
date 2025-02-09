import { HeaderWithoutSearch } from '@/components/common/Header';
import { ContractCompleted, ContractCapture } from './components/ContractCompleted';
import { useState, useRef } from "react";
export default function CompletedContractPage () {
  const [isChecked, setIsChecked] = useState(false);
  const contractRef = useRef<any>(null); // contractRef 정의
  // 캡처 버튼 클릭 시 호출되는 함수
  const handleCaptureClick = () => {
    if (contractRef.current) {
      contractRef.current.capture(); // 캡처 함수 호출
    }
  };
  const handleAgreeClick = () => {
    setIsChecked(!isChecked); // 체크 상태 토글
  };
  return (
    <div className="flex flex-col items-center w-screen h-screen">
      <div className="fixed top-0 left-0 w-full h-screen bg-cover" />
      <div className="relative flex -ml-[100%]">
        <HeaderWithoutSearch />
      </div>
      <div className="flex flex-col w-[65%] h-[83.7%] justify-end items-center font-extrabold">
        <div className="flex w-full max-w-[82%] max-h-[84%] overflow-y-auto overflow-x-hidden rounded-[27.42px] transform transition duration-170 hover:scale-[1.01] z-0 p-10" style={{ boxShadow: '0px 3.8px 10.5px 0 rgba(0,0,0,0.35)', scrollMarginLeft:'1000px'}}>
        <ContractCapture ref={contractRef}><ContractCompleted
            lender={'박명수'}
            borrower={'유재석'}
            itemName={'k2'}
            specifications={'밀반입'}
            quantity={2}
            condition={'녹슬음'}
            rentalEndDate={'2024.11.25'}
            rentalPlace={'울집~'}
            rentalDetailAddress={'캐슬파크a동3115호'}
            returnDate={'2024.12.25'}
            returnPlace={'메가원탑'}
            returnDetailAddress={'인천타워대로132번길9'}
            rentalFee={0}
            paymentDate={'2025.02.23'}
            lateInterestRate={0}
            latePenaltyRate={0}
            damageCompensationRate={0}
            createdDate={'2024.11.25'}
          /></ContractCapture>
        </div>
      </div>
      <div className="flex flex-col items-center justify-start pt-4 z-50 h-[16.3%]">
        <label className="flex items-center cursor-pointer">
          <span className="text-lg hover:scale-[101%]">계약서의 내용을 동의하시겠습니까?</span>
          <input
            type="checkbox"
            checked={isChecked}
            onClick={handleAgreeClick}
            className="w-5 h-5 ml-2 border-2 border-gray-400 rounded-lg text-[#357FFF] hover:scale-[105%]"
          />
        </label>
        {isChecked && (
          <button
            className="mt-4 px-6 py- bg-[#357FFF] text-white rounded-lg hover:scale-[105%]"
            onClick={handleCaptureClick}
          >
            <span className='text-[17px]'>완료</span>
          </button>
        )}
      </div>
      {/* ContractCapture 추가, ref 전달 */}
      {/* <ContractCapture ref={contractRef} children={undefined}/> */}
    </div>
  );
}