export type CsvImportRow = {
  latitude: number;
  longitude: number;
  subtotal: number;
  timestamp: string;
};

export const parseCsvOrders = (_csvContent: string): CsvImportRow[] => {
  void _csvContent;
  throw new Error("Not implemented: CSV parser");
};
