import { StatusCodes } from "http-status-codes";

import DishRepository from "@/repositories/dish.repository";
import { IDish } from "@/types/dish/dish";
import { AppError } from "@/types/error";
import { restaurantOwnershipValidator } from "@/utils/restaurantOwnershipValidator";

export default class DishService {
  private dishRepository: DishRepository;

  constructor() {
    this.dishRepository = new DishRepository();
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

  private async validateRestaurantOwnership(dishId: number, userId: number) {
    return await restaurantOwnershipValidator.validateDishOwnership(
      dishId,
      userId
    );
  }

  async createDish(userId: number, data: IDish) {
    if (!data.name || data.name.trim() === "") {
      throw new AppError("Dish name cannot be empty", StatusCodes.BAD_REQUEST);
    }
    if (data.price <= 0) {
      throw new AppError(
        "Price must be greater than zero",
        StatusCodes.BAD_REQUEST
      );
    }

    const userRestaurant =
      await restaurantOwnershipValidator.validateUserIsRestaurantOwner(userId);

    data.restaurant_id = userRestaurant.id;

    const newDish = await this.dishRepository.createDish({
      ...data,
    });
    return newDish;
  }

  async getAllDishes(limit?: number, offset?: number) {
    const dishes = await this.dishRepository.findAllDishes(limit, offset);
    return dishes;
  }

  async getDishById(id: number) {
    if (!id || id <= 0) {
      throw new AppError("Invalid dish ID", StatusCodes.BAD_REQUEST);
    }

    const dish = await this.dishRepository.findDishById(id);
    if (!dish) {
      throw new AppError("Dish not found", StatusCodes.NOT_FOUND);
    }

    return dish;
  }

  async updateDish(id: number, data: Partial<IDish>, userId: number) {
    if (!id || id <= 0) {
      throw new AppError("Invalid dish ID", StatusCodes.BAD_REQUEST);
    }

    await this.validateRestaurantOwnership(id, userId);

    if (data.name !== undefined && (!data.name || data.name.trim() === "")) {
      throw new AppError("Dish name cannot be empty", StatusCodes.BAD_REQUEST);
    }
    if (data.price !== undefined && data.price <= 0) {
      throw new AppError(
        "Price must be greater than zero",
        StatusCodes.BAD_REQUEST
      );
    }

    const updatedDish = await this.dishRepository.updateDish(id, data);
    return updatedDish;
  }

  async deleteDish(id: number, userId: number) {
    if (!id || id <= 0) {
      throw new AppError("Invalid dish ID", StatusCodes.BAD_REQUEST);
    }

    await this.validateRestaurantOwnership(id, userId);

    await this.dishRepository.deleteDish(id);
    return { message: "Dish deleted successfully" };
  }

  async updateDishStockStatus(
    dishId: number,
    userId: number,
    is_out_of_stock: boolean
  ) {
    if (!dishId || dishId <= 0) {
      throw new AppError("Invalid dish ID", StatusCodes.BAD_REQUEST);
    }

    await this.validateRestaurantOwnership(dishId, userId);

    const updatedDish = await this.dishRepository.updateDishStockStatus(
      dishId,
      is_out_of_stock
    );
    return updatedDish;
  }
}
