import { useState, ChangeEvent } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ReactComponent as Plus } from '@/assets/svgs/plus.svg';

interface ImageUploaderProps {
  maxImages?: number;
  onImagesChange: (newImages: string[]) => void;
  onMainImageChange?: (file: File | null) => void;
}

export const ImageUploader = ({
  maxImages = 10,
  onImagesChange,
  onMainImageChange,
}: ImageUploaderProps) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      
      if (uploadedImages.length + newImages.length <= maxImages) {
        const updatedImages = [...uploadedImages, ...newImages];
        setUploadedImages(updatedImages);
        onImagesChange(updatedImages);
  
        if (onMainImageChange) {
          onMainImageChange(files[0]);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 px-[1rem] w-full">
      <span className="text-medium18 text-neutral-0">상품 사진</span>
      <Swiper
        spaceBetween={16}
        slidesPerView={'auto'}
        className="w-full"
      >
        {uploadedImages.map((image, index) => (
          <SwiperSlide key={index} style={{ width: '12rem' }}>
            <div className="flex h-[12rem] w-[12rem] items-center justify-center overflow-hidden rounded-sm border border-neutral-80 bg-neutral-100">
              <img
                src={image}
                alt={`image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
        
        {uploadedImages.length < maxImages && (
          <SwiperSlide style={{ width: '12rem' }}>
            <label className="flex h-[12rem] w-[12rem] cursor-pointer flex-col items-center justify-center gap-[1rem] rounded-sm border border-neutral-80 bg-neutral-100">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
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