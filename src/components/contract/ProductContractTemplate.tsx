import { useState, useEffect } from 'react';

interface ContractTemplateProps {
  specification: string;
  condition: string;
  note: string;
  rentalPlace: string;
  returnPlace: string;
  lateInterestRate: number;
  latePenaltyRate: number;
  damageCompensationRate: number;
}

interface ProductContractTemplateProps extends ContractTemplateProps {
  onInputChange: (data: ContractTemplateProps) => void;
  userName: string;
  productName: string;
  address?: string;
  price?: number;
}

export const ProductContractTemplate = ({
  specification = '',
  condition = '',
  note = '',
  lateInterestRate = 0,
  latePenaltyRate = 0,
  damageCompensationRate = 0,
  onInputChange,
  userName,
  productName,
  address = '',
  price = 0,
}: ProductContractTemplateProps) => {
  const [formValues, setFormValues] = useState<ContractTemplateProps>({
    specification,
    condition,
    note,
    rentalPlace: address ? `${address} ` : '',
    returnPlace: address ? `${address} ` : '',
    lateInterestRate,
    latePenaltyRate,
    damageCompensationRate,
  });

  useEffect(() => {
    onInputChange(formValues);
  }, [formValues, onInputChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      name === 'lateInterestRate' ||
      name === 'latePenaltyRate' ||
      name === 'damageCompensationRate'
    ) {
      const numValue = Number(value);
      let adjustedValue = numValue;

      if (numValue < 0) adjustedValue = 0;
      if (numValue > 100) adjustedValue = 100;

      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: adjustedValue,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <h1 className="mb-8 text-center text-3xl font-bold">차용 계약서</h1>
      <p>
        <strong>대여인:</strong> {userName}
      </p>
      <p>
        <strong>차용인:</strong>{' '}
        <span className="font-semibold text-primary-100 underline underline-offset-2">
          [대여 신청자]
        </span>
      </p>
      <h2 className="mb-4 mt-6 text-2xl font-semibold">물품 정보</h2>
      <table className="mb-6 w-full table-auto border-collapse border border-gray-400 text-left">
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
              <span>{productName}</span>
            </td>
            <td className="border border-gray-400 px-4 py-2">
              <input
                type="text"
                name="specification"
                value={formValues.specification}
                onChange={handleInputChange}
                className="w-full bg-transparent px-2 py-1 outline-dashed outline-[1px] focus:outline-black"
                placeholder="상품 규격 (예: 15cm * 15cm)"
              />
            </td>
            <td className="border border-gray-400 px-4 py-2">
              <span>1</span>
            </td>
            <td className="border border-gray-400 px-4 py-2">
              <input
                type="text"
                name="condition"
                value={formValues.condition}
                onChange={handleInputChange}
                className="w-full bg-transparent px-2 py-1 outline-dashed outline-[1px] focus:outline-black"
                placeholder="상품 상태 (예: 새상품, 중고품)"
              />
            </td>
            <td className="border border-gray-400 px-4 py-2">
              <input
                type="text"
                name="note"
                value={formValues.note}
                onChange={handleInputChange}
                className="w-full bg-transparent px-2 py-1 outline-dashed outline-[1px] focus:outline-black"
                placeholder="비고 사항 (예: 특별한 주의사항)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4">
        차용인은 위 물품을 틀림없이 차용(임대)하였으며, 아래와 같이 이행할 것을
        확약한다.
      </p>
      <h2 className="mb-4 mt-6 text-2xl font-semibold">
        제 1조(차용기간 및 장소)
      </h2>
      <p>
        1. 대여인은 차용인에게{' '}
        <span className="font-semibold text-primary-100 underline underline-offset-2">
          [대여 기간]
        </span>{' '}
        까지 해당 물품을 임대해야 한다. 해당 물품의 대여장소는{' '}
        <input
          type="text"
          name="rentalPlace"
          value={formValues.rentalPlace}
          onChange={handleInputChange}
          className="min-w-[75px] bg-transparent px-2 py-1 outline-dashed outline-[1px] focus:outline-black"
          placeholder="대여 장소"
          style={{
            width: `${Math.max(formValues.rentalPlace.length + 5, 10)}ch`,
          }}
        />{' '}
        (으)로 정한다.
      </p>
      <p className="mt-2">
        2. 본 계약에 따라 차용인은 임대기간 종료 후{' '}
        <span className="font-semibold text-primary-100 underline underline-offset-2">
          [반납 기한]
        </span>{' '}
        까지 해당 물품을 대여인에게 반납해야 한다. 해당 물품의 반납장소는{' '}
        <input
          type="text"
          name="returnPlace"
          value={formValues.returnPlace}
          onChange={handleInputChange}
          className="min-w-[75px] bg-transparent px-2 py-1 outline-dashed outline-[1px] focus:outline-black"
          placeholder="반납 장소"
          style={{
            width: `${Math.max(formValues.returnPlace.length + 5, 10)}ch`,
          }}
        />{' '}
        (으)로 정한다.
      </p>
      <h2 className="mb-4 mt-6 text-2xl font-semibold">
        제 2조(임대료의 납부)
      </h2>
      <p>
        차용물품에 대한 임대료는{' '}
        <span className="font-medium">
          {price ? `${price.toLocaleString()}원` : '[상품 가격]'}
        </span>{' '}
        으로 정한다. 차용인은{' '}
        <span className="font-semibold text-primary-100 underline underline-offset-2">
          [납부 기한]
        </span>{' '}
        에 임대료를 일시지급해야하며, 연체 시 차용인은 본 계약에 따른 불이익을
        받을 수 있다.
      </p>
      <h2 className="mb-4 mt-6 text-2xl font-semibold">제 3조(지연손해금)</h2>
      <p>
        1. 차용인이 약정된 기일을 초과하여, 임대료 납부를 게을리하였을 경우
        차용인은 지연이자로써 일{' '}
        <input
          type="number"
          name="lateInterestRate"
          value={formValues.lateInterestRate}
          onChange={handleInputChange}
          className="mr-1 max-w-[110px] bg-transparent px-2 py-1 outline-dashed outline-[1px] focus:outline-black"
          placeholder="연체 이자율"
          min={0}
          max={100}
        />
        %를 청구할 수 있다. 이에 차용인은 이의 없이 본 조항에 따라야 한다.
      </p>
      <p className="mt-2">
        2. 차용인이 약정된 기일을 초과하여, 해당물품 반납을 게을리하였을 경우
        지연손해금으로 물품가액의{' '}
        <input
          type="number"
          name="latePenaltyRate"
          value={formValues.latePenaltyRate}
          onChange={handleInputChange}
          className="mr-1 max-w-[120px] bg-transparent px-2 py-1 outline-dashed outline-[1px] focus:outline-black"
          placeholder="연체 위약금율"
          min={0}
          max={100}
        />
        %를 청구할 수 있다. 이에 차용인은 이의 없이 본 조항에 따라야 한다.
      </p>
      <h2 className="mb-4 mt-6 text-2xl font-semibold">
        제 4조(위험부담 및 면책조항)
      </h2>
      <p>
        1. 차용인의 귀책사유로 본 계약 물품에 파손, 훼손 또는 멸실이 발생한 경우
        차용인은 신품 가격의{' '}
        <input
          type="number"
          name="damageCompensationRate"
          value={formValues.damageCompensationRate}
          onChange={handleInputChange}
          className="mr-1 max-w-[110px] bg-transparent px-2 py-1 outline-dashed outline-[1px] focus:outline-black"
          placeholder="손해 배상율"
          min={0}
          max={100}
        />
        %를 배상하여야 한다.
      </p>
      <p className="mt-2">
        2. 전항의 파손, 훼손 또는 멸실이 천재지변, 사변, 국가비상사태 등
        불가항력으로 인한 것일 경우 차용인은 배상책임을 면한다.
      </p>
      <p className="mt-6 text-center font-medium">
        {' '}
        <span className="font-semibold text-primary-100 underline underline-offset-2">
          [계약 체결일]
        </span>{' '}
      </p>
      <div className="mt-8 text-center">
        <p>
          <strong>대여인:</strong> {userName}
        </p>
        <p>
          <strong>차용인:</strong>{' '}
          <span className="font-semibold text-primary-100 underline underline-offset-2">
            [대여 신청자]
          </span>
        </p>
      </div>
    </div>
  );
};
