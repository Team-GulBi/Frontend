import { ReactComponent as Star } from '@/assets/svgs/star.svg';
import product1 from '@/assets/images/product1.jpeg';
import profile from '@/assets/images/profile.png';
import { useNavigate } from 'react-router-dom';
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

const ProductViewPage = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleNavigateEdit = () => {
    navigate('/product/1/edit');
  };

  const tags = ['#가전제품', '#노트북', '#애플', '#맥북', '#실버'];

  return (
    <div className="min-h-screen flex w-screen pb-[133px]">
      <HeaderWithoutSearch />
      <div className="flex w-full flex-col px-[220px] pt-[110px]">
        <div className="flex justify-end space-x-2">
          <ProductRelatedButton
            onClick={handleNavigateEdit}
            className="text-neutral-30"
          >
            수정하기
          </ProductRelatedButton>
          <ProductRelatedButton className="text-[#D82D30]">
            삭제하기
          </ProductRelatedButton>
        </div>

        <div className="mb-12 flex flex-col items-start border-b px-[23px] pb-[15px]">
          <div className="mb-4 flex w-full space-x-3">
            <ReadyToRentChip />
            <div className="flex space-x-[6px]">
              <Star 
                width="18" height="18" viewBox="0 0 13 13"
                className="self-center text-[#FCAF15]" />
              <span className="pt-1 text-large22 font-medium text-neutral-20">
                4.5
              </span>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex flex-col">
              <span className="text-xlarge28 font-semibold text-neutral-0">
                맥북 프로 실버 완전 싸게 대여하세요~
              </span>
              <div className="mt-2 flex gap-2">
                {tags.map((tag, index) => (
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
                src={profile}
                alt="profile"
                className="h-11 w-11 rounded-full bg-[#F4D9DC]"
              />
              <span className="text-medium20 font-medium text-neutral-0">
                지니핑
              </span>
            </div>
          </div>
        </div>

        <div className="mx-[38px] mb-[46px] flex space-x-[120px]">
          <div className="flex w-full items-center">
            <Carousel>
              <CarouselContent>
                <CarouselItem>
                  <img src={product1} alt="product" className="w-full" />
                </CarouselItem>
                <CarouselItem>
                  <img src={product1} alt="product" className="w-full" />
                </CarouselItem>
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
                맥북 프로 실버 16RAM
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              <span className="text-large22 font-medium text-neutral-0">
                가격
              </span>
              <span className="text-small16 font-light text-neutral-0">
                10000원 / 일
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              <span className="text-large22 font-medium text-neutral-0">
                대여 가능 기간
              </span>
              <div className="flex space-x-4 text-small16 font-light text-neutral-0">
                <span>2024. 09. 27</span>
                <span>~</span>
                <span>2024. 12. 05</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <span className="text-large22 font-medium text-neutral-0">
                위치
              </span>
              <span className="text-small16 font-light text-neutral-0">
                인천대학교 7호관 학회실
              </span>
            </div>
          </div>
        </div>

        <div className="mx-[38px] mb-[50px] flex flex-col space-y-2">
          <span className="text-large22 font-medium text-neutral-0">
            상품 소개
          </span>
          <span className="text-small16 font-light text-neutral-0">
            맥북 프로 실버 모델은 애플의 강력한 성능과 세련된 디자인을 갖춘
            노트북으로, 고성능 작업이 필요한 전문가부터 일상적인 사용자를 위한
            최적의 선택지입니다. 최신 M2 및 M2 Pro, M2 Max 칩 옵션으로 제공되며,
            14인치와 16인치 두 가지 크기로 사용자의 용도에 맞게 선택할 수
            있습니다.
          </span>
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
          <NavigateButton onClick={handleNavigateHome}>채팅하기</NavigateButton>
          <NavigateButton onClick={handleNavigateHome}>예약하기</NavigateButton>
          <NavigateButton onClick={handleNavigateHome}>
            계약서 작성하기
          </NavigateButton>
        </div>

        <div className="mb-7 border-b py-[10px]">
          <span className="px-[23px] text-large24 font-semibold text-neutral-0">
            맥북 실버 프로 후기
          </span>
        </div>
        <div className="flex flex-col space-y-9">
          <ReviewCard />
          <ReviewCard />
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;