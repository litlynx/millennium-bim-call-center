import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  cif: string;
  name: string;
  accountNumber: string;
};

export type UserStore = {
  user: User | null;
  setUser: (userData: User | null) => void;
  clearUser: () => void;
  getCustomerName: () => string;
  getCif: () => string;
  getAccountNumber: () => string;

};

const MOCK_USER: User = {
  cif: 'PT12345678',
  name: 'Jacinto Fazenda',
  accountNumber: '764682235'
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: MOCK_USER,
      setUser: (userData) => set(() => ({ user: userData })),
      clearUser: () => set(() => ({ user: null })),
      getCustomerName: () => get().user?.name ?? 'Utilizador',
      getCif: () => get().user?.cif ?? '—',
      getAccountNumber: () => get().user?.accountNumber ?? '—'
    }),
    { name: 'user-store' }
  )
);
