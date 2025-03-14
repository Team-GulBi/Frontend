import { ChangeEvent, useEffect, useState } from 'react';
import { TagInput } from '@/components/Product/Input/TagInput';
import { PriceInput } from '@/components/Product/Input/PriceInput';
import { LocationInput } from '@/components/Product/Input/LocationInput';
import { HeaderWithoutSearch } from '@/components/common/Header';
import { CategoryDropdowns } from '@/components/Product/ProductCategory';
import { ProductContent } from '@/components/Product/ProductContent';
import { ProductInput } from '@/components/Product/Input/ProductInput';
import { useNavigate, useParams } from 'react-router-dom';
import useGetProductDetail from '@/hooks/queries/useGetProductDetail';
import usePatchProductDetail, { ProductDetailRequest } from '@/hooks/mutations/usePatchProductDetail';
import { EditImageUploader } from '@/components/Product/ImageUploader/Edit';
import { ProductLoader } from '@/components/common/ProductLoader';

const ProductEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetProductDetail(Number(id));
  const { mutate: updateProduct, isPending } = usePatchProductDetail(); // ✅ isPending 사용
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [sido, setSido] = useState<string>('');
  const [sigungu, setSigungu] = useState<string>('');
  const [bname, setBname] = useState<string>('');
  const [bcategoryId, setBCategoryId] = useState<number>(1);
  const [mcategoryId, setMCategoryId] = useState<number>(1);
  const [scategoryId, setSCategoryId] = useState<number>(1);

  const [productImages, setProductImages] = useState<{ id: number; url: string; main: boolean }[]>([]);
  const [addingImages, setAddingImages] = useState<File[]>([]);
  const [toBeUpdatedMainImageFile, setToBeUpdatedMainImageFile] = useState<File | null>(null);
  const [toBeUpdatedMainImageUrl, setToBeUpdatedMainImageUrl] = useState<string | null>(null);
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

      if (data.data.images?.productImages) {
        setProductImages(data.data.images.productImages);
      }
    }
  }, [data]);

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'sido') setSido(value);
    if (name === 'sigungu') setSigungu(value);
    if (name === 'bname') setBname(value);
  };

  const handleImageChange = (
    newAddingImages: File[],
    newToBeUpdatedMainImageFile: File | null,
    newToBeUpdatedMainImageUrl: string | null,
    newDeletedImageIds: number[]
  ) => {
    setAddingImages(newAddingImages);
    setToBeUpdatedMainImageFile(newToBeUpdatedMainImageFile);
    setToBeUpdatedMainImageUrl(newToBeUpdatedMainImageUrl);
    setDeletedImageIds(newDeletedImageIds);
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
    if (bcategoryId !== data?.data?.bcategory.id) category.bCategoryId = bcategoryId.toString();
    if (mcategoryId !== data?.data?.mcategory.id) category.mCategoryId = mcategoryId.toString();
    if (scategoryId !== data?.data?.scategory.id) category.sCategoryId = scategoryId.toString();

    if (Object.keys(category).length > 0) {
      updatedData.category = category;
    }
  
    if (addingImages.length > 0) {
      updatedData.addingImages = addingImages;
    }
    if (toBeUpdatedMainImageFile) {
      updatedData.toBeUpdatedMainImageFile = toBeUpdatedMainImageFile;
    }
    if (toBeUpdatedMainImageUrl) {
      updatedData.toBeUpdatedMainimageUrl = { mainImageUrl: toBeUpdatedMainImageUrl };
    }
    if (deletedImageIds.length > 0) {
      updatedData.deletedImageId = { imagesId: deletedImageIds };
    }

    if (updatedData.productInfo || updatedData.category || updatedData.addingImages || updatedData.toBeUpdatedMainImageFile || updatedData.toBeUpdatedMainimageUrl || updatedData.deletedImageId) {
      console.log(updatedData);
      updateProduct(updatedData, {
        onSuccess: () => {
          window.scrollTo(0, 0);
          navigate(`/product/${id}`);
        },
    });
    }
  };

  return (
    <>
    {(isPending || isLoading) && <ProductLoader />}

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
          <EditImageUploader productImages={productImages} onImageChange={handleImageChange} />
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
          <button disabled={isPending} onClick={handleSubmit} className="mx-[1rem] mb-[5rem] mt-6 bg-secondary-100 px-4 py-3 rounded-[6px] text-white">
            상품 수정
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductEditPage;