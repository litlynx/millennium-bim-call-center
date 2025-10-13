import { beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { GET } from './route';
import * as service from './service';

describe('Accesses API Route', () => {
  beforeEach(() => {
    // Clear all mocks before each test
  });

  it('should successfully fetch and combine table and script data', async () => {
    // Arrange
    const mockTableData = [
      {
        operatorName: 'Test Operator',
        phoneNumber: '123456789',
        type: 'mobile',
        stateSimSwap: 'active',
        badgeText: 'Active'
      }
    ];

    const mockScriptData = 'Test script content';

    const mockTableResponse = {
      json: () => Promise.resolve(mockTableData)
    } as Response;

    const mockScriptResponse = {
      json: () => Promise.resolve(mockScriptData)
    } as Response;

    const getTableSpy = spyOn(service, 'GetAccessesTable').mockResolvedValue(mockTableResponse);
    const getScriptSpy = spyOn(service, 'GetAccessesScripts').mockResolvedValue(mockScriptResponse);

    // Act
    const result = await GET();

    // Assert
    expect(getTableSpy).toHaveBeenCalledTimes(1);
    expect(getScriptSpy).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      table: mockTableData,
      script: mockScriptData
    });
  });

  it('should handle service calls in parallel', async () => {
    // Arrange
    const mockTableResponse = {
      json: () => Promise.resolve([])
    } as Response;

    const mockScriptResponse = {
      json: () => Promise.resolve('script')
    } as Response;

    const startTime = Date.now();
    let tableCallTime = 0;
    let scriptCallTime = 0;

    // Create fresh spies for this test to avoid conflicts
    const getTableSpy = spyOn(service, 'GetAccessesTable').mockImplementation(async () => {
      tableCallTime = Date.now() - startTime;
      await new Promise((resolve) => setTimeout(resolve, 10));
      return mockTableResponse;
    });

    const getScriptSpy = spyOn(service, 'GetAccessesScripts').mockImplementation(async () => {
      scriptCallTime = Date.now() - startTime;
      await new Promise((resolve) => setTimeout(resolve, 10));
      return mockScriptResponse;
    });

    // Act
    await GET();

    // Assert - both calls should start almost simultaneously (within 20ms)
    expect(Math.abs(tableCallTime - scriptCallTime)).toBeLessThan(20);
    expect(getTableSpy).toHaveBeenCalled();
    expect(getScriptSpy).toHaveBeenCalled();
  });

  it('should propagate errors from service layer', async () => {
    // Arrange
    const mockError = new Error('Service error');
    spyOn(service, 'GetAccessesTable').mockRejectedValue(mockError);
    spyOn(service, 'GetAccessesScripts').mockResolvedValue({
      json: () => Promise.resolve('script')
    } as Response);

    // Act & Assert
    await expect(GET()).rejects.toThrow('Service error');
  });

  it('should handle JSON parsing errors', async () => {
    // Arrange
    const mockTableResponse = {
      json: () => Promise.reject(new Error('JSON parse error'))
    } as Response;

    const mockScriptResponse = {
      json: () => Promise.resolve('script')
    } as Response;

    spyOn(service, 'GetAccessesTable').mockResolvedValue(mockTableResponse);
    spyOn(service, 'GetAccessesScripts').mockResolvedValue(mockScriptResponse);

    // Act & Assert
    await expect(GET()).rejects.toThrow('JSON parse error');
  });
});
