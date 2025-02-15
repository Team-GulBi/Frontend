import { useState, ChangeEvent, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ReactComponent as Plus } from '@/assets/svgs/plus.svg';
import { ReactComponent as XIcon } from '@/assets/svgs/XIcon.svg';

interface ImageUploaderProps {
  maxImages?: number;
  onImagesChange: (images: File[], mainImage: File | null) => void;
  onDeleteImage?: (imageId: number, isMainImage: boolean) => void;
  initialImages?: string[];
  initialMainImage?: string | null;
}

export const ImageUploader = ({
  maxImages = 10,
  onImagesChange,
  onDeleteImage,
  initialImages = [],
}: ImageUploaderProps) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(initialImages.length > 0 ? initialImages[0] : null);

  useEffect(() => {
    if (initialImages.length > 0) {
      setUploadedImages(initialImages);
      setMainImage(initialImages[0]);
    }
  }, [initialImages]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const newImages = newFiles.map((file) => URL.createObjectURL(file));
  
      if (uploadedImages.length + newImages.length <= maxImages) {
        const updatedImages = [...uploadedImages, ...newImages];
        const updatedFiles = [...imageFiles, ...newFiles];
  
        setUploadedImages(updatedImages);
        setImageFiles(updatedFiles);
        setMainImage(updatedImages[0]);
        onImagesChange(updatedFiles, updatedFiles[0] || null);
      }
    }
  };
  const handleMainImageSelect = (index: number) => {
    if (index === 0) return;

    const newImages = [...uploadedImages];
    const newFiles = [...imageFiles];

    [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
    [newFiles[0], newFiles[index]] = [newFiles[index], newFiles[0]];

    setUploadedImages(newImages);
    setImageFiles(newFiles);
    
    setMainImage(newImages[0]);
    onImagesChange(newFiles, newFiles[0] || null);
  };

  const handleDeleteImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newFiles = imageFiles.filter((_, i) => i !== index);

    setUploadedImages(newImages);
    setImageFiles(newFiles);
    
    if (index === 0) {
      setMainImage(newImages.length > 0 ? newImages[0] : null);
    }
    
    onImagesChange(newFiles, newFiles[0] || null);

    if (onDeleteImage) {
      onDeleteImage(index, index === 0);
    }
  };

  return (
    <div className="flex flex-col gap-4 px-[1rem] w-full">
      <span className="text-medium18 text-neutral-0">상품 사진</span>

      <div className="flex gap-[16px]">
        {uploadedImages.length > 0 && (
          <div className="relative !w-[192px] !h-[192px] flex-shrink-0">
          <div
            className="relative flex h-[192px] w-[192px] items-center justify-center overflow-hidden rounded-md border-2 border-secondary-100 bg-neutral-100 cursor-pointer"
            onClick={() => handleMainImageSelect(0)}
          >
            <img src={uploadedImages[0]} alt="대표 이미지" className="h-full w-full object-cover" />
            <div className="w-full absolute top-0 left-0 right-0 bg-secondary-100 text-white text-center text-xsmall14 py-[6px]">
              대표 이미지
            </div>
            <button
              className="shadow-lg absolute bg-white rounded-full top-[4px] right-[4px] flex items-center justify-center z-30"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage(0);
              }}
            >
              <XIcon />
            </button>
          </div>
        </div>      
        )}

        <Swiper spaceBetween={16} slidesPerView={'auto'} className="w-full">
          {uploadedImages.slice(1).map((image, index) => (
            <SwiperSlide key={index + 1} style={{ width: '192px' }}>
              <div
                className="relative flex h-[192px] w-[192px] items-center justify-center overflow-hidden rounded-md border border-neutral-80 bg-neutral-100 cursor-pointer"
                onClick={() => handleMainImageSelect(index + 1)}
              >
                <img src={image} alt={`image ${index + 1}`} className="h-full w-full object-cover" />
                <button
                  className="shadow-lg absolute bg-white rounded-full top-[4px] right-[4px] flex items-center justify-center z-30"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(index + 1);
                  }}
                >
                  <XIcon />
                </button>
              </div>
            </SwiperSlide>
          ))}

          {uploadedImages.length < maxImages && (
            <SwiperSlide style={{ width: '192px' }}>
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
    </div>
  );
};