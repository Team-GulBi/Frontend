import { ReactComponent as Bag } from '@/assets/svgs/bag.svg';
import { ReactComponent as EditProfile } from '@/assets/svgs/editProfile.svg';
import { ReactComponent as User } from '@/assets/svgs/defaultProfile.svg';
import { useState, useRef, useCallback } from 'react';
import { ProfileModifyModal } from '@/components/Modal/ProfileModifyModal';
import { ProductCard } from '@/components/common/ProductCard';
import { HeaderWithSearch } from '@/components/common/Header';
import { ReserveModal } from '@/components/Product/ReserveModal';
import { useGetUserProducts } from '@/hooks/queries/useGetUserProducts';

const MyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  const {
    data: userProductsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetUserProducts();

  const nickname = userProductsData?.pages[0]?.data?.nickname || '사용자';

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  const lastElementRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      if (node) {
        observerRef.current.observe(node);
        lastElementRef.current = node;
      }
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const handleCalendarClick = (productId: number) => {
    setSelectedProductId(productId);
    setIsReserveModalOpen(true);
  };

  const allProducts =
    userProductsData?.pages.flatMap((page) => page.data.products) || [];

  return (
    <div className="min-h-screen relative flex w-screen bg-gradient-to-br from-gray-50 to-white">
      <HeaderWithSearch />
      <div className="w-full flex-col px-[240px] py-[120px]">
        <div className="mb-[50px]">
          <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <User className="text-gray-500" />
                </div>
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    {nickname}
                  </h1>
                  <p className="text-sm text-gray-500">
                    내가 올린 상품과 빌린 대여현황을 한눈에 확인하세요!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200"
              >
                <EditProfile />
                <span className="text-xsmall14 font-medium">프로필 수정</span>
              </button>
            </div>
          </div>

          {isModalOpen && (
            <ProfileModifyModal setIsModalOpen={setIsModalOpen} />
          )}
        </div>

        <div className="mb-[30px]">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              <Bag className="text-white" />
            </div>
            <div>
              <h2 className="border-b-2 border-primary-100 pb-1 text-large22 font-semibold text-neutral-0">
                {nickname}님이 등록한 상품
              </h2>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex w-full justify-center py-20">
            <div className="mx-auto text-center">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full border-4 border-secondary-20"></div>
                  <div className="absolute left-0 top-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-secondary-90"></div>
                </div>
              </div>
              <p className="text-xl font-medium text-gray-600">
                상품을 불러오는 중...
              </p>
              <p className="mt-2 text-sm text-gray-500">잠시만 기다려주세요</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="flex justify-center">
            {allProducts.length === 0 ? (
              <div className="flex w-full justify-center py-20">
                <div className="max-w-md bg-white p-12 text-center">
                  <div className="mb-6 text-7xl">📦</div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">
                    아직 등록한 상품이 없어요
                  </h3>
                  <p className="mb-6 text-gray-600">
                    첫 번째 상품을 등록하고 Yajoba를 시작해보세요!
                  </p>
                  <button className="rounded-xl bg-secondary-90 px-8 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-secondary-80 hover:shadow-lg">
                    상품 등록하기
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {allProducts.map((product, index) => (
                  <div
                    key={product.id}
                    ref={
                      index === allProducts.length - 1
                        ? lastElementRefCallback
                        : undefined
                    }
                    className="transform transition-all duration-300 hover:scale-105"
                  >
                    <ProductCard
                      name={product.title}
                      imageSrc={product.mainImage}
                      price={product.price}
                      productId={product.id}
                      onCalendarClick={handleCalendarClick}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isFetchingNextPage && (
          <div className="mt-6 flex w-full justify-center py-10">
            <div className="text-center">
              <div className="mb-3">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full border-2 border-secondary-20"></div>
                  <div className="absolute left-0 top-0 h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-secondary-90"></div>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                더 많은 상품을 불러오는 중...
              </p>
            </div>
          </div>
        )}
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
