import { useState, ChangeEvent } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ReactComponent as Plus } from "@/assets/svgs/plus.svg";
import { ReactComponent as XIcon } from "@/assets/svgs/XIcon.svg";

interface CreateImageUploaderProps {
  maxImages?: number;
  onImagesChange: (images: File[], mainImage: File | null) => void;
}

export const CreateImageUploader = ({ maxImages = 10, onImagesChange }: CreateImageUploaderProps) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const newImageURLs = newFiles.map((file) => URL.createObjectURL(file));

    if (uploadedImages.length + newImageURLs.length > maxImages) return;

    const updatedImages = [...uploadedImages, ...newImageURLs];
    const updatedFiles = [...imageFiles, ...newFiles];

    setUploadedImages(updatedImages);
    setImageFiles(updatedFiles);

    if (!mainImage) {
      setMainImage(newFiles[0]);
      setMainImageIndex(updatedFiles.length - newFiles.length);
    }

    onImagesChange(updatedFiles, newFiles[0] || mainImage);
  };

  const handleMainImageSelect = (index: number) => {
    if (mainImageIndex === index) return;

    setMainImage(imageFiles[index]);
    setMainImageIndex(index);
    onImagesChange(imageFiles, imageFiles[index]);
  };

  const handleDeleteImage = (index: number) => {
    if (uploadedImages.length <= 1) return;
  
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newFiles = imageFiles.filter((_, i) => i !== index);
  
    let newMainImageIndex: number | null = mainImageIndex;
  
    if (newMainImageIndex === index) {
      newMainImageIndex = newFiles.length > 0 ? 0 : null;
    } else if (newMainImageIndex !== null && newMainImageIndex > index) {
      newMainImageIndex = newMainImageIndex - 1;
    }
  
    setUploadedImages(newImages);
    setImageFiles(newFiles);
    setMainImage(newMainImageIndex !== null && newFiles.length > 0 ? newFiles[newMainImageIndex] : null);
    setMainImageIndex(newMainImageIndex);
  
    onImagesChange(newFiles, newMainImageIndex !== null && newFiles.length > 0 ? newFiles[newMainImageIndex] : null);
  };
  
  return (
    <div className="flex flex-col gap-4 px-[1rem] w-full">
      <span className="text-medium18 text-neutral-0">상품 사진</span>

      <Swiper spaceBetween={16} slidesPerView={"auto"} className="w-full">
        {uploadedImages.map((image, index) => (
          <SwiperSlide key={index} style={{ width: "192px" }}>
            <div
              className={`relative flex h-[192px] w-[192px] items-center justify-center overflow-hidden rounded-md border-2 ${
                mainImageIndex === index ? "border-secondary-100" : "border-neutral-80"
              } bg-neutral-100 cursor-pointer`}
              onClick={() => handleMainImageSelect(index)}
            >
              <img src={image} alt={`image ${index}`} className="h-full w-full object-cover" />
              {mainImageIndex === index && (
                <div className="w-full absolute top-0 left-0 right-0 bg-secondary-100 text-white text-center text-xsmall14 py-[6px]">
                  대표 이미지
                </div>
              )}
              <button
                className="shadow-lg absolute bg-white rounded-full top-[4px] right-[4px] flex items-center justify-center z-30"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage(index);
                }}
              >
                <XIcon />
              </button>
            </div>
          </SwiperSlide>
        ))}

        {uploadedImages.length < maxImages && (
          <SwiperSlide style={{ width: "192px" }}>
            <label className="flex h-[192px] w-[192px] cursor-pointer flex-col items-center justify-center gap-[8px] rounded-md border border-neutral-80 bg-neutral-100">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Plus />
              <span className="font-regular text-small16 text-neutral-40">
                {uploadedImages.length}/{maxImages}
              </span>
            </label>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};