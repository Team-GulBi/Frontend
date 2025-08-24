import { useNavigate } from 'react-router-dom';
import { ReactComponent as Calendar } from '@/assets/svgs/Calendar.svg';

interface CardProps {
  name: string;
  imageSrc: string;
  price: number;
  productId: number;
  onCalendarClick: (productId: number) => void;
}

export const ProductCard = ({
  name,
  imageSrc,
  price,
  productId,
  onCalendarClick,
}: CardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${productId}`);
  };

  const handleCalendarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCalendarClick(productId);
  };
  return (
    <div
      onClick={handleClick}
      className="relative w-full max-w-[180px] cursor-pointer flex-col overflow-hidden bg-white"
    >
      {/* <div className="absolute rounded-[4px] top-0 left-0 w-full h-[40px] bg-gradient-to-b from-[rgba(0, 0, 0, 0.4)] to-[rgba(102,102,102,0.00)] pointer-events-none"></div> */}
      <img
        src={imageSrc}
        alt={name}
        className="h-[160px] w-full rounded-[4px] object-cover"
      />
      <div className="flex flex-col">
        <div className="mb-1 mt-3 flex items-center justify-between">
          <span className="text-medium18 font-semibold text-neutral-10">
            {name}
          </span>
          <button
            onClick={handleCalendarClick}
            className="rounded-full p-2 transition-colors hover:bg-secondary-10"
          >
            <Calendar className="text-neutral-60" />
          </button>
        </div>
        <span className="text-xsmall14 text-neutral-40">
          {price.toLocaleString('ko-KR')}원
        </span>
      </div>
    </div>
  );
};
