import CustomerRepository from "@/repositories/customer.repository";
import LocationRepository from "@/repositories/location.repository";
import {
  CreateLocationRequestDTO,
  CreateLocationResponseDTO,
  GetLocationResponseDTO,
} from "@/types/dto/location";

export default class LocationService {
  private locationRepository: LocationRepository;
  private customerRepository: CustomerRepository;

  constructor() {
    this.locationRepository = new LocationRepository();
    this.customerRepository = new CustomerRepository();
  }

  async createCustomerLocation(
    customerId: number,
    body: CreateLocationRequestDTO
  ): Promise<CreateLocationResponseDTO> {
    const data = await this.locationRepository.createCustomerLocation({
      customer: {
        connect: {
          id: customerId,
        },
      },
      location: {
        create: {
          latitude: body.latitude,
          longitude: body.longitude,
          address: body.address,
        },
      },
    });
    const customer =
      await this.customerRepository.getCustomerProfileById(customerId);
    if (customer && !customer.default_location_id) {
      await this.customerRepository.setDefaultLocation(
        customerId,
        data.location.id
      );
    }

    return {
      id: data.id,
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
    const locations =
      await this.locationRepository.getLocationByCustomerId(customerId);

    return locations.map((data) => ({
      id: data.id,
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
      await this.locationRepository.getDefaultLocationByCustomerId(customerId);

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

  // async setDefault(customerId: number, locationId: number) {
  //   const location = await this.locationRepository.findCustomerLocation(
  //     locationId,
  //     customerId
  //   );

  //   if (!location) {
  //     throw new AppError("Location not found", StatusCodes.NOT_FOUND);
  //   }

  //   const updatedLocation = await this.locationRepository.setDefaultLocation(
  //     customerId,
  //     locationId
  //   );

  //   return this.toResponse(updatedLocation);
  // }

  // async getLocations(customerId: number) {
  //   const locations =
  //     await this.locationRepository.listCustomerLocations(customerId);

  //   return locations.map((location) => this.toResponse(location));
  // }

  // async updateLocation(locationId: number, data: Partial<ILocation>) {
  //   if (data.address === undefined && data.customer_id === undefined) {
  //     throw new AppError("No fields to update", StatusCodes.BAD_REQUEST);
  //   }

  //   try {
  //     const updatedLocation = await this.locationRepository.updateLocation(
  //       locationId,
  //       data
  //     );

  //     return this.toResponse(updatedLocation);
  //   } catch (error: unknown) {
  //     if (
  //       error instanceof Prisma.PrismaClientKnownRequestError &&
  //       error.code === "P2025"
  //     ) {
  //       throw new AppError("Location not found", StatusCodes.NOT_FOUND);
  //     }

  //     throw error;
  //   }
  // }

  // private toResponse(location: Location) {
  //   return {
  //     id: location.id,
  //     customer_id: location.customer_id,
  //     address: location.address,
  //     is_default: location.is_default,
  //   };
  // }
}
