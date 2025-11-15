import { StatusCodes } from "http-status-codes";

import { Prisma, type Location } from "@/generated/prisma/client";
import LocationRepository from "@/repositories/location.repository";
import { AppError } from "@/types/error";
import { ILocation, LocationCreateBody } from "@/types/location";

export default class LocationService {
  private locationRepository: LocationRepository;

  constructor() {
    this.locationRepository = new LocationRepository();
  }

  async createLocation(body: LocationCreateBody) {
    const createdLocation = await this.locationRepository.createLocation(body);

    return this.toResponse(createdLocation);
  }

  async setDefault(customerId: number, locationId: number) {
    const location = await this.locationRepository.findCustomerLocation(
      locationId,
      customerId
    );

    if (!location) {
      throw new AppError("Location not found", StatusCodes.NOT_FOUND);
    }

    const updatedLocation = await this.locationRepository.setDefaultLocation(
      customerId,
      locationId
    );

    return this.toResponse(updatedLocation);
  }

  async getLocations(customerId: number) {
    const locations =
      await this.locationRepository.listCustomerLocations(customerId);

    return locations.map((location) => this.toResponse(location));
  }

  async updateLocation(locationId: number, data: Partial<ILocation>) {
    if (data.address === undefined && data.customer_id === undefined) {
      throw new AppError("No fields to update", StatusCodes.BAD_REQUEST);
    }

    try {
      const updatedLocation = await this.locationRepository.updateLocation(
        locationId,
        data
      );

      return this.toResponse(updatedLocation);
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Location not found", StatusCodes.NOT_FOUND);
      }

      throw error;
    }
  }

  private toResponse(location: Location) {
    return {
      id: location.id,
      customer_id: location.customer_id,
      address: location.address,
      is_default: location.is_default,
    };
  }
}
