import { ChangeEvent } from "react";

interface InputProps {
    title?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }
  
  export const ProductInput = ({ title, value, onChange }: InputProps) => {
    return (
      <div className="flex flex-col gap-4 px-[1rem]">
        <span className="text-medium18 text-neutral-0">{title}</span>
        <input
          className="font-regular rounded-xs border border-neutral-80 bg-neutral-100 px-[0.75rem] py-[0.75rem] text-small16 text-neutral-0 focus:outline-none"
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };