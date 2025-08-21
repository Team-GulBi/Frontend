import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { ReactComponent as Dropdown } from '@/assets/svgs/dropdown.svg';
import { ReactComponent as RightArray } from '@/assets/svgs/rightarray.svg';
import useGetBCategories, { Category } from '@/apis/useGetBCategories';
import useGetMCategories from '@/apis/useGetMCategories';

interface CategoryDropdownsProps {
  setBCategoryId: (id: number | undefined) => void;
  setMCategoryId: (id: number | undefined) => void;
  setSCategoryId: (id: number | undefined) => void;
  initialBCategoryId?: number;
  initialMCategoryId?: number;
  initialSCategoryId?: number;
}

export const CategoryDropdowns = ({
  setBCategoryId,
  setMCategoryId,
  setSCategoryId,
  initialBCategoryId,
  initialMCategoryId,
  initialSCategoryId,
}: CategoryDropdownsProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [minorCategories, setMinorCategories] = useState<Category[]>([]);

  const [selectedMainCategory, setSelectedMainCategory] =
    useState('대분류 선택');
  const [selectedSubCategory, setSelectedSubCategory] = useState('중분류 선택');
  const [selectedMinorCategory, setSelectedMinorCategory] =
    useState('소분류 선택');

  useEffect(() => {
    useGetBCategories()
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('대분류 조회 실패:', error));
  }, []);

  useEffect(() => {
    if (initialBCategoryId) {
      const selectedCategory = categories.find(
        (c) => c.id === initialBCategoryId,
      );
      if (selectedCategory) {
        setSelectedMainCategory(selectedCategory.name);
        setBCategoryId(initialBCategoryId);
        fetchSubCategories(initialBCategoryId);
      }
    }
  }, [categories, initialBCategoryId]);

  useEffect(() => {
    if (initialMCategoryId) {
      const selectedCategory = subCategories.find(
        (c) => c.id === initialMCategoryId,
      );
      if (selectedCategory) {
        setSelectedSubCategory(selectedCategory.name);
        setMCategoryId(initialMCategoryId);
        fetchMinorCategories(initialMCategoryId);
      }
    }
  }, [subCategories, initialMCategoryId]);

  useEffect(() => {
    if (initialSCategoryId) {
      const selectedCategory = minorCategories.find(
        (c) => c.id === initialSCategoryId,
      );
      if (selectedCategory) {
        setSelectedMinorCategory(selectedCategory.name);
        setSCategoryId(initialSCategoryId);
      }
    }
  }, [minorCategories, initialSCategoryId]);

  const fetchSubCategories = async (mainCategoryId: number) => {
    try {
      const response = await useGetMCategories(mainCategoryId.toString());
      setSubCategories(response.data);
    } catch (error) {
      console.error('중분류 조회 실패:', error);
    }
  };

  const fetchMinorCategories = async (subCategoryId: number) => {
    try {
      const response = await useGetMCategories(subCategoryId.toString());
      setMinorCategories(response.data);
    } catch (error) {
      console.error('소분류 조회 실패:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 px-[1rem]">
      <span className="text-medium18 text-neutral-0">상품 카테고리</span>
      <div className="flex flex-wrap items-center gap-2 md:gap-4 lg:gap-8">
        {/* 대분류 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="font-regular flex min-w-[180px] items-center justify-between border border-neutral-80 bg-neutral-100 px-8 py-6 text-medium20 text-neutral-40">
              <span>{selectedMainCategory}</span>
              <Dropdown className="self-center pt-[2px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-100 py-4 text-medium18 font-light text-neutral-30">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => {
                  setSelectedMainCategory(category.name);
                  setSelectedSubCategory('중분류 선택');
                  setSelectedMinorCategory('소분류 선택');
                  setBCategoryId(category.id);
                  fetchSubCategories(category.id);
                }}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <RightArray />

        {/* 중분류 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="font-regular flex min-w-[180px] items-center justify-between border border-neutral-80 bg-neutral-100 px-8 py-6 text-medium20 text-neutral-40">
              <span>{selectedSubCategory}</span>
              <Dropdown className="self-center pt-[2px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-100 py-4 text-medium18 font-light text-neutral-30">
            {subCategories.map((subCategory) => (
              <DropdownMenuItem
                key={subCategory.id}
                onClick={() => {
                  setSelectedSubCategory(subCategory.name);
                  setSelectedMinorCategory('소분류 선택');
                  setMCategoryId(subCategory.id);
                  fetchMinorCategories(subCategory.id);
                }}
              >
                {subCategory.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <RightArray />

        {/* 소분류 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="font-regular flex min-w-[180px] items-center justify-between border border-neutral-80 bg-neutral-100 px-8 py-6 text-medium20 text-neutral-40">
              <span>{selectedMinorCategory}</span>
              <Dropdown className="self-center pt-[2px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-100 py-4 text-medium18 font-light text-neutral-30">
            {minorCategories.map((minorCategory) => (
              <DropdownMenuItem
                key={minorCategory.id}
                onClick={() => {
                  setSelectedMinorCategory(minorCategory.name);
                  setSCategoryId(minorCategory.id);
                }}
              >
                {minorCategory.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
