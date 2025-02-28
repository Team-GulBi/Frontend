import { ChangeEvent, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ReactComponent as Plus } from "@/assets/svgs/plus.svg";
import { ReactComponent as XIcon } from "@/assets/svgs/XIcon.svg";

interface EditImageUploaderProps {
  productImages: { id: number; url: string; main: boolean }[];
  maxImages?: number;
  onImageChange: (
    addingImages: File[],
    toBeUpdatedMainImageFile: File | null,
    toBeUpdatedMainImageUrl: string | null,
    deletedImageIds: number[]
  ) => void;
}

export const EditImageUploader = ({ productImages, maxImages = 10, onImageChange }: EditImageUploaderProps) => {
  const [uploadedImages, setUploadedImages] = useState(productImages);
  const [addingImages, setAddingImages] = useState<File[]>([]);
  const [toBeUpdatedMainImageFile, setToBeUpdatedMainImageFile] = useState<File | null>(null);
  const [toBeUpdatedMainImageUrl, setToBeUpdatedMainImageUrl] = useState<string | null>(null);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const allImages = [
    ...uploadedImages,
    ...addingImages.map((file) => ({ file, isNew: true })),
    ...(toBeUpdatedMainImageFile ? [{ file: toBeUpdatedMainImageFile, isNew: true, isMain: true }] : []),
  ];

  useEffect(() => {
    setUploadedImages(productImages);
  }, [productImages]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    if (uploadedImages.length + newFiles.length > maxImages) return;

    setAddingImages([...addingImages, ...newFiles]);
    onImageChange([...addingImages, ...newFiles], toBeUpdatedMainImageFile, toBeUpdatedMainImageUrl, deletedImageIds);
  };

  const handleMainImageSelect = (index: number, isExistingImage: boolean) => {
    let newMainImageFile: File | null = null;
    let newMainImageUrl: string | null = null;
    let updatedAddingImages = [...addingImages];

    if (isExistingImage) {
      newMainImageUrl = uploadedImages[index].url;
      newMainImageFile = null;
    } else {
      newMainImageFile = addingImages[index - uploadedImages.length];
      newMainImageUrl = null;
  
      updatedAddingImages = addingImages.filter((_, i) => i !== index - uploadedImages.length);
    }
  
    setToBeUpdatedMainImageFile(newMainImageFile);
    setToBeUpdatedMainImageUrl(newMainImageUrl);
    setAddingImages(updatedAddingImages);
  
    setUploadedImages((prevImages) =>
      prevImages.map((img, i) => ({
        ...img,
        main: i === index,
      }))
    );
  
    onImageChange(updatedAddingImages, newMainImageFile, newMainImageUrl, deletedImageIds);
  };
  
  const handleDeleteImage = (index: number, isExistingImage: boolean) => {
    let updatedUploadedImages = [...uploadedImages];
    let updatedAddingImages = [...addingImages];
    let newDeletedImageIds = [...deletedImageIds];

    if (isExistingImage) {
      const imageId = uploadedImages[index].id;
      newDeletedImageIds.push(imageId);
      updatedUploadedImages = uploadedImages.filter((_, i) => i !== index);
    } else {
      updatedAddingImages = addingImages.filter((_, i) => i !== index - uploadedImages.length);
    }

    let newMainImageFile = toBeUpdatedMainImageFile;
    let newMainImageUrl = toBeUpdatedMainImageUrl;

    if (
      toBeUpdatedMainImageUrl === uploadedImages[index]?.url ||
      toBeUpdatedMainImageFile === addingImages[index - uploadedImages.length]
    ) {
      if (updatedUploadedImages.length > 0) {
        newMainImageUrl = updatedUploadedImages[0].url;
        newMainImageFile = null;
        updatedUploadedImages[0].main = true;
      } else if (updatedAddingImages.length > 0) {
        newMainImageUrl = null;
        newMainImageFile = updatedAddingImages[0];
      } else {
        newMainImageUrl = null;
        newMainImageFile = null;
      }
    }

    setUploadedImages(updatedUploadedImages);
    setAddingImages(updatedAddingImages);
    setDeletedImageIds(newDeletedImageIds);
    setToBeUpdatedMainImageFile(newMainImageFile);
    setToBeUpdatedMainImageUrl(newMainImageUrl);

    onImageChange(updatedAddingImages, newMainImageFile, newMainImageUrl, newDeletedImageIds);
  };

  return (
    <div className="flex flex-col gap-4 px-[1rem] w-full">
      <span className="text-medium18 text-neutral-0">상품 사진 수정</span>

      <Swiper spaceBetween={16} slidesPerView={"auto"} className="w-full">
        {allImages.map((image, index) => {
          const isExistingImage = "id" in image; 
          const imageUrl = isExistingImage ? image.url : URL.createObjectURL(image.file as File);
          const key = isExistingImage ? `existing-${image.id}` : `new-${index}`;
          const isMainImage =
            (isExistingImage && toBeUpdatedMainImageUrl === imageUrl) ||
            (!isExistingImage && toBeUpdatedMainImageFile === image.file) ||
            ("main" in image && image.main);

            return (
              <SwiperSlide key={key} style={{ width: "192px" }}>
                <div
                  className={`relative flex h-[192px] w-[192px] items-center justify-center overflow-hidden rounded-md border-2 ${
                    isMainImage ? "border-secondary-100" : "border-neutral-80"
                  } bg-neutral-100 cursor-pointer`}
                  onClick={() => handleMainImageSelect(index, isExistingImage)}
                >
                  <img src={imageUrl} alt={`image-${index}`} className="h-full w-full object-cover" />
                  {isMainImage && (
                    <div className="w-full absolute top-0 left-0 right-0 bg-secondary-100 text-white text-center text-xsmall14 py-[6px]">
                      대표 이미지
                    </div>
                  )}
                  <button
                    className="shadow-lg absolute bg-white rounded-full top-[4px] right-[4px] flex items-center justify-center z-30"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(index, isExistingImage);
                    }}
                  >  
                  <XIcon />
                </button>
              </div>
            </SwiperSlide>
          );
        })}

        {uploadedImages.length + addingImages.length < maxImages && (
          <SwiperSlide style={{ width: "192px" }}>
            <label className="flex h-[192px] w-[192px] cursor-pointer flex-col items-center justify-center gap-[8px] rounded-md border border-neutral-80 bg-neutral-100">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Plus />
              <span className="font-regular text-small16 text-neutral-40">
                {uploadedImages.length + addingImages.length}/{maxImages}
              </span>
            </label>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};