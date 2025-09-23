import { mock } from 'bun:test';

export type NavFn = (path: string) => void;
export const navigateSpy = mock<NavFn>();

export const useNavigate = () => navigateSpy;
