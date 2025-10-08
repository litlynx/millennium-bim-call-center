import { mockOperatorStateRows } from 'src/DigitalChannels/__mocks__/mockOperatorStateRows';
import { mockTransactionalLimitsRows } from 'src/DigitalChannels/__mocks__/mockTransactionalLimitsRows';
import { getValidationErrorResponse } from '../errors';
import {
  OperatorStateTableResponseDTO,
  type OperatorStateTableResponseDTOType,
  TrasactionalLimitsTableResponseDTO,
  type TrasactionalLimitsTableResponseDTOType
} from './validator';

export async function GetTransactionalLimitOperatorStateTable(): Promise<Response> {
  try {
    // Simulate API delay (1-2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Extract the correct data structure from the nested mock data
    const response: OperatorStateTableResponseDTOType = mockOperatorStateRows;

    const validationErrorResponse = getValidationErrorResponse(
      response,
      OperatorStateTableResponseDTO
    );

    if (validationErrorResponse) {
      return validationErrorResponse;
    }

    return new Response(JSON.stringify(response.data), {
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

export async function GetTransactionalLimitTable(): Promise<Response> {
  try {
    // Simulate API delay (1-2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Extract the correct data structure from the nested mock data
    const response: TrasactionalLimitsTableResponseDTOType = mockTransactionalLimitsRows;

    const validationErrorResponse = getValidationErrorResponse(
      response,
      TrasactionalLimitsTableResponseDTO
    );

    if (validationErrorResponse) {
      return validationErrorResponse;
    }

    return new Response(JSON.stringify(response.data), {
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
