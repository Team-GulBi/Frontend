import { ChangeEvent } from "react";

interface LocationInputProps {
    title: string;
    sido: string;
    sigungu: string;
    bname: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }
  
  export const LocationInput = ({
    title,
    sido,
    sigungu,
    bname,
    onChange,
  }: LocationInputProps) => {
    return (
      <div className="flex flex-col w-full gap-4 px-[1rem]">
        <span className="text-medium18 text-neutral-0">{title}</span>
        <div className="flex w-full justify-between space-x-5">
          <input
            name="sido"
            className="w-full font-regular rounded-xs border border-neutral-80 bg-neutral-100 px-[1rem] py-[0.75rem] text-small16 text-neutral-0 focus:outline-none"
            value={sido}
            onChange={onChange}
            placeholder="시/도"
          />
          <input
            name="sigungu"
            className="w-full font-regular rounded-xs border border-neutral-80 bg-neutral-100 px-[1rem] py-[0.75rem] text-small16 text-neutral-0 focus:outline-none"
            value={sigungu}
            onChange={onChange}
            placeholder="시/군/구"
          />
          <input
            name="bname"
            className="w-full font-regular rounded-xs border border-neutral-80 bg-neutral-100 px-[1rem] py-[0.75rem] text-small16 text-neutral-0 focus:outline-none"
            value={bname}
            onChange={onChange}
            placeholder="읍/면/동"
          />
        </div>
      </div>
    );
  };
  