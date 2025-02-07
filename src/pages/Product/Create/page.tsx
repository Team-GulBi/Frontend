import { ImageUploader } from '@/components/Product/ImageUploader';
import { ChangeEvent, useState } from 'react';
import { TagInput } from '@/components/Product/Input/TagInput';
import { PriceInput } from '@/components/Product/Input/PriceInput';
import { LocationInput } from '@/components/Product/Input/LocationInput';
import { HeaderWithoutSearch } from '@/components/common/Header';
import { CategoryDropdowns } from '@/components/Product/ProductCategory';
import { ProductContent } from '@/components/Product/ProductContent';
import { ProductInput } from '@/components/Product/Input/ProductInput';
import usePostProduct from '@/hooks/mutations/usePostProduct';

const ProductCreatePage = () => {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [bname, setBname] = useState('');
  const [bcategoryId, setBCategoryId] = useState<number>(1);
  const [mcategoryId, setMCategoryId] = useState<number>(2);
  const [scategoryId, setSCategoryId] = useState<number>(3);
  const [images, setImages] = useState<File[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);

  const { mutate: createProduct, isPending: isUpdating } = usePostProduct();

  const handleImageUpload = (newImages: string[]) => {
    const files = newImages.map((imageUrl) => new File([], imageUrl));
    setImages(files);
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'sido') setSido(value);
    if (name === 'sigungu') setSigungu(value);
    if (name === 'bname') setBname(value);
  };

  const handleSubmit = () => {
    if (!mainImage) {
      console.log("대표 이미지")
      return;
    }
    
    createProduct({
      tag,
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
      images,
      mainImage,
    });
  };

  if (isUpdating) {
    return "로딩중";
  }

  return (
    <div className="min-h-screen flex w-screen">
      <HeaderWithoutSearch />
      <div className="flex w-full flex-col px-[240px] py-[60px]">
        <div className="flex w-full border-b px-[1rem] pb-[2rem] pt-[4rem] text-xxlarge32 font-semibold">
          상품 등록하기
        </div>
        <div className="flex w-full flex-col gap-[2rem] px-[0.5rem] py-[2rem]">
          <ProductInput title="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
          <ProductInput title="상품명" value={name} onChange={(e) => setName(e.target.value)} />
          <TagInput onTagsChange={setTag} />
          <ImageUploader maxImages={10} onImagesChange={handleImageUpload} onMainImageChange={setMainImage} />
          <PriceInput value={price} onChangePrice={(e) => setPrice(e.target.value)} />
          <CategoryDropdowns 
            setBCategoryId={setBCategoryId}
            setMCategoryId={setMCategoryId}
            setSCategoryId={setSCategoryId}
          />
          <ProductContent value={description} onChange={(e) => setDescription(e.target.value)} />
          <LocationInput
              title="위치"
              sido={sido}
              sigungu={sigungu}
              bname={bname}
              onChange={handleLocationChange}
            />
          <button onClick={handleSubmit} className="mx-[1rem] mb-[5rem] mt-6 bg-secondary-100 px-4 py-3 rounded-[6px] text-white">
            상품 등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCreatePage;
