import { StatusCodes } from "http-status-codes";

import { VerificationStatus } from "@/generated/prisma";
import RestaurantRepository from "@/repositories/restaurant.repository";
import { AppError } from "@/types/error";

export default class RestaurantService {
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.restaurantRepository = new RestaurantRepository();
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
}
