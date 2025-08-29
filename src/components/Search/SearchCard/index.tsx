import { useNavigate } from 'react-router-dom';

export type SearchCardProps = {
  productId: number;
  productNm: string;
  productPrice: string;
  productImg: string;
};

export const SearchCard = ({
  productId,
  productNm,
  productPrice,
  productImg,
}: SearchCardProps) => {
  const navigate = useNavigate();

  const handleProduct = () => {
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price: string) => {
    const numPrice = parseInt(price);
    return numPrice.toLocaleString();
  };

  return (
    <div
      className="group flex w-full cursor-pointer gap-6 overflow-hidden bg-white shadow-sm transition-all duration-500 ease-out hover:shadow-lg"
      onClick={handleProduct}
    >
      <div className="relative h-[170px] w-[230px] flex-shrink-0 overflow-hidden">
        <img
          src={productImg}
          alt="product image"
          className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-all duration-500 ease-out group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col justify-center py-6 pr-6">
        <div className="mb-4">
          <h3 className="mb-2 line-clamp-2 text-large24 font-semibold text-neutral-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-secondary-100">
            {productNm}
          </h3>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 transition-all duration-300 ease-out group-hover:translate-x-1">
            <span className="font-medium text-neutral-0 transition-all duration-300 ease-out group-hover:text-secondary-90">
              {formatPrice(productPrice)}
            </span>
            <span className="text-medium16 text-neutral-60 transition-all duration-300 ease-out group-hover:text-neutral-50">
              원
            </span>
          </div>

          <div className="mt-4 translate-y-2 transform opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <div className="inline-flex items-center gap-2 text-xsmall14 font-medium text-neutral-0">
              <span>상세 보기</span>
              <svg
                className="h-4 w-4 transform transition-all duration-300 ease-out group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
