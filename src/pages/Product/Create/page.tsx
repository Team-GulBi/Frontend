import { ChangeEvent, useState, useEffect } from 'react';
import { PriceInput } from '@/components/Product/Input/PriceInput';
import { LocationInput } from '@/components/Product/Input/LocationInput';
import { HeaderWithoutSearch } from '@/components/common/Header';
import { CategoryDropdowns } from '@/components/Product/ProductCategory';
import { ProductContent } from '@/components/Product/ProductContent';
import { ProductInput } from '@/components/Product/Input/ProductInput';
import usePostProduct from '@/hooks/mutations/usePostProduct';
import { useNavigate } from 'react-router-dom';
import RoutePath from '@/routes/routePath';
import { CreateImageUploader } from '@/components/Product/ImageUploader/Create';
import { ProductContractTemplate } from '@/components/contract/ProductContractTemplate';
import { refreshToken } from '@/apis';
import { ReactComponent as RightArrow } from '@/assets/svgs/RightArrow.svg';
import { Toast } from '@/components/common/Toast';

const ProductCreatePage = () => {
  const [step, setStep] = useState<'product' | 'contract'>('product');

  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [bname, setBname] = useState('');
  const [bcategoryId, setBCategoryId] = useState<number | undefined>(undefined);
  const [mcategoryId, setMCategoryId] = useState<number | undefined>(undefined);
  const [scategoryId, setSCategoryId] = useState<number | undefined>(undefined);
  const [images, setImages] = useState<File[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);

  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastType, setToastType] = useState<'error' | 'success'>('error');

  const [contractData, setContractData] = useState({
    specification: '',
    condition: '',
    note: '',
    rentalPlace: '',
    returnPlace: '',
    lateInterestRate: 0,
    latePenaltyRate: 0,
    damageCompensationRate: 0,
  });

  const userName = localStorage.getItem('nickname') || '';

  const navigate = useNavigate();

  const resetForm = () => {
    setStep('product');
    setTitle('');
    setName('');
    setDescription('');
    setPrice(undefined);
    setSido('');
    setSigungu('');
    setBname('');
    setBCategoryId(undefined);
    setMCategoryId(undefined);
    setSCategoryId(undefined);
    setImages([]);
    setMainImage(null);
    setContractData({
      specification: '',
      condition: '',
      note: '',
      rentalPlace: '',
      returnPlace: '',
      lateInterestRate: 0,
      latePenaltyRate: 0,
      damageCompensationRate: 0,
    });
  };

  const { mutate: createProduct } = usePostProduct(
    () => {
      setToastMessage('상품이 등록되는 중이에요!');
      setToastType('success');
      setIsToastVisible(true);

      setTimeout(() => {
        navigate(RoutePath.MyPage, { replace: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        resetForm();
      }, 2000);
    },
    () => {
      setToastMessage('상품 등록에 실패했습니다. 다시 시도해주세요.');
      setToastType('error');
      setIsToastVisible(true);
    },
  );

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const nickname = localStorage.getItem('nickname');
      if (!nickname) {
        try {
          await refreshToken();
        } catch (error) {
          navigate('/login');
        }
      }
    };

    checkAndRefreshToken();
  }, [navigate]);

  const handleImageUpload = (
    imageFiles: File[],
    mainImageFile: File | null,
  ) => {
    setImages(imageFiles);
    setMainImage(mainImageFile);
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'sido') setSido(value);
    if (name === 'sigungu') setSigungu(value);
    if (name === 'bname') setBname(value);
  };

  const handlePrevStep = () => {
    setStep('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    const errors = [];

    if (!title.trim()) errors.push('제목을 입력해주세요.');
    if (!name.trim()) errors.push('상품명을 입력해주세요.');
    if (!price) errors.push('가격을 입력해주세요.');
    if (!sido.trim()) errors.push('학교를 입력해주세요.');
    if (!sigungu.trim()) errors.push('건물을 입력해주세요.');
    if (!bname.trim()) errors.push('상세주소를 입력해주세요.');
    if (!description.trim()) errors.push('상품 설명을 입력해주세요.');
    if (!mainImage) {
      errors.push('대표 이미지를 선택해주세요.');
    }
    if (!bcategoryId) errors.push('대분류를 선택해주세요.');
    if (!mcategoryId) errors.push('중분류를 선택해주세요.');
    if (!scategoryId) errors.push('소분류를 선택해주세요.');

    if (errors.length > 0) {
      setToastMessage(errors[0]);
      setToastType('error');
      setIsToastVisible(true);
      return;
    }

    setStep('contract');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    const errors = [];

    if (!contractData.specification.trim())
      errors.push('상품 규격을 입력해주세요.');
    if (!contractData.condition.trim())
      errors.push('상품 상태를 입력해주세요.');
    if (!contractData.rentalPlace.trim())
      errors.push('대여 장소를 입력해주세요.');
    if (!contractData.returnPlace.trim())
      errors.push('반납 장소를 입력해주세요.');
    if (
      contractData.lateInterestRate === undefined ||
      contractData.lateInterestRate < 0
    )
      errors.push('연체 이자율을 입력해주세요.');
    if (
      contractData.latePenaltyRate === undefined ||
      contractData.latePenaltyRate < 0
    )
      errors.push('연체 위약금율을 입력해주세요.');
    if (
      contractData.damageCompensationRate === undefined ||
      contractData.damageCompensationRate < 0
    )
      errors.push('손해 배상율을 입력해주세요.');

    if (errors.length > 0) {
      setToastMessage(errors[0]);
      setToastType('error');
      setIsToastVisible(true);
      return;
    }

    if (
      mainImage &&
      bcategoryId &&
      mcategoryId &&
      scategoryId &&
      sido.trim() &&
      sigungu.trim() &&
      bname.trim() &&
      price
    ) {
      createProduct({
        product: {
          title,
          name,
          price,
          sido,
          sigungu,
          bname,
          description,
          bcategoryId,
          mcategoryId,
          scategoryId,
        },
        template: {
          specification: contractData.specification,
          condition: contractData.condition,
          note: contractData.note,
          rentalPlace: contractData.rentalPlace,
          returnPlace: contractData.returnPlace,
          lateInterestRate: contractData.lateInterestRate,
          latePenaltyRate: contractData.latePenaltyRate,
          damageCompensationRate: contractData.damageCompensationRate,
        },
        images,
        mainImage,
      });
    }
  };

  const handleContractChange = (data: any) => {
    setContractData(data);
  };

  return (
    <div className="min-h-screen flex w-screen">
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        type={toastType}
      />
      <HeaderWithoutSearch />
      <div className="flex w-full flex-col px-[240px] py-[60px]">
        <div className="flex w-full border-b px-2 pb-[2rem] pt-[4rem] text-xxlarge32 font-semibold">
          상품 등록하기
        </div>
        <div className="flex w-full flex-col gap-[2rem] px-[0.5rem] py-[2rem]">
          {step === 'product' ? (
            <>
              <div className="mb-2 flex flex-col gap-2">
                <h2 className="text-large24 font-semibold text-secondary-100">
                  상품 입력
                </h2>
                <span className="text-xsmall14 font-medium text-neutral-0">
                  상품 상세 정보들을 입력해주세요.
                </span>
              </div>
              <ProductInput
                title="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <ProductInput
                title="상품명"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <CreateImageUploader
                maxImages={10}
                onImagesChange={handleImageUpload}
                initialImages={images}
                initialMainImage={mainImage}
              />
              <PriceInput value={price} onChangePrice={setPrice} />
              <CategoryDropdowns
                setBCategoryId={setBCategoryId}
                setMCategoryId={setMCategoryId}
                setSCategoryId={setSCategoryId}
                initialBCategoryId={bcategoryId}
                initialMCategoryId={mcategoryId}
                initialSCategoryId={scategoryId}
              />
              <ProductContent
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <LocationInput
                title="위치"
                sido={sido}
                sigungu={sigungu}
                bname={bname}
                onChange={handleLocationChange}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="flex flex-col items-center gap-2 px-6 py-4"
                >
                  <RightArrow
                    className="text-secondary-100"
                    width="30"
                    height="28"
                    viewBox="0 0 12 10"
                  />
                  <span className="text-medium18 font-medium text-secondary-100">
                    다음 단계
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="mb-2 text-large24 font-semibold text-secondary-100">
                  계약서 템플릿 작성
                </h2>
                <p className="text-xsmall14 font-medium text-neutral-0">
                  계약서에 들어갈 기본 정보를 입력해주세요.
                </p>
                <p className="text-xsmall14 font-medium text-neutral-0">
                  색칠된 부분은 추후에 대여 신청자가 작성할 내용이에요!
                </p>
              </div>
              <ProductContractTemplate
                {...contractData}
                onInputChange={handleContractChange}
                userName={userName}
                productName={name}
                address={`${sido} ${sigungu} ${bname}`}
                price={price}
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevStep}
                  className="flex flex-col items-center gap-2 rounded-[6px] px-6 py-4"
                >
                  <RightArrow
                    className="rotate-180 text-secondary-100"
                    width="30"
                    height="28"
                    viewBox="0 0 12 10"
                  />
                  <span className="text-medium18 font-medium text-secondary-100">
                    이전 단계
                  </span>
                </button>
                <button
                  onClick={handleSubmit}
                  className="rounded-[6px] bg-secondary-100 px-6 py-3 text-white transition-colors hover:bg-secondary-80"
                >
                  상품 등록
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCreatePage;
