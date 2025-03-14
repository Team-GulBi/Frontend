import { client } from "@/apis"
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ProductSearchResponse {
    status: string;
    code: string;
    message: string;
    data: ProductSearchResult[];
}

interface ProductSearchResult {
    title: string;
    id: number;
    price: string;
    mainImage: string;
}

const getProductSearch =  async (query: string, detail: string): Promise<ProductSearchResponse> => {
    const response = await client.get<ProductSearchResponse>("/products/search", {
        params: { query, detail },
    });
    return response.data;
};

const useGetProductSearch = (query: string, detail: string):UseQueryResult<ProductSearchResponse, AxiosError> => {
    return useQuery<ProductSearchResponse, AxiosError>({
        queryKey: ['productSearch', query, detail],
        queryFn: () => (getProductSearch(query, detail)),
        enabled: !!query && !!detail,
    });
};

export default useGetProductSearch;