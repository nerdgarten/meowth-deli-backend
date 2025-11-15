// Map location types
export interface ILocation {
  lat: number;
  lng: number;
}

export interface IMarker {
  location: ILocation;
  label?: string;
  color?: string;
}

export interface IMapSVGRequest {
  center: ILocation;
  zoom?: number;
  width?: number;
  height?: number;
  markers?: IMarker[];
}

export interface IMapSVGResponse {
  svg: string;
}

export interface IReverseGeocodeRequest {
  location: ILocation;
}

export interface IReverseGeocodeResponse {
  address: string;
}

export interface IGeocodeRequest {
  address: string;
}

export interface IGeocodeResult {
  formatted_address: string;
  location: ILocation;
}

export interface IGeocodeResponse {
  results: IGeocodeResult[];
}

export interface ISaveLocationRequest {
  location: ILocation;
  address: string;
  label?: string;
}
