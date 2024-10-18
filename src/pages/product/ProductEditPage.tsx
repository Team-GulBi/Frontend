import { HeaderWithoutSearch } from '../../components/Header';
import { DayInput, PriceInput, ProductInput } from './components/input';
import { ProductTextarea } from './components/textarea';
import { ImageUploader } from './components/ImageUploader';
import { useState } from 'react';
import { CategoryDropdowns } from './components/Dropdown';

export const ProductEditPage = () => {
  const [title, setTitle] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [images, setImages] = useState<string[]>([]);

  // 상품 조회 api

  const handleImagesUpload = (newImages: string[]) => {
    setImages(newImages);
  };

  const handleSubmit = async () => {
    const formData = {
      title,
      productName,
      description,
      price,
      day,
      location,
      startDate: startDate ? startDate.toISOString().split('T')[0] : '',
      endDate: endDate ? endDate.toISOString().split('T')[0] : '',
      images,
    };

    // 상품 수정 api
  };

  return (
    <div className="flex h-screen w-screen">
      <HeaderWithoutSearch />
      <div className="flex w-full flex-col px-[20rem] py-[5.5rem]">
        <div className="flex w-full border-b border-neutral-80 px-[1rem] pb-[2rem] pt-[4rem] text-xxlarge32 font-semibold text-neutral-0">
          상품 수정하기
        </div>
        <div className="flex w-full flex-col gap-[2rem] px-[0.5rem] py-[2rem]">
          <ProductInput
            title="제목"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
          <ImageUploader maxImages={10} onImagesChange={handleImagesUpload} />
          <ProductInput
            title="상품명"
            value={productName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProductName(e.target.value)
            }
          />
          <CategoryDropdowns />
          <ProductTextarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
          />

          <PriceInput
            value={price}
            onChangePrice={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPrice(e.target.value)
            }
            selectedDay={day}
            onDayChange={(selectedDay: string) => setDay(selectedDay)}
          />
          <ProductInput
            title="위치"
            value={location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLocation(e.target.value)
            }
          />
          <DayInput
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(date: Date | null) => setStartDate(date)}
            onEndDateChange={(date: Date | null) => setEndDate(date)}
          />

          <button
            onClick={handleSubmit}
            className="mx-[1rem] mt-6 mb-[5rem] rounded-xs bg-primary-dark px-4 py-3 text-medium18 text-white"
          >
            상품 수정
          </button>
        </div>
      </div>
    </div>
  );
};