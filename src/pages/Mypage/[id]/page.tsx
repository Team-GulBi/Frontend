import { ReactComponent as Bag } from '@/assets/svgs/bag.svg';
import { ReactComponent as User } from '@/assets/svgs/defaultProfile.svg';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductCard } from '@/components/common/ProductCard';
import { HeaderWithSearch } from '@/components/common/Header';
import { ReserveModal } from '@/components/Product/ReserveModal';
import { useGetSpecificUserProducts } from '@/hooks/queries/useGetUserProducts';
import RoutePath from '@/routes/routePath';

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = parseInt(id || '0');
  
  const [isReserveModalOpen, setIsReserveModalOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    if (currentUserId && parseInt(currentUserId) === userId) {
      navigate(RoutePath.MyPage);
    }
  }, [userId, navigate]);
  
  const { 
    data: userProductsData, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading 
  } = useGetSpecificUserProducts(userId);
  
  const nickname = userProductsData?.pages[0]?.data?.nickname || '사용자';

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  const lastElementRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) {
      observerRef.current.observe(node);
      lastElementRef.current = node;
    }
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCalendarClick = (productId: number) => {
    setSelectedProductId(productId);
    setIsReserveModalOpen(true);
  };

  const allProducts = userProductsData?.pages.flatMap(page => page.data.products) || [];

  return (
    <div className="min-h-screen relative flex w-screen bg-gradient-to-br from-gray-50 to-white">
      <HeaderWithSearch />
      <div className="w-full flex-col px-[240px] py-[120px]">
        <div className="mb-[50px]">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="text-gray-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {nickname}
                </h1>
                <p className="text-sm text-gray-500">
                  {nickname}님이 등록한 상품들을 확인해보세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-[30px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Bag className="text-white" />
            </div>
            <div>
              <h2 className="text-large22 font-semibold text-neutral-0 border-b-2 border-primary-100 pb-1">
                {nickname}님이 등록한 상품
              </h2>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          {isLoading ? (
            <div className="w-full flex justify-center py-20">
                <div className="text-center mx-auto">
                    <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-secondary-20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-secondary-90 rounded-full animate-spin"></div>
                  </div>
                </div>
                <p className="text-gray-600 text-xl font-medium">상품을 불러오는 중...</p>
                <p className="text-gray-500 text-sm mt-2">잠시만 기다려주세요</p>
              </div>
            </div>
          ) : allProducts.length === 0 ? (
            <div className="w-full flex justify-center py-20">
              <div className="text-center max-w-md">
                <div className="text-7xl mb-6">📦</div>
                <p className="text-gray-600 font-medium mb-6">
                  {nickname}님이 등록한 상품이 아직 없어요!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full">
              {allProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  ref={index === allProducts.length - 1 ? lastElementRefCallback : undefined}
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
        
        {isFetchingNextPage && (
          <div className="w-full flex justify-center py-10 mt-6">
            <div className="text-center">
              <div className="mb-3">
                <div className="relative">
                  <div className="w-8 h-8 border-2 border-secondary-20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-8 h-8 border-2 border-transparent border-t-secondary-90 rounded-full animate-spin"></div>
                </div>
              </div>
              <p className="text-gray-500 text-sm">더 많은 상품을 불러오는 중...</p>
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

export default UserProfilePage;
