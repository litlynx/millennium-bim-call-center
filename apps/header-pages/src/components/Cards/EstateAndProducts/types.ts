export interface FinancialItemInterface {
  name: string;
  amount: string;
  currency: string;
}

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
