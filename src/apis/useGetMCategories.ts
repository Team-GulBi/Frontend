import client from "./client";
import { CategoriesResponse } from "./useGetBCategories";

const useGetMCategories = async (bcategory: string): Promise<CategoriesResponse> => {
  const response = await client.get<CategoriesResponse>(`/category/mcategory/${bcategory}`);
  return response.data;
};

export default useGetMCategories;