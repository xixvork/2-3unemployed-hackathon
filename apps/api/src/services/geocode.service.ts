export type Coordinates = {
  latitude: number;
  longitude: number;
};

export const resolveJurisdictions = (_coordinates: Coordinates): string[] => {
  void _coordinates;
  throw new Error("Not implemented: jurisdiction resolver");
};
