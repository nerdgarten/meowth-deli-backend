import { StatusCodes } from "http-status-codes";

import { VerificationStatus } from "@/generated/prisma/enums";
import RestaurantRepository from "@/repositories/restaurant.repository";
import { AppError } from "@/types/error";
import {
  GetRestaurantResponseDTO,
  UpdateRestaurantProfileRequestDTO,
} from "@/types/dto/restaurant";
import { restaurantUpdateProfileSchema } from "@/validators/profile.schema";

export default class RestaurantService {
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
  }

  async getRestaurants(): Promise<GetRestaurantResponseDTO[]> {
    return this.restaurantRepository.getRestaurants();
  }

  async getRestaurantProfileById(
    id: number
  ): Promise<GetRestaurantResponseDTO | null> {
    const data = await this.restaurantRepository.getRestaurantProfileById(id);
    if (!data) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }
    return data;
  }

  async getRestaurantFavoriteByUserId(
    userId: number
  ): Promise<GetRestaurantResponseDTO[]> {
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
  ): Promise<GetRestaurantResponseDTO[]> {
    const data = await this.restaurantRepository.getRestaurantsByStatus(status);
    return data;
  }

  async updateRestaurnatProfileById(
    restaurantId: number,
    body: UpdateRestaurantProfileRequestDTO
  ): Promise<GetRestaurantResponseDTO> {
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
  ): Promise<GetRestaurantResponseDTO> {
    const updatedProfile =
      await this.restaurantRepository.updateRestaurantAvailabilityById(
        restaurantId,
        is_available
      );

    return updatedProfile;
  }
}
