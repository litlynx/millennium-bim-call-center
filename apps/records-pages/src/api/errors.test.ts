import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { getValidationErrorResponse } from './errors';

describe('Error Handling Utilities', () => {
  describe('getValidationErrorResponse', () => {
    it('should return undefined for valid data', () => {
      // Arrange
      const TestSchema = z.object({
        name: z.string(),
        age: z.number()
      });

      const validData = {
        name: 'John Doe',
        age: 25
      };

      // Act
      const result = getValidationErrorResponse(validData, TestSchema);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return validation error response for invalid data', async () => {
      // Arrange
      const TestSchema = z.object({
        name: z.string(),
        age: z.number()
      });

      // Test with wrong types - name should be string, age should be number
      const invalidData = {
        name: 123,
        age: 'not-a-number'
      } as unknown;

      // Act - Use unknown type casting to avoid strict typing issues
      const result = getValidationErrorResponse(
        invalidData,
        TestSchema as unknown as typeof TestSchema
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Response);

      if (result) {
        expect(result.status).toBe(400);
        expect(result.statusText).toBe('Bad Request');
        expect(result.headers.get('Content-Type')).toBe('application/json');

        const responseData = await result.json();
        expect(responseData.error).toBe('Validation failed');
        expect(responseData.issues).toBeDefined();
        expect(Array.isArray(responseData.issues)).toBe(true);
        expect(responseData.issues.length).toBeGreaterThan(0);
      }
    });

    it('should handle missing required fields', async () => {
      // Arrange
      const TestSchema = z.object({
        requiredField: z.string()
      });

      const invalidData = {} as unknown; // Missing required field

      // Act
      const result = getValidationErrorResponse(
        invalidData,
        TestSchema as unknown as typeof TestSchema
      );

      // Assert
      expect(result).toBeDefined();

      if (result) {
        const responseData = await result.json();
        expect(responseData.error).toBe('Validation failed');
        expect(responseData.issues).toBeDefined();
        expect(Array.isArray(responseData.issues)).toBe(true);
        expect(responseData.issues.length).toBeGreaterThan(0);
      }
    });

    it('should return proper Response object structure', async () => {
      // Arrange
      const TestSchema = z.object({
        test: z.string()
      });

      const invalidData = {
        test: 123
      } as unknown;

      // Act
      const result = getValidationErrorResponse(
        invalidData,
        TestSchema as unknown as typeof TestSchema
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Response);

      if (result) {
        // Check Response properties
        expect(result.status).toBe(400);
        expect(result.statusText).toBe('Bad Request');
        expect(result.ok).toBe(false);
        expect(result.headers.get('Content-Type')).toBe('application/json');

        // Check that the response body can be parsed
        const clonedResponse = result.clone();
        const responseData = await clonedResponse.json();
        expect(responseData).toHaveProperty('error');
        expect(responseData).toHaveProperty('issues');
        expect(responseData.error).toBe('Validation failed');
      }
    });
  });
});
