import { useQuery } from '@tanstack/react-query';
import { GET } from 'src/api/EstateAndProducts/route';
import type { EstateAndProductsData } from './types';

export const ESTATE_AND_PRODUCTS_QUERY_KEY = 'estate-and-products';

async function fetchEstateAndProducts(): Promise<EstateAndProductsData> {
  const response = await GET();
  if (response.status !== 200) {
    console.error('Error fetching estate and products:', response.statusText);
    // handle error logic for the frontend here
    throw new Error(`Failed to fetch estate and products: ${response.status}`);
  }
  return (await response.json()) as EstateAndProductsData;
}

export function useEstateAndProducts() {
  return useQuery({
    queryKey: [ESTATE_AND_PRODUCTS_QUERY_KEY],
    queryFn: fetchEstateAndProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
}
