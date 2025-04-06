import { useEffect, useState } from 'react';
import { ReactComponent as Puzzle } from '@/assets/svgs/puzzle.svg';
import product1 from '@/assets/images/product1.jpeg';
import product2 from '@/assets/images/product2.jpeg';
import product3 from '@/assets/images/product3.jpeg';
import product4 from '@/assets/images/product4.jpeg';
import { HeaderWithSearch, LoginHeader} from '@/components/common/Header';
import { ProductCard } from '@/components/common/ProductCard';
import { useUserStore } from '@/libraries/stores';
const products = [
  {
    name: '맥북 프로 실버',
    imageSrc: product1,
    status: '대여중',
  },
  {
    name: '자전거',
    imageSrc: product2,
    status: '대여 마감',
  },
  {
    name: '아이폰 14 Pro',
    imageSrc: product3,
    status: '예약중',
  },
  {
    name: '에어팟 맥스',
    imageSrc: product4,
    status: '대여 가능',
  },
];

const MainPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // 로그인 상태
  const myUserId = useUserStore((state) => state.userId);
  useEffect(() => {
    console.log("myUserId 상태 확인:", myUserId);
  }, [myUserId]);
  
   // 컴포넌트 마운트 시 token 확인
   useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // token이 있으면 true, 없으면 false로 설정함
  }, []);
  
  return (
    <div className="min-h-screen flex max-w-screen flex-col">
      {isLoggedIn ? <HeaderWithSearch /> : <LoginHeader />}
      <div className="mb-7 flex w-full justify-center pt-[75px]">
        <div className="flex h-[244px] w-full rounded-[10px] bg-secondary-70 shadow-lg">
          <Puzzle className="z-60 mr-[400px] rounded-[10px]" />
          <div className="flex flex-col items-center justify-center gap-7">
            <span className="text-large24 font-medium text-neutral-100">
              불필요한 소비를 줄이는 공유경제
            </span>
            <span className="text-xxlarge36 font-bold text-neutral-100">
              Ya!joba로 시작해볼까요?
            </span>
          </div>
        </div>
      </div>
      <div className="flex-col">
        <div className="mb-[30px] flex-col">
          <div className="mb-[10px] p-3">
            <div className="flex items-end justify-center gap-2">
              {/* <Good width="80" height="83" viewBox="0 0 116 119" /> */}
              <span className="self-end text-xxlarge32 font-semibold text-neutral-0">
                지금 주목해야 할 추천 상품
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 gap-8 border-t-2 border-neutral-80 pt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard
                  key={index}
                  name={product.name}
                  imageSrc={product.imageSrc}
                  status={product.status}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mb-[30px] flex-col">
          <div className="mb-[10px] p-3">
            <div className="flex items-end justify-center gap-2">
              {/* <Heart width="66" height="50" viewBox="0 0 75 59" /> */}
              <span className="text-center text-xxlarge32 font-semibold text-neutral-0">
                인기 상품
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 gap-8 border-t-2 border-neutral-80 pt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard
                  key={index}
                  name={product.name}
                  imageSrc={product.imageSrc}
                  status={product.status}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;