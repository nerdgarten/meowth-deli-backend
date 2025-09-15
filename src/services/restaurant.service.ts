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
      throw new AppError("Invalid status value", 400);
    }

    const whereClause = status ? { verification_status: status } : {};

    const restaurants = await this.restaurantRepository.findRestaurantsByStatus(
      whereClause,
      limit,
      offset
    );

    return restaurants;
  }

  async searchDishes(keyword: string, limit: number, offset: number) {
    if (!keyword || keyword.trim() === "") {
      throw new AppError("Keyword cannot be empty", 400);
    }

    const whereClause = {
      OR: [
        {
          name: {
            contains: keyword,
            mode: "insensitive" as const,
          },
        },
        {
          detail: {
            contains: keyword,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const dishes = await this.restaurantRepository.findDishesByKeyword(
      whereClause,
      limit,
      offset
    );

    return dishes;
  }
}
