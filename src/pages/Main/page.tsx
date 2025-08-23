import { useEffect, useState } from 'react';
import product1 from '@/assets/images/product1.jpeg';
import product2 from '@/assets/images/product2.jpeg';
import product3 from '@/assets/images/product3.jpeg';
import product4 from '@/assets/images/product4.jpeg';
import { HeaderWithSearch, LoginHeader} from '@/components/common/Header';
import { ProductCard } from '@/components/common/ProductCard';
import { ReactComponent as RightArrow } from '@/assets/svgs/RightArrow.svg';
import { ReactComponent as Main } from '@/assets/svgs/Main.svg';

import { useUserStore } from '@/libraries/stores';
const products = [
  {
    name: '맥북 프로 실버',
    imageSrc: product1,
    price:10000
  },
  {
    name: '자전거',
    imageSrc: product2,
    price:10000
  },
  {
    name: '아이폰 14 Pro',
    imageSrc: product3,
    price:10000
  },
  {
    name: '에어팟 맥스',
    imageSrc: product4,
    price:10000
  },
  {
    name: '에어팟 맥스',
    imageSrc: product4,
    price: 10000,
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
    <div className="min-h-screen w-screen flex flex-col items-center mb-10">
      {isLoggedIn ? <HeaderWithSearch /> : <LoginHeader />}
      <div className="flex flex-col w-full items-center justify-center pt-[75px]">
        <div className='relative flex w-full items-center justify-center h-[300px] py-10 shadow-lg bg-primary-10'>
          <Main 
            width="380"
            height="250"
            viewBox="0 0 900 600"
          />
          <div className="flex flex-col justify-center space-y-[20px]">
              <p className="gonggothicmedium text-xlarge28 font-bold text-neutral-40">
                불필요한 소비를 줄이는 공유경제
              </p>
              <p className="gonggothicmedium text-xxlarge36 font-bold text-neutral-30">
                <span className='text-primary-100'>Ya ! joba</span>로 시작해볼까요?
              </p>
          </div>
        </div>

        <div className="flex-col mt-7 px-6">
          <div className="mb-[40px] flex-col">
            <div className='flex items-center justify-between'>
              <div className="flex flex-col gap-[2px] mb-[3px] pb-3">
                <span className="font-semibold text-neutral-30">
                  지금 막 등록된 대여 상품, 빠르게 만나보세요!
                </span>
                <span className="text-medium20 font-semibold text-neutral-0">
                  새로 등록된 상품 한눈에 보기
                </span>
              </div>
              <div className='p-1 pr-2 flex items-center font-semibold gap-[6px] text-neutral-40 border-neutral-40 cursor-pointer hover:text-neutral-30'>
                <RightArrow />
                <span className='text-xsmall14'>더 보기</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 gap-8 border-t-2 border-neutral-80 pt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {products.map((product, index) => (
                  <ProductCard
                    key={index}
                    name={product.name}
                    imageSrc={product.imageSrc}
                    price={product.price}
                    productId={1}
                    onCalendarClick={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-[40px] flex-col">
            <div className='flex items-center justify-between'>
              <div className="flex flex-col gap-[2px] mb-[3px] pb-3">
                <span className="font-semibold text-neutral-30">
                  지금 가장 인기 있는 상품, 카테고리별로 한눈에
                </span>
                <span className="text-medium20 font-semibold text-neutral-0">
                  카테고리별 인기 상품 TOP
                </span>
              </div>
              <div className='p-1 pr-2 flex items-center font-semibold gap-[6px] text-neutral-40 border-neutral-40 cursor-pointer hover:text-neutral-30'>
                <RightArrow />
                <span className='text-xsmall14'>더 보기</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 gap-8 border-t-2 border-neutral-80 pt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {products.map((product, index) => (
                  <ProductCard
                    key={index}
                    name={product.name}
                    imageSrc={product.imageSrc}
                    price={product.price}
                    productId={1}
                    onCalendarClick={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className="flex flex-col gap-[2px] mb-[3px] pb-3">
              <span className="font-semibold text-neutral-30">
                땡땡님이 관심 있으실만한 카테고리에요!
              </span>
              <span className="text-medium20 font-bold text-neutral-0">
                실시간 땡땡님 맞춤 카테고리
              </span>
            </div>
            <div className='p-1 flex items-center font-semibold gap-[6px] text-neutral-40 border-neutral-40 cursor-pointer hover:text-neutral-30'>
              <RightArrow />
              <span className='text-xsmall14'>인기 카테고리 상품들 보러가기</span>
            </div>
          </div>

          <div className='flex items-end justify-center h-[240px] gap-6 mb-[40px] border-t-2 border-neutral-80'>
            {[
              { rank: '2등', category: '과일', size: 170, bg: 'bg-primary-70/70', delay: 'delay-100' },
              { rank: '1등', category: '전자제품', size: 200, bg: 'bg-primary-100/70', delay: 'delay-0' },
              { rank: '3등', category: '학용품', size: 140, bg: 'bg-primary-50/70', delay: 'delay-200' },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`
                  flex flex-col items-center justify-center
                  rounded-full shadow-xl hover:shadow-2xl ring-1 ring-white/20
                  ${item.bg} gap-4
                  transition-transform duration-300 ease-out hover:scale-105
                `}
                style={{ width: `${item.size}px`, height: `${item.size}px` }}
              >
                <span className='text-neutral-30'>{item.rank}</span>
                <span className={`
                  font-bold text-neutral-10
                  ${item.rank === '1등' ? 'text-large24' : item.rank === '2등' ? 'text-large22' : 'text-medium20'}
                `}>
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;