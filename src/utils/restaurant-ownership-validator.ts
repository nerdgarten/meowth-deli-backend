import { StatusCodes } from "http-status-codes";

import AuthRepository from "@/repositories/auth.repository";
import DishRepository from "@/repositories/dish.repository";
import { AppError } from "@/types/error";

export class RestaurantOwnershipValidator {
  private authRepository: AuthRepository;
  private dishRepository: DishRepository;

  constructor() {
    this.authRepository = new AuthRepository();
    this.dishRepository = new DishRepository();
  }

  async validateUserIsRestaurantOwner(userId: number) {
    const userRestaurant =
      await this.authRepository.findRestaurantByUserId(userId);
    if (!userRestaurant) {
      throw new AppError(
        "User is not a restaurant owner",
        StatusCodes.FORBIDDEN
      );
    }
    return userRestaurant;
  }

  async validateDishOwnership(dishId: number, userId: number) {
    const dish = await this.dishRepository.findDishById(dishId);
    if (!dish) {
      throw new AppError("Dish not found", StatusCodes.NOT_FOUND);
    }

    const userRestaurant = await this.validateUserIsRestaurantOwner(userId);

    if (dish.restaurant_id !== userRestaurant.id) {
      throw new AppError(
        "You can only modify dishes from your own restaurant",
        StatusCodes.FORBIDDEN
      );
    }

    return { dish, restaurant: userRestaurant };
  }
}

export const restaurantOwnershipValidator = new RestaurantOwnershipValidator();
