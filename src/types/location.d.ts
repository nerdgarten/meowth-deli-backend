export interface ILocation {
  id?: number;
  customer_id: number;
  address: string;
  is_default?: boolean;
}

export type LocationCreateBody = ILocation;
