import axios from "axios";

import {
  IGeocodeRequest,
  IGeocodeResponse,
  IMapSVGRequest,
  IMapSVGResponse,
  IReverseGeocodeRequest,
  IReverseGeocodeResponse,
} from "@/types/map";

const MOCK_MAP_SERVICE_URL =
  process.env.MOCK_MAP_SERVICE_URL || "http://localhost:5055";

export class MapService {
  private mapClient;

  constructor() {
    this.mapClient = axios.create({
      baseURL: MOCK_MAP_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Get map SVG with markers
  async getMapSVG(request: IMapSVGRequest): Promise<IMapSVGResponse> {
    try {
      // const response = await this.mapClient.post<IMapSVGResponse>(
      //   "/static-map",
      //   request
      // );
      return {
        svg: "https://outsystemsui.outsystems.com/OutSystemsMapsSample/img/OutSystemsMapsSample.staticmap.png?ZirGOXju0A0F1pc0GcNjuA",
      };
    } catch (error) {
      console.error("Error fetching map SVG:", error);
      throw new Error("Failed to fetch map SVG");
    }
  }

  // Reverse geocode (get address from coordinates)
  async reverseGeocode(
    request: IReverseGeocodeRequest
  ): Promise<IReverseGeocodeResponse> {
    try {
      const response = await this.mapClient.post<IReverseGeocodeResponse>(
        "/reverse-geocode",
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      throw new Error("Failed to reverse geocode location");
    }
  }

  // Geocode (get coordinates from address)
  async geocode(request: IGeocodeRequest): Promise<IGeocodeResponse> {
    try {
      const response = await this.mapClient.post<IGeocodeResponse>(
        "/geocode",
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error geocoding:", error);
      throw new Error("Failed to geocode address");
    }
  }
}

export default MapService;
