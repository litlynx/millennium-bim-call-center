import { mockTransactionRows } from 'src/DigitalChannels/mocks/mockTransactionRows';
import { mockPrimaryRows } from '../../DigitalChannels/mocks/mockPrimaryRows';

import { getValidationErrorResponse } from '../errors';
import {
  CancelsBlockedScriptsResponseDTO,
  type CancelsBlockedScriptsResponseType,
  CancelsBlockedTableResponseDTO,
  type CancelsBlockedTableResponseType,
  CancelsBlockedTransactionHistoryResponseDTO,
  type CancelsBlockedTransactionHistoryResponseType
} from './validator';

const mockScripts = {
  data: 'script',
  status: 200
};

export async function GetCancelsBlockedTable(): Promise<Response> {
  try {
    // Simulate API delay (1-2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Extract the correct data structure from the nested mock data
    const response: CancelsBlockedTableResponseType = mockPrimaryRows;

    const validationErrorResponse = getValidationErrorResponse(
      response,
      CancelsBlockedTableResponseDTO
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

export async function GetCancelsBlockedTransactionHistory(): Promise<Response> {
  try {
    // Simulate API delay (1-2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Extract the correct data structure from the nested mock data
    const response: CancelsBlockedTransactionHistoryResponseType = mockTransactionRows;

    const validationErrorResponse = getValidationErrorResponse(
      response,
      CancelsBlockedTransactionHistoryResponseDTO
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

export async function GetCancelsBlockedScripts(): Promise<Response> {
  try {
    // Simulate API delay (1-2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Extract the correct data structure from the nested mock data
    const response: CancelsBlockedScriptsResponseType = mockScripts;

    const validationErrorResponse = getValidationErrorResponse(
      response,
      CancelsBlockedScriptsResponseDTO
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
