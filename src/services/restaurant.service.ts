import { StatusCodes } from "http-status-codes";

import { VerificationStatus } from "@/generated/prisma";
import AuthRepository from "@/repositories/auth.repository";
import RestaurantRepository from "@/repositories/restaurant.repository";
import { AppError } from "@/types/error";

export default class RestaurantService {
  private restaurantRepository: RestaurantRepository;
  private authRepository: AuthRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
    this.authRepository = new AuthRepository();
  }

  async getRestaurantsByStatus(
    status: VerificationStatus | undefined,
    limit: number,
    offset: number
  ) {
    if (status && !Object.values(VerificationStatus).includes(status)) {
      throw new AppError("Invalid status value", StatusCodes.BAD_REQUEST);
    }

    const whereClause = status ? { verification_status: status } : {};

    const restaurants = await this.restaurantRepository.findRestaurantsByStatus(
      whereClause,
      limit,
      offset
    );

    return restaurants;
  }

  async updateRestaurantAvailability(userId: number, is_available: boolean) {
    const userRestaurant =
      await this.authRepository.findRestaurantByUserId(userId);
    if (!userRestaurant) {
      throw new AppError(
        "User is not a restaurant owner",
        StatusCodes.FORBIDDEN
      );
    }

    const updatedRestaurant =
      await this.restaurantRepository.updateRestaurantAvailability(
        userRestaurant.id,
        is_available
      );

    return updatedRestaurant;
  }
}
