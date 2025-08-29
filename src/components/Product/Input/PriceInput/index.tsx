import { ChangeEvent, useState } from 'react';

interface PriceInputProps {
  value: number | undefined;
  onChangePrice: (value: number) => void;
}

export const PriceInput = ({ value, onChangePrice }: PriceInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '') {
      onChangePrice(0);
      return;
    }

    const numericValue = inputValue.replace(/[^0-9]/g, '');
    if (numericValue) {
      const numberValue = parseInt(numericValue, 10);
      onChangePrice(numberValue);
    }
  };

  return (
    <div className="flex flex-col gap-4 px-[1rem]">
      <span className="text-medium18 text-neutral-0">가격</span>
      <div className="flex gap-[1.3rem]">
        <div
          className={`w-50 border ${
            isFocused ? '' : 'border-neutral-80'
          } items-end justify-between rounded-xs bg-neutral-100 px-[1rem] py-[0.75rem]`}
        >
          <input
            type="number"
            min="0"
            className="font-regular bg-neutral-100 text-small16 text-neutral-0 focus:outline-none"
            value={value === undefined || value === 0 ? '' : value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <span className="font-regular text-small16 text-placeholder">원</span>
        </div>
      </div>
    </div>
  );
};
