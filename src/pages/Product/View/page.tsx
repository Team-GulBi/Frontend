import { ReactComponent as Star } from '@/assets/svgs/star.svg';
import { useNavigate, useParams } from 'react-router-dom';
import DefaultProfile from "@/assets/images/DefaultProfile.png";
import { ReviewCard } from '../../../components/Product/ReviewCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { HeaderWithoutSearch } from '@/components/common/Header';
import { ReadyToRentChip } from '@/components/common/ProductStatusChip';
import { NavigateButton } from '@/components/Product/Button/NavigateButton';
import { ProductRelatedButton } from '@/components/Product/Button/ProductRelatedButton';
import { ReactComponent as RightArray } from '@/assets/svgs/rightarray.svg';
import useGetProductDetail from '@/hooks/queries/useGetProductDetail';
import useSeperateTags from '@/hooks/utils/useSeperateTags';
import { useDeleteProduct } from '@/hooks/mutations/useDeleteProduct';

const ProductViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetProductDetail(Number(id));
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const tagList = useSeperateTags(data?.data?.tag);

  const handleNavigatePage = () => {
    navigate("/");
  }

  const handleEdit = () => {
    navigate(`/product/edit/${id}`);
  };

  // 삭제 모달 추가 예정
  const handleDelete = () => {
    if (window.confirm("상품을 삭제하시겠습니까?")) {
      deleteProduct(Number(id), {
        onSuccess: () => {
          navigate("/");
        },
      });
    }
  };

  if (isLoading || isPending) return <div>로딩 중...</div>;

  return (
    <div className="min-h-screen flex w-screen pb-[133px]">
      <HeaderWithoutSearch />
      <div className="flex w-full flex-col px-[220px] pt-[110px]">
        <div className="flex justify-end space-x-2">
          <ProductRelatedButton
            onClick={handleEdit}
            className="text-neutral-30"
          >
            수정하기
          </ProductRelatedButton>
          <ProductRelatedButton onClick={handleDelete} className="text-[#D82D30]">
            삭제하기
          </ProductRelatedButton>
        </div>

        <div className="mb-12 flex flex-col items-start border-b px-[23px] pb-[15px]">
          <div className="mb-2 flex w-full flex-col">
            <div className="mb-2 flex items-end gap-1">
              <Star className="self-center" />
              <span className="pt-1 text-medium20 font-medium text-neutral-20">
                {data?.data?.rating}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-small16 text-neutral-40">
              <ReadyToRentChip />
              <span>{data?.data?.bcategory.name}</span>
              <RightArray />
              <span>{data?.data?.mcategory.name}</span>
              <RightArray />
              <span>{data?.data?.scategory.name}</span>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex flex-col">
              <span className="text-xlarge28 font-semibold text-neutral-0">
                {data?.data?.title}
              </span>
              <div className="mt-2 flex gap-2">
              {tagList.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-md bg-neutral-100 px-2 py-1 text-xsmall14 text-neutral-0"
                >
                  {tag}
                </span>
              ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={data?.data?.userPhoto.imageUrl || DefaultProfile}
                alt="profile"
                className="h-11 w-11 rounded-full border"
              />
              <span className="text-medium20 font-medium text-neutral-0">
                {data?.data?.userNickname}
              </span>
            </div>
          </div>
        </div>

        <div className="mx-[38px] mb-[46px] flex space-x-[120px]">
        <div className="flex w-full items-center">
    <Carousel>
      <CarouselContent>
        {data?.data?.images?.length ? (
          <CarouselItem key="main">
            <img
              src={decodeURIComponent(data.data.images[0])}
              alt="main-product"
              className="w-full object-cover rounded-md"
            />
          </CarouselItem>
        ) : (
          <div>대표 이미지 없음</div>
        )}

        {(data?.data?.images?.slice(1) ?? []).map((image, index) => (
          <CarouselItem key={`product-${index + 1}`}>
            <img
              src={decodeURIComponent(image)}
              alt={`product-${index + 1}`}
              className="w-full object-cover rounded-md"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>

          <div className="flex w-full flex-col space-y-8 pr-10">
            <div className="flex flex-col space-y-2">
              <span className="text-large22 font-medium text-neutral-0">
                상품명
              </span>
              <span className="text-small16 font-light text-neutral-0">
                {data?.data?.productName}
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              <span className="text-large22 font-medium text-neutral-0">
                가격
              </span>
              <span className="text-small16 font-light text-neutral-0">
                {data?.data?.price}원
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              <span className="text-large22 font-medium text-neutral-0">
                위치
              </span>
              <span className="text-small16 font-light text-neutral-0">
                {data?.data?.sido} {data?.data?.sigungu} {data?.data?.bname}
              </span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-large22 font-medium text-neutral-0">
                상품 소개
              </span>
              <span className="text-small16 font-light text-neutral-0">
                {data?.data?.description}
              </span>
            </div>
          </div>
        </div>

        <div className="mx-[30px] mb-[30px] flex flex-col space-y-4 rounded-[8px] border border-neutral-80 bg-[#F7F7F7] px-6 py-5">
          <span className="text-medium20 font-medium text-[#F94832]">
            읽어주세요!
          </span>
          <span className="font-regular text-xsmall14 text-neutral-30">
            계약서 작성 요청은 상대방이 수락을 할 시 온라인으로 실시간
            작성가능합니다. (미리 채팅으로 시간 협의 후 요청 권장드립니다.)
            <br />
            온라인 계약서 작성은 초안으로 생각 해 주시고 세부 사항은 물건을 직접
            확인 후 추가 작성하시기 권장드립니다.
            <br />
            온라인 계약서 작성은 필수사항이 아닙니다. 대면 후 따로 작성하셔도
            괜찮습니다.
            <br />
            물건 상태 꼼꼼히 확인 후 사진 잘 찍어놓기 & 작동상태 꼭 확인하기
          </span>
        </div>

        <div className="mx-[30px] mb-[25px] flex justify-end space-x-6">
          <NavigateButton onClick={handleNavigatePage}>채팅하기</NavigateButton>
          <NavigateButton onClick={handleNavigatePage}>예약하기</NavigateButton>
          <NavigateButton onClick={handleNavigatePage}>
            계약서 작성하기
          </NavigateButton>
        </div>

        <div className="mb-7 border-b py-[10px]">
          <span className="px-[23px] text-large24 font-semibold text-neutral-0">
            {data?.data?.productName} 후기
          </span>
        </div>

        <div className="flex flex-col space-y-9">
          {data?.data?.reviews.map((review, index) => (
            <ReviewCard key={index} nickname="닉네임" rating={review.rating} content={review.content} createdAt="2025.02.06"/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;
