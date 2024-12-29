import client from "./client";

export interface Category {
  name: string;
  id: number;
}
  
export interface CategoriesResponse {
  status: string;
  code: string;
  message: string;
  data: Category[];
}

const useGetBCategories = async (): Promise<CategoriesResponse> => {
  const response = await client.get<CategoriesResponse>("/category/bcategory");
  return response.data;
};

export default useGetBCategories;