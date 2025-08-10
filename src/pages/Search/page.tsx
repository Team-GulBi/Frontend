import { HeaderWithSearch } from '@/components/common/Header';
import { SearchCard } from '@/components/Search/SearchCard';
import { useSearchParams } from 'react-router-dom';
import useGetProductSearch from '@/hooks/queries/useGetProductSearch';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const detail = searchParams.get("detail") || "";

  const { data, isLoading } = useGetProductSearch(query, detail);

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <div className="min-h-screen flex w-screen flex-col">
      <HeaderWithSearch />
      <div className="mb-7 mt-[130px] flex items-center justify-center w-full px-[217px]">
      {data?.data && data.data.length > 0 ? (
          data.data.map((product) => (
            <SearchCard
              key={product.id}
              productId={product.id}
              productImg={product.mainImage}
              productNm={product.title}
              productPlace="서울특별시 강남구"
              productPrice={product.price}
              userImg="/default-user.png"
              userNm="판매자"
            />
          ))
        ) : (
          <p className='text-medium18 text-neutral-40 mt-20 font-heavy'>{query}에 대한 검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;