import { StatusCodes } from "http-status-codes";

import DishRepository from "@/repositories/dish.repository";
import { IDish } from "@/types/dish/dish";
import {
  CreateDishRequestDTO,
  CreateDishResponseDTO,
  GetDishResponseDTO,
  UpdateDishRequestDTO,
} from "@/types/dto/dish";
import { AppError } from "@/types/error";
import { DishBodySchema, DishUpdateSchema } from "@/validators/dish.schema";
import CustomerRepository from "@/repositories/customer.repository";

export default class DishService {
  private dishRepository: DishRepository;
  private customerRepository: CustomerRepository;

  constructor() {
    this.dishRepository = new DishRepository();
    this.customerRepository = new CustomerRepository();
  }

  async validateRestaurantOwnership(dishId: number, restaurantId: number) {
    if (!(await this.dishRepository.getDishById(dishId))) {
      throw new AppError("Dish not found", StatusCodes.NOT_FOUND);
    }
    if (!(await this.dishRepository.isDishOwnerByUser(dishId, restaurantId))) {
      throw new AppError(
        "You do not have permission to modify this dish",
        StatusCodes.FORBIDDEN
      );
    }
  }

  async createDish(data: CreateDishRequestDTO): Promise<CreateDishResponseDTO> {
    const dto = DishBodySchema.parse({
      ...data,
      allergy: Array.isArray(data.allergy)
        ? data.allergy
        : JSON.parse(data.allergy as unknown as string),
      price: Number(data.price),
    });
    const newDish = await this.dishRepository.createDish({
      restaurant: {
        connect: { id: dto.restaurant_id },
      },
      name: dto.name,
      detail: dto.detail,
      price: dto.price,
      is_out_of_stock: dto.is_out_of_stock,
      image: dto.image,
      allergy: dto.allergy,
    });
    return newDish;
  }

  async getAllDishes() {
    const dishes = await this.dishRepository.getAllDishes();
    return dishes;
  }

  async getDishById(id: number) {
    const dish = await this.dishRepository.getDishById(id);
    if (!dish) {
      throw new AppError("Dish not found", StatusCodes.NOT_FOUND);
    }

    return dish;
  }

  async getDishesByRestaurantId(restaurantId: number) {
    const dishes =
      await this.dishRepository.getDishesByRestaurantId(restaurantId);
    return dishes;
  }

  async getFavoriteDishesByUserId(userId: number, restaurantId: number) {
    const dishes = await this.dishRepository.getFavoriteDishByUserId(
      userId,
      restaurantId
    );
    return dishes;
  }

  async updateDish(
    id: number,
    restaurantId: number,
    data: UpdateDishRequestDTO
  ): Promise<GetDishResponseDTO> {
    await this.validateRestaurantOwnership(id, restaurantId);

    const dto = DishUpdateSchema.parse({
      ...data,
      allergy: Array.isArray(data.allergy)
        ? data.allergy
        : JSON.parse(data.allergy ?? "[]"),
      price: Number(data.price),
    });

    const updatedDish = await this.dishRepository.updateDish(dto, id);
    return updatedDish;
  }

  async deleteDish(id: number, restaurantId: number) {
    await this.validateRestaurantOwnership(id, restaurantId);

    await this.dishRepository.deleteDish(id);
    return { message: "Dish deleted successfully" };
  }

  async updateDishStockStatus(
    dishId: number,
    restaurantId: number,
    is_out_of_stock: boolean
  ): Promise<GetDishResponseDTO> {
    await this.validateRestaurantOwnership(dishId, restaurantId);

    const updatedDish = await this.dishRepository.updateDishStockStatus(
      dishId,
      is_out_of_stock
    );
    return updatedDish;
  }

  async updateFavoriteDishByUserId(
    userId: number,
    dishId: number,
    isFavorite: boolean
  ) {
    const customer =
      await this.customerRepository.getCustomerProfileById(userId);
    if (!customer) {
      throw new AppError("Customer not found", StatusCodes.NOT_FOUND);
    }
    const dish = await this.dishRepository.getDishById(dishId);
    if (!dish) {
      throw new AppError("Dish not found", StatusCodes.NOT_FOUND);
    }
    await this.dishRepository.updateFavoriteDishByUserId(
      userId,
      dishId,
      isFavorite
    );
  }

  async checkFavoriteDish(userId: number, dishId: number) {
    const favorite = await this.dishRepository.isFavoriteDishByUserId(
      userId,
      dishId
    );
    const customer =
      await this.customerRepository.getCustomerProfileById(userId);
    if (!customer) {
      throw new AppError("Customer not found", StatusCodes.NOT_FOUND);
    }
    const dish = await this.dishRepository.getDishById(dishId);
    if (!dish) {
      throw new AppError("Dish not found", StatusCodes.NOT_FOUND);
    }
    return favorite;
  }
}
