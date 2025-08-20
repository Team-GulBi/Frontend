import profile from '@/assets/images/profile.png';
import { ReactComponent as Bag } from '@/assets/svgs/bag.svg';
import { ReactComponent as Cart } from '@/assets/svgs/cart.svg';
import { ReactComponent as EditProfile } from '@/assets/svgs/editProfile.svg';
import product1 from '@/assets/images/product1.jpeg';
import product2 from '@/assets/images/product2.jpeg';
import product3 from '@/assets/images/product3.jpeg';
import product4 from '@/assets/images/product4.jpeg';
import product5 from '@/assets/images/product5.jpeg';
import { useState } from 'react';
import { ProfileModifyModal } from '@/components/Modal/ProfileModifyModal';
import { ProductCard } from '@/components/common/ProductCard';
import { HeaderWithSearch } from '@/components/common/Header';
import { ReserveModal } from '@/components/Product/ReserveModal';

const ownedProducts = [
  { name: '맥북 프로 실버', imageSrc: product1, price: 5000 },
  { name: '자전거', imageSrc: product2, price: 5000 },
  { name: '아이폰 14 Pro', imageSrc: product3, price: 5000 },
  { name: '맥북 프로 실버', imageSrc: product1, price: 5000 },
  { name: '자전거', imageSrc: product2, price: 5000 },
  { name: '아이폰 14 Pro', imageSrc: product3, price: 5000 },
];

const rentedProducts = [
  { name: '에어팟 맥스', imageSrc: product4, price: 5000 },
  { name: '에어팟', imageSrc: product5, price: 5000 },
];

const MyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'owned' | 'rented'>('owned');
  const [isReserveModalOpen, setIsReserveModalOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const userId = Number(localStorage.getItem('userId'));

  const handleCalendarClick = (productId: number) => {
    setSelectedProductId(productId);
    setIsReserveModalOpen(true);
  };

  return (
    <div className="min-h-screen relative flex w-screen">
      <HeaderWithSearch />
      <div className="w-full flex-col px-[240px] py-[120px]">
        <div className="mb-[35px] flex items-center">
          <img
            src={profile}
            alt="profile"
            className="mr-[30px] h-[140px] w-[140px] rounded-full border border-neutral-80 p-3 shadow-md"
          />
          <div className="w-full flex-col">
            <div className="flex justify-between">
              <div className="flex gap-3">
                <div className="text-xlarge28 font-semibold text-neutral-0">
                  지니핑
                </div>
                <EditProfile onClick={() => setIsModalOpen(true)} />
              </div>
            </div>

            {isModalOpen && (
              <ProfileModifyModal
                setIsModalOpen={setIsModalOpen}
              />
            )}

            <span className="text-xsmall14 font-medium text-neutral-30">
              집 가고 싶어요
            </span>
          </div>
        </div>

        <div className="mb-[20px] flex space-x-3 pb-1">
          <button
            className={`flex items-center gap-1 rounded-md px-6 py-3 shadow-md ${
              activeTab === 'owned'
                ? 'bg-secondary-90 font-bold text-neutral-100'
                : 'font-regular bg-secondary-10 text-neutral-10'
            }`}
            onClick={() => setActiveTab('owned')}
          >
            <Bag />
            <span className="text-small16 font-semibold">지니핑님 상품</span>
          </button>

          <button
            className={`flex items-center gap-1 rounded-md px-6 py-3 shadow-md ${
              activeTab === 'rented'
                ? 'bg-secondary-90 font-bold text-neutral-100'
                : 'font-regular bg-secondary-10 text-neutral-10'
            }`}
            onClick={() => setActiveTab('rented')}
          >
            <Cart />
            <span className="text-small16 font-semibold">대여중인 상품</span>
          </button>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {(activeTab === 'owned' ? ownedProducts : rentedProducts).map(
              (product, index) => (
                <ProductCard
                  key={index}
                  name={product.name}
                  imageSrc={product.imageSrc}
                  price={product.price}
                  productId={1}
                  onCalendarClick={handleCalendarClick}
                />
              ),
            )}
          </div>
        </div>
      </div>

      {isReserveModalOpen && selectedProductId && (
        <ReserveModal
          productId={selectedProductId}
          onClose={() => {
            setIsReserveModalOpen(false);
            setSelectedProductId(null);
          }}
        />
      )}
    </div>
  );
};

export default MyPage;
