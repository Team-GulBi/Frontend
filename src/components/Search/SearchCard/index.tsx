import { RentedChip } from '@/components/common/ProductStatusChip';
import { useNavigate } from 'react-router-dom';

export type SearchCardProps = {
  productId: number;
  productNm: string;
  productPrice: string;
  productPlace: string;
  productImg: string;
  userImg: string;
  userNm: string;
};

export const SearchCard = ({
  productId,
  productNm,
  productPrice,
  productPlace,
  productImg,
  userImg,
  userNm,
}: SearchCardProps) => {
  const navigate = useNavigate();

  const handleProduct = () => {
    navigate(`/product/${productId}`);
  };

  return (
    <div
      className="flex w-full cursor-pointer gap-[50px] rounded-[8px] bg-white shadow-lg"
      onClick={handleProduct}
    >
      <div className="relative">
        <img src={productImg} alt="product image" className="p-3 w-[220px] h-[220px] object-contain" />
        <RentedChip className="absolute left-0 top-0" />
      </div>
      <div className="flex flex-col py-[30px]">
        <span className="mb-[11px] text-large24 font-medium text-neutral-0">
          {productNm}
        </span>
        <span className="font-regular mb-[6px] text-small16 text-neutral-0">
          {productPrice}원
        </span>
        <span className="font-regular mb-[34px] text-xsmall14 text-neutral-60">
          {productPlace}
        </span>
        <div className="flex items-center gap-[7px]">
          <img
            src={userImg}
            alt="user image"
            className="h-[36px] w-[36px] rounded-full border"
          />
          <span className="text-xsmall14 font-medium text-neutral-0">
            {userNm}
          </span>
        </div>
      </div>
    </div>
  );
};
