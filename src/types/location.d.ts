export interface ILocation {
  id?: number;
  latitude: number;
  longitude: number;
  address?: string | null;
}

export type LocationCreateBody = ILocation;
