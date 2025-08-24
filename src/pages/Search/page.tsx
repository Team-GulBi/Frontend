import { HeaderWithSearch } from '@/components/common/Header';
import { SearchCard } from '@/components/Search/SearchCard';
import { useSearchParams } from 'react-router-dom';
import useGetProductSearch from '@/hooks/queries/useGetProductSearch';
import { useRef, useCallback } from 'react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetProductSearch(query);

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

  const allProducts = data?.pages.flatMap((page) => page.data.products) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex w-screen flex-col">
        <HeaderWithSearch />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-9 flex justify-center">
              <div className="flex space-x-[6px]">
                <div
                  className="h-5 w-5 animate-ping rounded-full bg-secondary-100"
                  style={{ animationDelay: '0s' }}
                ></div>
                <div
                  className="h-5 w-5 animate-ping rounded-full bg-secondary-100"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="h-5 w-5 animate-ping rounded-full bg-secondary-100"
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-large22 font-semibold text-neutral-0">
                {query}를 찾고 있어요!
              </p>
              <p className="text-neutral-40">잠시만 기다려주세요</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-screen flex-col">
      <HeaderWithSearch />
      <div className="mb-7 mt-[130px] flex w-full flex-col justify-center pl-[200px] pr-[200px]">
        {allProducts.length > 0 ? (
          <>
            <span className="text-large22 font-medium text-neutral-0">
              '{query}'에 대한 검색 결과입니다.
            </span>
            <div className="mt-3 h-[1px] w-full bg-neutral-80" />

            <div className="mt-8 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
              {allProducts.map((product, index) => (
                <div key={`${product.id}-${index}`}>
                  <SearchCard
                    productId={product.id}
                    productImg={product.mainImage}
                    productNm={product.title}
                    productPrice={product.price.toString()}
                  />
                  {index === allProducts.length - 1 && (
                    <div ref={lastElementRefCallback} className="h-4" />
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <span className="text-large22 font-medium text-neutral-0">
              '{query}'에 대한 검색 결과가 없습니다.
            </span>
            <div className="mt-3 h-[1px] w-full bg-neutral-80" />
          </>
        )}

        {isFetchingNextPage && (
          <div className="mt-6 text-center">
            <p className="text-neutral-40">더 많은 상품을 불러오는 중...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
