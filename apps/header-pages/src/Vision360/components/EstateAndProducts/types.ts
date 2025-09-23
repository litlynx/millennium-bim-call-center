import type { FinancialItemInterface } from '../../../api/EstateAndProducts/interfaces';

export interface FinancialSectionInterface {
  title: string;
  total: {
    amount: string;
    currency: string;
  };
  items: FinancialItemInterface[];
}

export interface EstateAndProductsData {
  assets: FinancialSectionInterface;
  liabilities: FinancialSectionInterface;
}
