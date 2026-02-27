export type Coordinates = {
  latitude: number;
  longitude: number;
};

export const resolveJurisdictions = (_coordinates: Coordinates): string[] => {
  throw new Error("Not implemented: jurisdiction resolver");
};
