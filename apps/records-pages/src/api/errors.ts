import type { z } from 'zod';

export function getValidationErrorResponse<DTOType>(
  dto: DTOType,
  validator: z.ZodObject<z.ZodRawShape, 'strip', z.ZodTypeAny, DTOType, DTOType>
): Response | undefined {
  const validationResult = validator.safeParse(dto);

  if (!validationResult.success) {
    return new Response(
      JSON.stringify({
        error: 'Validation failed',
        issues: validationResult.error.issues
      }),
      {
        status: 400,
        statusText: 'Bad Request',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  return undefined;
}
