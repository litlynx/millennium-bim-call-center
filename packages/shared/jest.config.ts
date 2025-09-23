import getJestConfig from '@config/bun-test-config';
import type { Config } from 'jest';

export default async (): Promise<Config> => getJestConfig();
