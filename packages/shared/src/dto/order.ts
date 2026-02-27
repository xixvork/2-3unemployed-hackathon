export type CreateOrderInput = {
  latitude: number;
  longitude: number;
  subtotal: number;
  timestamp: string;
};

export type TaxBreakdown = {
  state_rate: number;
  county_rate: number;
  city_rate: number;
  special_rates: number;
};

export type Order = {
  id: string;
  latitude: number;
  longitude: number;
  subtotal: number;
  timestamp: string;
  composite_tax_rate: number;
  tax_amount: number;
  total_amount: number;
  breakdown: TaxBreakdown;
  jurisdictions?: string[];
};

export type OrdersListQuery = {
  page: number;
  limit: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type OrdersListResponse = {
  items: Order[];
  total: number;
  page: number;
  limit: number;
};

export type CreateOrderResponse = {
  order: Order;
};

export type ImportOrdersResponse = {
  importedCount: number;
};
