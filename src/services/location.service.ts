import { StatusCodes } from "http-status-codes";

import CustomerRepository from "@/repositories/customer.repository";
import LocationRepository from "@/repositories/location.repository";
import {
  CreateLocationRequestDTO,
  CreateCustomerLocationResponseDTO,
  CreateRestaurantLocationResponseDTO,
  GetLocationResponseDTO,
} from "@/types/dto/location";
import { AppError } from "@/types/error";
import { locationBodySchema } from "@/validators/location.schema";
import RestaurantRepository from "@/repositories/restaurant.repository";

export default class LocationService {
  private locationRepository: LocationRepository;
  private customerRepository: CustomerRepository;
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.locationRepository = new LocationRepository();
    this.customerRepository = new CustomerRepository();
    this.restaurantRepository = new RestaurantRepository();
  }

  async createCustomerLocation(
    customerId: number,
    body: CreateLocationRequestDTO
  ): Promise<CreateCustomerLocationResponseDTO> {
    const dto = locationBodySchema.parse(body);
    const customer =
      await this.customerRepository.getCustomerProfileById(customerId);
    if (!customer) {
      throw new AppError("Customer not found", StatusCodes.NOT_FOUND);
    }
    const data = await this.locationRepository.createCustomerLocation({
      customer: {
        connect: {
          id: customerId,
        },
      },
      location: {
        create: {
          latitude: dto.latitude,
          longitude: dto.longitude,
          address: dto.address,
        },
      },
    });
    if (customer && !customer.default_location_id) {
      await this.customerRepository.setDefaultLocation(
        customerId,
        data.location.id
      );
    }

    return {
      id: data.location.id,
      customer_id: data.customer_id,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
      address: data.location.address || "",
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  async getLocationsByCustomerId(
    customerId: number
  ): Promise<GetLocationResponseDTO[]> {
    const customer =
      await this.customerRepository.getCustomerProfileById(customerId);
    if (!customer) {
      throw new AppError("Customer not found", StatusCodes.NOT_FOUND);
    }
    const locations =
      await this.locationRepository.getLocationByCustomerId(customerId);

    return locations.map((data) => ({
      id: data.location.id,
      customer_id: data.customer_id,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
      address: data.location.address || "",
      created_at: data.created_at,
      updated_at: data.updated_at,
    }));
  }

  async getDefaultLocationByCustomerId(
    customerId: number
  ): Promise<GetLocationResponseDTO | null> {
    const location =
      await this.customerRepository.getDefaultLocationByCustomerId(customerId);

    if (!location) return null;

    return {
      id: location.id,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address || "",
    };
  }

  async getLocationById(
    locationId: number
  ): Promise<GetLocationResponseDTO | null> {
    const location = await this.locationRepository.getLocationById(locationId);

    if (!location) return null;

    return {
      id: location.id,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address || "",
    };
  }

  async updateDefaultLocationByCustomerId(
    customerId: number,
    locationId: number
  ): Promise<GetLocationResponseDTO | null> {
    const isCustomerLocation = await this.locationRepository.isCustomerLocation(
      customerId,
      locationId
    );
    if (!isCustomerLocation) {
      throw new AppError("Location not found", StatusCodes.NOT_FOUND);
    }

    const updatedLocation = await this.customerRepository.setDefaultLocation(
      customerId,
      locationId
    );
    if (!updatedLocation) return null;

    return {
      id: updatedLocation.id,
      latitude: updatedLocation.latitude,
      longitude: updatedLocation.longitude,
      address: updatedLocation.address || "",
    };
  }

  async createRestaurantLocation(
    restaurantId: number,
    body: CreateLocationRequestDTO
  ): Promise<CreateRestaurantLocationResponseDTO> {
    const dto = locationBodySchema.parse(body);
    const restaurant =
      await this.restaurantRepository.getRestaurantProfileById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }
    const data = await this.locationRepository.createRestaurantLocation({
      restaurant: {
        connect: {
          id: restaurantId,
        },
      },
      latitude: dto.latitude,
      longitude: dto.longitude,
      address: dto.address,
    });

    if (!data.restaurant) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }

    return {
      id: data.id,
      restaurant_id: data.restaurant.id,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address || "",
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  async getRestaurantLocationByRestaurantId(
    restaurantId: number
  ): Promise<GetLocationResponseDTO | null> {
    const location =
      await this.locationRepository.getLocationByRestaurantId(restaurantId);

    if (!location) return null;

    return {
      id: location.id,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address || "",
    };
  }

  async createDriverLocation(
    driverId: number,
    body: CreateLocationRequestDTO
  ): Promise<GetLocationResponseDTO> {
    const dto = locationBodySchema.parse(body);
    const data = await this.locationRepository.createDriverLocation({
      driver: {
        connect: {
          id: driverId,
        },
      },
      latitude: dto.latitude,
      longitude: dto.longitude,
      address: dto.address,
    });

    return {
      id: data.id,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address || "",
    };
  }

  async getDriverLocationByDriverId(
    driverId: number
  ): Promise<GetLocationResponseDTO | null> {
    const location =
      await this.locationRepository.getLocationByDriverId(driverId);

    if (!location) return null;

    return {
      id: location.id,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address || "",
    };
  }

  async updateLocationById(
    locationId: number,
    body: Partial<CreateLocationRequestDTO>
  ): Promise<GetLocationResponseDTO | null> {
    const dto = locationBodySchema.parse(body);
    const data = await this.locationRepository.updateLocationById(
      locationId,
      dto
    );

    if (!data) return null;

    return {
      id: data.id,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address || "",
    };
  }
}
