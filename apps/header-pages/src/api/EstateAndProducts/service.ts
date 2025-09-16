const mockData = require('../../Vision360/components/EstateAndProducts/mock-data/mock-data.json');

import type { EstateAndProductsData } from '../../Vision360/components/EstateAndProducts/types';
import { getValidationErrorResponse } from '../errors';
import { EstateAndProductsDTO } from './validator';

export async function GetEstateAndProducts(): Promise<Response> {
  try {
    // Simulate API delay (1-2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Extract the correct data structure from the nested mock data
    const data: EstateAndProductsData = mockData.estateAndProducts;

    const validationErrorResponse = getValidationErrorResponse(data, EstateAndProductsDTO);

    if (validationErrorResponse) {
      return validationErrorResponse;
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
