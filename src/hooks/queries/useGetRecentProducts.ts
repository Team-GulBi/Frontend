import { client } from "@/apis"
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ProductListResponse } from "./useGetProductSearch";

const getRecentProducts = async(
    lastCreatedAt: string,
    size: number = 10,
): Promise<ProductListResponse> => {
    const response = await client.get<ProductListResponse>("/recommand/recent", {
        params: { lastCreatedAt, size },
    });
    return response.data;
}

const useGetRecentProducts = (
    lastCreatedAt: string,
): UseQueryResult<ProductListResponse, AxiosError> => {
    return useQuery<ProductListResponse, AxiosError>({
        queryKey: ['product', lastCreatedAt],
        queryFn: () => (getRecentProducts(lastCreatedAt)),
    });
};

export default useGetRecentProducts;