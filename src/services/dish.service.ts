import { IDish } from "@/types/dish/dish";
import { AppError } from "@/types/error";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import DishRepository from "@/repositories/dish.repository";
import AuthRepository from "@/repositories/auth.repository";

export default class DishService {
  private dishRepository: DishRepository;
  private authRepository: AuthRepository;

  constructor() {
    this.dishRepository = new DishRepository();
    this.authRepository = new AuthRepository();
  }

  async searchDishes(keyword: string, limit: number, offset: number) {
    if (!keyword || keyword.trim() === "") {
      throw new AppError("Keyword cannot be empty", StatusCodes.BAD_REQUEST);
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

    const dishes = await this.dishRepository.findDishesByKeyword(
      whereClause,
      limit,
      offset
    );

    return dishes;
  }

  async createDish(email: string, data: IDish) {
    if (!data.name || data.name.trim() === "") {
      throw new AppError("Dish name cannot be empty", StatusCodes.BAD_REQUEST);
    }
    if (data.price <= 0) {
      throw new AppError(
        "Price must be greater than zero",
        StatusCodes.BAD_REQUEST
      );
    }

    const user = await this.authRepository.findUserByEmail(email);
    const userID = user?.id || null;

    data.restaurant_id =
      (await this.authRepository.findRestaurantByUserId(userID!))?.id || 0;

    const newDish = await this.dishRepository.createDish({
      ...data,
    });
    return newDish;
  }
}
