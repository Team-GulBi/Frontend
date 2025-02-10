import React, { useState } from "react";

interface ContractProps {
  lender: string;
  borrower: string;
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
  url: string;
}

interface ContractInputProps extends ContractProps {
  onInputChange: (data: ContractProps) => void; // 부모로 값을 전달할 함수 추가
}

export const ContractInput = ({
  lender = "",
  borrower = "",
  itemName = "",
  specifications = "",
  quantity = 0,
  condition = "",
  notes = "",
  rentalEndDate = "",
  rentalPlace = "",
  rentalDetailAddress = "",
  returnDate = "",
  returnPlace = "",
  returnDetailAddress = "",
  rentalFee = 0,
  paymentDate = "",
  lateInterestRate = 0,
  latePenaltyRate = 0,
  damageCompensationRate = 0,
  createdDate = "",
  url = "",
  onInputChange, // 부모로 전달받은 함수
}: ContractInputProps) => {
  const [formValues, setFormValues] = useState<ContractProps>({
    lender,
    borrower,
    itemName,
    specifications,
    quantity,
    condition,
    notes: notes || "",
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
    url,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };
      onInputChange(updatedValues); // 부모 컴포넌트에 값 전달
      return updatedValues;
    });
  };

  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="text-3xl font-bold text-center mb-8">차용 계약서(대여인ver)</h1>

      <p>
        <strong>대여인:</strong>{" "}
        <input
          type="text"
          name="lender"
          value={formValues.lender}
          onChange={handleInputChange}
          className="bg-transparent focus:outline-black outline-dashed outline-[1px]"
          style={{
            width: `${formValues.lender.length + 3}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
        />
      </p>
      <p>
      <strong>차용인:</strong> <span className="underline underline-offset-2">{borrower}</span>
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
            <td className="border border-gray-400 px-4 py-2">
              <input
                type="text"
                name="itemName"
                value={formValues.itemName}
                onChange={handleInputChange}
                className="bg-transparent focus:outline-black outline-dashed outline-[1px]"
          style={{
            width: `${formValues.borrower.length + 3}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
              />
            </td>
            <td className="border border-gray-400 px-4 py-2">
              <input
                type="text"
                name="specifications"
                value={formValues.specifications}
                onChange={handleInputChange}
                className="bg-transparent focus:outline-black w-full outline-dashed outline-[1px]"
                
              />
            </td>
            <td className="border border-gray-400 px-4 py-2">
              <input
                type="number"
                name="quantity"
                value={formValues.quantity}
                onChange={handleInputChange}
                className="bg-transparent focus:outline-black w-full outline-dashed outline-[1px]"
              />
            </td>
            <td className="border border-gray-400 px-4 py-2">
              <input
                type="text"
                name="condition"
                value={formValues.condition}
                onChange={handleInputChange}
                className="bg-transparent focus:outline-black w-full outline-dashed outline-[1px]"
              />
            </td>
            <td className="border border-gray-400 px-4 py-2">
              <input
                type="text"
                name="notes"
                value={formValues.notes}
                onChange={handleInputChange}
                className="bg-transparent focus:outline-black w-full outline-dashed outline-[1px]"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4">
        차용인은 위 물품을 틀림없이 차용(임대)하였으며, 아래와 같이 이행할 것을 확약한다.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4">제 1조(차용기간 및 장소)</h2>
      <p>
        1. 대여인은 차용인에게{" "}
        <input
          type="text"
          name="rentalEndDate"
          value={formValues.rentalEndDate}
          onChange={handleInputChange}
          className="bg-transparent min-w-[50px] w-fit focus:outline-black outline-dashed outline-[1px]"
          placeholder="입력"
          style={{
            width: `${formValues.rentalEndDate.length + 0}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
        />{" "}
        까지 해당 물품을 임대해야 한다. 해당 물품의 대여장소는{" "}
        <input
          type="text"
          name="rentalPlace"
          value={formValues.rentalPlace}
          onChange={handleInputChange}
          className="bg-transparent min-w-[50px] w-fit focus:outline-black outline-dashed outline-[1px]"
          placeholder="입력"
          style={{
            width: `${formValues.rentalPlace.length + 0}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
        />{" "}로 정한다. 위 대여장소의 상세주소는 다음과 같다.
      </p>
      <p>- 상세주소: {" "}
        <input
          type="string"
          name="rentalDetailAddress"
          value={formValues.rentalDetailAddress}
          onChange={handleInputChange}
          className="bg-transparent min-w-[50px] w-fit focus:outline-black outline-dashed outline-[1px]"
          placeholder="입력"
          style={{
            width: `${formValues.rentalDetailAddress.length + 5}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
        />{" "}</p><p className="mt-2">
        2. 본 계약에 따라 차용인은 임대기간 종료 후 {" "}
        <input
          type="text"
          name="returnDate"
          value={formValues.returnDate}
          onChange={handleInputChange}
          className="bg-transparent min-w-[50px] w-fit focus:outline-black outline-dashed outline-[1px]"
          placeholder="입력"
          style={{
            width: `${formValues.returnDate.length + 0}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
        />{" "}까지 해당 물품을 대여인에게 반납해야 한다. 해당 물품의 반납장소는{" "}
        <input
          type="text"
          name="returnPlace"
          value={formValues.returnPlace}
          onChange={handleInputChange}
          className="bg-transparent min-w-[50px] w-fit focus:outline-black outline-dashed outline-[1px]"
          placeholder="입력"
          style={{
            width: `${formValues.rentalEndDate.length + 0}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
        />{" "}
        로 정한다. 위 반납장소의 상세주소는 다음과 같다.
      </p>
      <p>- 상세주소: {" "}
        <input
          type="text"
          name="returnDetailAddress"
          value={formValues.returnDetailAddress}
          onChange={handleInputChange}
          className="bg-transparent min-w-[50px] w-fit focus:outline-black outline-dashed outline-[1px]"
          placeholder="입력"
          style={{
            width: `${formValues.returnDetailAddress.length + 5}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
        />{" "}</p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">제 2조(임대료의 납부)</h2>
      <p>
        차용물품에 대한 임대료는{" "}
        <input
          type="text"
          name="rentalFee"
          value={formValues.rentalFee}
          onChange={handleInputChange}
          className="bg-transparent min-w-[50px] w-fit focus:outline-black outline-dashed outline-[1px]"
          placeholder="입력"
          style={{
            width: `${formValues.rentalEndDate.length + 0}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
        />{" "}
        으로 정한다. 차용인은 {" "}
        <input
          type="text"
          name="paymentDate"
          value={formValues.paymentDate}
          onChange={handleInputChange}
          className="bg-transparent min-w-[50px] w-fit focus:outline-black outline-dashed outline-[1px]"
          placeholder="입력"
          style={{
            width: `${formValues.paymentDate.length + 0}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
        />{" "}에 임대료를 일시지급해야하며, 연체 시 차용인은 본 계약에 따른 불이익을 받을 수 있다.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">제 3조(지연손해금)</h2>
      <p>
        1. 차용인이 약정된 기일을 초과하여, 임대료 납부를 게을리하였을 경우 차용인은
        지연이자로써 일 {" "}
        <input
          type="number"
          name="lateInterestRate"
          value={formValues.lateInterestRate}
          onChange={handleInputChange}
          className="bg-transparent min-w-[50px] w-fit focus:outline-black outline-dashed outline-[1px]"
          placeholder="입력"
          style={{
            width: `${formValues.rentalEndDate.length + 0}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
        />
        % 를 청구할 수 있다. 이에 차용인은 이의 없이 본 조항에 따라야 한다.
      </p>
      <p className="mt-2">
        2. 차용인이 약정된 기일을 초과하여, 해당물품 반납을 게을리하였을 경우 지연손해금으로
        물품가액의{" "}
        <input
          type="number"
          name="latePenaltyRate"
          value={formValues.latePenaltyRate}
          onChange={handleInputChange}
          className="bg-transparent min-w-[50px] w-fit focus:outline-black outline-dashed outline-[1px]"
          placeholder="입력"
          style={{
            width: `${formValues.rentalEndDate.length + 0}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
        />
        %를 청구할 수 있다. 이에 차용인은 이의 없이 본 조항에 따라야 한다.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">제 4조(위험부담 및 면책조항)</h2>
      <p>
        1. 차용인의 귀책사유로 본 계약 물품에 파손, 훼손 또는 멸실이 발생한 경우 차용인은
        신품 가격의 {" "}
        <input
          type="number"
          name="damageCompensationRate"
          value={formValues.damageCompensationRate}
          onChange={handleInputChange}
          className="bg-transparent min-w-[50px] w-fit focus:outline-black outline-dashed outline-[1px]"
          placeholder="입력"
          style={{
            width: `${formValues.rentalEndDate.length + 0}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
        />
        %를 배상하여야 한다.
      </p>
      <p className="mt-2">
        2. 전항의 파손, 훼손 또는 멸실이 천재지변, 사변, 국가비상사태 등 불가항력으로 인한
        것일 경우 차용인은 배상책임을 면한다.
      </p>

      <p className="mt-6 text-center font-medium">{" "}
        <input
          type="text"
          name="createdDate"
          value={formValues.createdDate}
          onChange={handleInputChange}
          className="bg-transparent min-w-[100px] w-fit focus:outline-black font-semibold outline-dashed outline-[1px]"
          placeholder="오늘 날짜"
          style={{
            width: `${formValues.createdDate.length + 0}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
        />{" "}</p>

      <div className="mt-8 text-center">
        <p>
          <strong>대여인:</strong>{" "}
          <input
            type="text"
            name="lender"
            value={formValues.lender}
            onChange={handleInputChange}
            className="bg-transparent min-w-[50px] w-fit focus:outline-black outline-dashed outline-[1px]"
          placeholder="입력"
          style={{
            width: `${formValues.rentalEndDate.length + 0}ch`, // 입력 글자수에 따라 인풋필드 크기 변경하도록~
          }}
          />
        </p>
        <p>
          <strong>차용인:</strong> <span className="underline underline-offset-2">{borrower}</span>
        </p>
      </div>
    </div>
  );
};
