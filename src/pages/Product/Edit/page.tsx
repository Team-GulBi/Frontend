import { ImageUploader } from '@/components/Product/ImageUploader';
import { ChangeEvent, useEffect, useState } from 'react';
import { TagInput } from '@/components/Product/Input/TagInput';
import { PriceInput } from '@/components/Product/Input/PriceInput';
import { LocationInput } from '@/components/Product/Input/LocationInput';
import { HeaderWithoutSearch } from '@/components/common/Header';
import { CategoryDropdowns } from '@/components/Product/ProductCategory';
import { ProductContent } from '@/components/Product/ProductContent';
import { ProductInput } from '@/components/Product/Input/ProductInput';
import { useParams } from 'react-router-dom';
import useGetProductDetail from '@/hooks/queries/useGetProductDetail';
import usePatchProductDetail, { ProductDetailRequest } from '@/hooks/mutations/usePatchProductDetail';

const ProductEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetProductDetail(Number(id));
  const { mutate: updateProduct, isPending: isUpdating } = usePatchProductDetail();

  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [bname, setBname] = useState('');
  const [bcategoryId, setBCategoryId] = useState<number>(1);
  const [mcategoryId, setMCategoryId] = useState<number>(1);
  const [scategoryId, setSCategoryId] = useState<number>(1);

  const [images, setImages] = useState<File[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [initialMainImage, setInitialMainImage] = useState<string | null>(null);
  const [initialImages, setInitialImages] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  useEffect(() => {
    if (data?.data) {
      setTitle(data.data.title);
      setName(data.data.productName);
      setTag(data.data.tag);
      setDescription(data.data.description);
      setPrice(data.data.price.toString());
      setSido(data.data.sido);
      setSigungu(data.data.sigungu);
      setBname(data.data.bname);
      setBCategoryId(data.data.bcategory.id);
      setMCategoryId(data.data.mcategory.id);
      setSCategoryId(data.data.scategory.id);

      if (data.data.images.length > 0) {
        setInitialMainImage(data.data.images[0]);
        setInitialImages(data.data.images.slice(1));
      }
    }
  }, [data]);

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'sido') setSido(value);
    if (name === 'sigungu') setSigungu(value);
    if (name === 'bname') setBname(value);
  };

  const handleImageUpdate = (updatedImages: File[], updatedMainImage: File | null) => {
    setImages(updatedImages);
    setMainImage(updatedMainImage);
  };

  const handleDeleteImage = (imageId: number, isMainImage: boolean) => {
    setDeletedImageIds((prev) => [...prev, imageId]);
  
    if (isMainImage) {
      setMainImage(null);
    } else {
      setImages((prevImages) => prevImages.filter((_, index) => index !== imageId));
    }
  };  

  const handleSubmit = () => {
    const updatedData: ProductDetailRequest = {
      productId: Number(id),
    };
  
    const productInfo: ProductDetailRequest["productInfo"] = {};
    if (title !== data?.data?.title) productInfo.title = title;
    if (name !== data?.data?.productName) productInfo.name = name;
    if (tag !== data?.data?.tag) productInfo.tag = tag;
    if (description !== data?.data?.description) productInfo.description = description;
    if (Number(price) !== Number(data?.data?.price)) productInfo.price = Number(price);
    if (sido !== data?.data?.sido) productInfo.sido = sido;
    if (sigungu !== data?.data?.sigungu) productInfo.sigungu = sigungu;
    if (bname !== data?.data?.bname) productInfo.bname = bname;
  
    if (Object.keys(productInfo).length > 0) {
      updatedData.productInfo = productInfo;
    }
  
    const category: ProductDetailRequest["category"] = {};
    if (bcategoryId !== data?.data?.bcategory.id) category.bcategoryId = bcategoryId;
    if (mcategoryId !== data?.data?.mcategory.id) category.mcategoryId = mcategoryId;
    if (scategoryId !== data?.data?.scategory.id) category.scategoryId = scategoryId;
  
    if (Object.keys(category).length > 0) {
      updatedData.category = category;
    }
  
    if (images.filter(Boolean).length > 0) {
      updatedData.addingImages = images.filter(Boolean);
    }
  
    if (deletedImageIds.length > 0) {
      updatedData.deletedImageId = { imagesId: deletedImageIds };
    }
  
    if (mainImage instanceof File) {
      updatedData.toBeUpdatedMainImageFile = mainImage;
    } else if (initialMainImage && typeof initialMainImage === "string") {
      updatedData.toBeUpdatedMainImageUrl = { mainImageUrl: { imageUrl: initialMainImage } };
    }

    if (
      updatedData.productInfo ||
      updatedData.category ||
      updatedData.addingImages ||
      updatedData.deletedImageId ||
      updatedData.toBeUpdatedMainImageFile ||
      updatedData.toBeUpdatedMainImageUrl
    ) {
      console.log(updatedData);
      updateProduct(updatedData);
    }
  };

  if (isLoading || isUpdating) return <div>로딩 중...</div>;

  return (
    <div className="min-h-screen flex w-screen">
      <HeaderWithoutSearch />
      <div className="flex w-full flex-col px-[240px] py-[60px]">
        <div className="flex w-full border-b px-[1rem] pb-[2rem] pt-[4rem] text-xxlarge32 font-semibold">
          상품 수정하기
        </div>
        <div className="flex w-full flex-col gap-[2rem] px-[0.5rem] py-[2rem]">
          <ProductInput title="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
          <ProductInput title="상품명" value={name} onChange={(e) => setName(e.target.value)} />
          <TagInput onTagsChange={setTag} initialTags={tag} />
          <ImageUploader
            maxImages={10}
            onImagesChange={handleImageUpdate}
            onDeleteImage={handleDeleteImage}
            initialImages={initialImages}
            initialMainImage={initialMainImage}
          />
          <PriceInput value={price} onChangePrice={(e) => setPrice(e.target.value)} />
          <CategoryDropdowns
            setBCategoryId={setBCategoryId}
            setMCategoryId={setMCategoryId}
            setSCategoryId={setSCategoryId}
            initialBCategoryId={bcategoryId}
            initialMCategoryId={mcategoryId}
            initialSCategoryId={scategoryId}
          />
          <ProductContent value={description} onChange={(e) => setDescription(e.target.value)} />
          <LocationInput title="위치" sido={sido} sigungu={sigungu} bname={bname} onChange={handleLocationChange} />
          <button onClick={handleSubmit} className="mx-[1rem] mb-[5rem] mt-6 bg-secondary-100 px-4 py-3 rounded-[6px] text-white">
            상품 수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;