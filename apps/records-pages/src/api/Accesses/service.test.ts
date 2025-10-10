import { describe, expect, it, spyOn } from 'bun:test';
import * as errors from '../errors';
import { GetAccessesScripts, GetAccessesTable } from './service';

describe('Accesses API Service', () => {
  // Run success tests FIRST before any mocking
  describe('Success Cases', () => {
    it('GetAccessesTable should return successful response with valid data', async () => {
      // Act
      const response = await GetAccessesTable();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(Array.isArray(data)).toBe(true);

      if (data.length > 0) {
        expect(data[0]).toHaveProperty('operatorName');
        expect(data[0]).toHaveProperty('phoneNumber');
        expect(data[0]).toHaveProperty('type');
        expect(data[0]).toHaveProperty('stateSimSwap');
        expect(data[0]).toHaveProperty('badgeText');
      }
    });

    it('GetAccessesScripts should return successful response with script data', async () => {
      // Act - test the actual service without any mocking
      const response = await GetAccessesScripts();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(typeof data).toBe('string');
      expect(data).toBe('script');
    });
  });

  describe('GetAccessesTable', () => {
    it('should include correct response headers', async () => {
      // Act
      const response = await GetAccessesTable();

      // Assert
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should simulate API delay', async () => {
      // Arrange
      const startTime = Date.now();

      // Act
      await GetAccessesTable();
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Assert - Should take at least 1 second (simulated delay)
      expect(duration).toBeGreaterThanOrEqual(1000);
    });

    it('should handle validation errors', async () => {
      // Arrange
      const mockValidationError = new Response(
        JSON.stringify({
          error: 'Validation failed',
          issues: [{ path: ['operatorName'], message: 'Required' }]
        }),
        { status: 400, statusText: 'Bad Request' }
      );

      const validationSpy = spyOn(errors, 'getValidationErrorResponse').mockReturnValue(
        mockValidationError
      );

      // Act
      const response = await GetAccessesTable();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.issues).toBeDefined();
      expect(validationSpy).toHaveBeenCalled();
    });

    it('should handle internal server errors gracefully', async () => {
      // Arrange - Mock getValidationErrorResponse to throw an error
      spyOn(errors, 'getValidationErrorResponse').mockImplementation(() => {
        throw new Error('Validation service error');
      });

      // Act
      const response = await GetAccessesTable();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(response.statusText).toBe('Internal Server Error');
      expect(data.error).toBe('Internal Server Error');
      expect(data.message).toBe('Validation service error');
    });

    it('should include correct response headers', async () => {
      // Act
      const response = await GetAccessesTable();

      // Assert
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should simulate API delay', async () => {
      // Arrange
      const startTime = Date.now();

      // Act
      await GetAccessesTable();
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Assert - Should take at least 1 second (simulated delay)
      expect(duration).toBeGreaterThanOrEqual(1000);
    });
  });

  describe('GetAccessesScripts', () => {
    it('should include correct response headers', async () => {
      // Act
      const response = await GetAccessesScripts();

      // Assert
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should simulate API delay for scripts', async () => {
      // Arrange
      const startTime = Date.now();

      // Act
      await GetAccessesScripts();
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Assert - Should take at least 1 second (simulated delay)
      expect(duration).toBeGreaterThanOrEqual(1000);
    });

    it('should handle validation errors for scripts', async () => {
      // Arrange
      const mockValidationError = new Response(
        JSON.stringify({
          error: 'Validation failed',
          issues: [{ path: ['data'], message: 'Must be string' }]
        }),
        { status: 400, statusText: 'Bad Request' }
      );

      const validationSpy = spyOn(errors, 'getValidationErrorResponse').mockReturnValue(
        mockValidationError
      );

      // Act
      const response = await GetAccessesScripts();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.issues).toBeDefined();
      expect(validationSpy).toHaveBeenCalled();

      // Clean up the spy
      validationSpy.mockRestore();
    });

    it('should handle internal server errors gracefully', async () => {
      // Arrange - Mock getValidationErrorResponse to throw an error
      spyOn(errors, 'getValidationErrorResponse').mockImplementation(() => {
        throw new Error('Script validation error');
      });

      // Act
      const response = await GetAccessesScripts();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(response.statusText).toBe('Internal Server Error');
      expect(data.error).toBe('Internal Server Error');
      expect(data.message).toBe('Script validation error');
    });

    it('should include correct response headers', async () => {
      // Act
      const response = await GetAccessesScripts();

      // Assert
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should simulate API delay for scripts', async () => {
      // Arrange
      const startTime = Date.now();

      // Act
      await GetAccessesScripts();
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Assert - Should take at least 1 second (simulated delay)
      expect(duration).toBeGreaterThanOrEqual(1000);
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle unknown errors in GetAccessesTable', async () => {
      // Arrange - Mock getValidationErrorResponse to throw a non-Error object
      spyOn(errors, 'getValidationErrorResponse').mockImplementation(() => {
        throw 'String error';
      });

      // Act
      const response = await GetAccessesTable();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal Server Error');
      expect(data.message).toBe('Unknown error occurred');
    });

    it('should handle unknown errors in GetAccessesScripts', async () => {
      // Arrange - Mock getValidationErrorResponse to throw a non-Error object
      spyOn(errors, 'getValidationErrorResponse').mockImplementation(() => {
        throw { someObject: 'error' };
      });

      // Act
      const response = await GetAccessesScripts();
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal Server Error');
      expect(data.message).toBe('Unknown error occurred');
    });
  });
});
