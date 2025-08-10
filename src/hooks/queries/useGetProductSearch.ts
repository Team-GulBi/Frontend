import { client } from "@/apis"
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface ProductListResponse {
    status: string;
    code: string;
    message: string;
    data: ProductListResult[];
}

export interface ProductListResult {
    title: string;
    id: number;
    price: string;
    mainImage: string;
}

const getProductSearch =  async (query: string, detail: string): Promise<ProductListResponse> => {
    const response = await client.get<ProductListResponse>("/products/search", {
        params: { query, detail },
    });
    return response.data;
};

const useGetProductSearch = (query: string, detail: string):UseQueryResult<ProductListResponse, AxiosError> => {
    return useQuery<ProductListResponse, AxiosError>({
        queryKey: ['product', query, detail],
        queryFn: () => (getProductSearch(query, detail)),
        enabled: !!query && !!detail,
    });
};

export default useGetProductSearch;