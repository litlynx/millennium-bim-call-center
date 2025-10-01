import { describe, expect, it } from 'bun:test';
import { mockPrimaryRows } from './mockPrimaryRows';
import { mockTransactionRows } from './mockTransactionRows';

describe('MobileBanking mock data', () => {
  it('should provide primary rows with required fields', () => {
    expect(Array.isArray(mockPrimaryRows)).toBe(true);
    expect(mockPrimaryRows.length).toBeGreaterThan(0);
    mockPrimaryRows.forEach((row) => {
      expect(row).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          operatorName: expect.any(String),
          phoneNumber: expect.any(String),
          type: expect.any(String),
          stateSimSwap: expect.any(String),
          badgeText: expect.any(String)
        })
      );
    });
  });

  it('should provide transaction rows mapped to contacts and transaction details', () => {
    expect(Array.isArray(mockTransactionRows)).toBe(true);
    expect(mockTransactionRows.length).toBeGreaterThan(0);
    mockTransactionRows.forEach((row) => {
      expect(row).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          contact: expect.any(String),
          channel: expect.any(String),
          typeTransaction: expect.any(String),
          amount: expect.any(String),
          date: expect.any(String),
          hour: expect.any(String),
          stateTransaction: expect.any(String),
          accountDestination: expect.any(String),
          accountOrigin: expect.any(String),
          error: expect.any(String)
        })
      );
    });
  });
});
