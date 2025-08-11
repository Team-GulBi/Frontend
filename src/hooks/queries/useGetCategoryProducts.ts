import { client } from "@/apis"
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ProductListResponse } from "./useGetProductSearch";

const getCategoryProducts = async(
    bCategoryId: number,
    mCategoryId: number,
    sCategoryId: number,
    lastCreatedAt: string,
    size: number = 10,
): Promise<ProductListResponse> => {
    const response = await client.get<ProductListResponse>("/recommand/category", {
        params: { bCategoryId, mCategoryId, sCategoryId, lastCreatedAt, size },
    });
    return response.data;
}

const useGetCategoryProducts = (
    bCategoryId: number,
    mCategoryId: number,
    sCategoryId: number,
    lastCreatedAt: string,
): UseQueryResult<ProductListResponse, AxiosError> => {
    return useQuery<ProductListResponse, AxiosError>({
        queryKey: ['product', bCategoryId, mCategoryId, sCategoryId, lastCreatedAt],
        queryFn: () => (getCategoryProducts(bCategoryId, mCategoryId, sCategoryId, lastCreatedAt)),
        enabled: !!bCategoryId && !!mCategoryId && !!sCategoryId,
    });
};

export default useGetCategoryProducts;