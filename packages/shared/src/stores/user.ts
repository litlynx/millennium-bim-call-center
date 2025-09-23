import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  cif: string;
  name: string;
  accountNumber: string;
};

type UserStore = {
  user: User | null;
  setUser: (userData: User | null) => void;
  clearUser: () => void;
};

const MOCK_USER: User = {
  cif: 'PT12345678',
  name: 'Jacinto Fazenda',
  accountNumber: '764682235'
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: MOCK_USER,
      setUser: (userData) => set(() => ({ user: userData })),
      clearUser: () => set(() => ({ user: null }))
    }),
    { name: 'user-store' }
  )
);
