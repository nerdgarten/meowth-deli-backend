import { StatusCodes } from "http-status-codes";

import { VerificationStatus } from "@/generated/prisma/enums";
import RestaurantRepository from "@/repositories/restaurant.repository";
import {
  IRestaurantProfile,
  UpdateRestaurantProfileRequestDTO,
} from "@/types/dto/restaurant";
import { AppError } from "@/types/error";
import { restaurantUpdateProfileSchema } from "@/validators/profile.schema";
import CustomerRepository from "@/repositories/customer.repository";

export default class RestaurantService {
  private restaurantRepository: RestaurantRepository;
  private customerRepository: CustomerRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
    this.customerRepository = new CustomerRepository();
  }

  async getRestaurants(): Promise<IRestaurantProfile[]> {
    return this.restaurantRepository.getRestaurants();
  }

  async getRestaurantProfileById(
    id: number
  ): Promise<IRestaurantProfile | null> {
    const data = await this.restaurantRepository.getRestaurantProfileById(id);
    if (!data) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }
    return data;
  }

  async getFavoriteRestaurantsByUserId(
    userId: number
  ): Promise<IRestaurantProfile[]> {
    const customer =
      await this.customerRepository.getCustomerProfileById(userId);
    if (!customer) {
      throw new AppError("Customer not found", StatusCodes.NOT_FOUND);
    }
    const data =
      await this.restaurantRepository.getFavoriteRestaurantByUserId(userId);
    if (!data) {
      throw new AppError(
        "Favorite restaurants not found",
        StatusCodes.NOT_FOUND
      );
    }
    return data;
  }

  async getRestaurantsByStatus(
    status: VerificationStatus
  ): Promise<IRestaurantProfile[]> {
    const data = await this.restaurantRepository.getRestaurantsByStatus(status);
    return data;
  }

  async updateRestaurnatProfileById(
    restaurantId: number,
    body: UpdateRestaurantProfileRequestDTO
  ): Promise<IRestaurantProfile> {
    const dto = restaurantUpdateProfileSchema.parse(body);
    const data = await this.restaurantRepository.updateRestaurnatProfileById(
      restaurantId,
      dto
    );
    if (!data) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return data;
  }

  async updateRestaurantAvailabilityById(
    restaurantId: number,
    is_available: boolean
  ): Promise<IRestaurantProfile> {
    const updatedProfile =
      await this.restaurantRepository.updateRestaurantAvailabilityById(
        restaurantId,
        is_available
      );

    return updatedProfile;
  }

  async updateFavoriteRestaurantByUserId(
    userId: number,
    favoriteRestaurantId: number,
    isFavorite: boolean
  ): Promise<void> {
    const customer =
      await this.customerRepository.getCustomerProfileById(userId);
    if (!customer) {
      throw new AppError("Customer not found", StatusCodes.NOT_FOUND);
    }
    const restaurant =
      await this.restaurantRepository.getRestaurantProfileById(
        favoriteRestaurantId
      );
    if (!restaurant) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }
    await this.restaurantRepository.updateFavoriteRestaurantByUserId(
      userId,
      favoriteRestaurantId,
      isFavorite
    );
  }
}
