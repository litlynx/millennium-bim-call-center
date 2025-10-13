import { mockCredelec } from 'src/DigitalChannels/__mocks__/mockCredelec';
import { mockRefills } from 'src/DigitalChannels/__mocks__/mockRefills';
import { mockTvPackets } from 'src/DigitalChannels/__mocks__/mockTvPackets';
import { getValidationErrorResponse } from '../errors';
import {
  RefillsScriptsResponseDTO,
  type RefillsScriptsResponseType,
  TableCredelecResponseDTO,
  type TableCredelecResponseType,
  TableRefillsResponseDTO,
  type TableRefillsResponseType,
  TableTvPacketsResponseDTO,
  type TableTvPacketsResponseType
} from './validator';

const mockScripts = {
  data: 'script',
  status: 200
};

export async function GetCredelecTable(): Promise<Response> {
  try {
    await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000));
    const response: TableCredelecResponseType = mockCredelec;
    const valitationErrorResponse = getValidationErrorResponse(response, TableCredelecResponseDTO);

    if (valitationErrorResponse) {
      return valitationErrorResponse;
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

export async function GetRefillsTable(): Promise<Response> {
  try {
    await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000));
    const response: TableRefillsResponseType = mockRefills;
    const valitationErrorResponse = getValidationErrorResponse(response, TableRefillsResponseDTO);

    if (valitationErrorResponse) {
      return valitationErrorResponse;
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

export async function GetTvPacketsTable(): Promise<Response> {
  try {
    await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000));
    const response: TableTvPacketsResponseType = mockTvPackets;
    const valitationErrorResponse = getValidationErrorResponse(response, TableTvPacketsResponseDTO);

    if (valitationErrorResponse) {
      return valitationErrorResponse;
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

export async function GetRefillsScripts(): Promise<Response> {
  try {
    await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000));
    const response: RefillsScriptsResponseType = mockScripts;
    const valitationErrorResponse = getValidationErrorResponse(response, RefillsScriptsResponseDTO);

    if (valitationErrorResponse) {
      return valitationErrorResponse;
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
