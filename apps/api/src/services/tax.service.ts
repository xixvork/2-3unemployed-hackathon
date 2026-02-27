export type TaxBreakdown = {
  state_rate: number;
  county_rate: number;
  city_rate: number;
  special_rates: number;
};

export type TaxResult = {
  composite_tax_rate: number;
  tax_amount: number;
  total_amount: number;
  breakdown: TaxBreakdown;
  jurisdictions?: string[];
};

export const calculateTaxForOrder = (): TaxResult => {
  throw new Error("Not implemented: tax calculation service");
};
