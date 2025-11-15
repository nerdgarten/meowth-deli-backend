export interface ILocation {
  id?: number;
  latitude: number;
  longitude: number;
  address?: string | null;
  is_default?: boolean;
}

export type LocationCreateBody = ILocation;
