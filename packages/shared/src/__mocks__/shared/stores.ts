// Mock for shared/stores

interface MockUserState {
  getCustomerName: () => string;
  getCif: () => string;
  getAccountNumber: () => string;
}

export const useUserStore = <T>(selector: (state: MockUserState) => T): T => {
  const mockState: MockUserState = {
    getCustomerName: () => 'Mock Customer',
    getCif: () => '123456789',
    getAccountNumber: () => '987654321'
  };

  return selector(mockState);
};

export default { useUserStore };
