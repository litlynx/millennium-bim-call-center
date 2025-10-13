import {
  AccessesScriptsResponseDTO,
  type AccessesScriptsResponseType,
  AccessesTableResponseDTO,
  type AccessesTableResponseType
} from 'src/api/Accesses/validator';
import { mockPrimaryRows } from '../../DigitalChannels/__mocks__/mockPrimaryRows';
import { getValidationErrorResponse } from '../errors';

const mockScripts = {
  data: 'script'
};

export async function GetAccessesTable(): Promise<Response> {
  try {
    // Simulate API delay (1-2 seconds)
    await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000));
    // Extract the correct data structure from the nested mock data
    const response: AccessesTableResponseType = mockPrimaryRows;

    const validationErrorResponse = getValidationErrorResponse(response, AccessesTableResponseDTO);

    if (validationErrorResponse) {
      return validationErrorResponse;
    }

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: err instanceof Error ? err.message : 'Unknown error occurred'
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

export async function GetAccessesScripts(): Promise<Response> {
  try {
    // Simulate API delay (1-2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Extract the correct data structure from the nested mock data
    const response: AccessesScriptsResponseType = mockScripts;

    const validationErrorResponse = getValidationErrorResponse(
      response,
      AccessesScriptsResponseDTO
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
