import { useNavigate } from "react-router-dom";

interface CardProps {
    name: string;
    imageSrc: string;
    price: number;
    productId: number;
}
  
export const ProductCard = ({ name, imageSrc, price, productId }: CardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${productId}`);
  }
  return (
    <div 
      onClick={handleClick}
      className="relative bg-white w-[170px] flex-col overflow-hidden
        cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105">
      {/* <div className="absolute rounded-[4px] top-0 left-0 w-full h-[40px] bg-gradient-to-b from-[rgba(0, 0, 0, 0.4)] to-[rgba(102,102,102,0.00)] pointer-events-none"></div> */}
        <img
        src={imageSrc}
        alt={name}
        className="w-full h-[170px] rounded-[4px] object-cover"
      />
      <div className="flex flex-col">
        <span className="text-medium18 font-semibold text-neutral-10 mt-3 mb-1 ">
          {name}
        </span>
        <span className="text-xsmall14 text-neutral-40">
          {price}원
        </span>
      </div>
      
    </div>
  );
};