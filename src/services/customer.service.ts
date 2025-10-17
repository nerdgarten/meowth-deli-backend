//Service
import { StatusCodes } from "http-status-codes";

import CustomerRepository from "@/repositories/customer.repository";
import { AppError } from "@/types/error";
import { ICustomer, IDriver, IRestaurant, ICreateOrderRequest, IOrderDishRepository } from "@/types/user";
import { type Order } from "@/generated/prisma/client";

export default class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async getCustomerProfile(userId: number) {
    const profile = await this.customerRepository.getCustomerProfile(userId);
    if (!profile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return profile;
  }

  async updateCustomerProfile(userId: number, data: Partial<ICustomer>) {
    const updatedProfile = await this.customerRepository.updateCustomerProfile(
      userId,
      data,
    );
    if (!updatedProfile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return updatedProfile;
  }

  async createOrder(customerId: number, orderData: ICreateOrderRequest): Promise<Order> {
    // Validation for location
    if (!orderData.location) {
      throw new AppError("Location is required", StatusCodes.BAD_REQUEST);
    }

    // Validation for dishes
    if (!orderData.dishes?.length) {
      throw new AppError("At least one dish is required", StatusCodes.BAD_REQUEST);
    }

    // Validate dish format
    const isValidDishes = orderData.dishes.every(dish => 
      dish.name && 
      dish.quantity && 
      dish.quantity > 0
    );

    if (!isValidDishes) {
      throw new AppError(
        "Invalid dish format. Each dish must have name and quantity > 0", 
        StatusCodes.BAD_REQUEST
      );
    }

    const dishDetails = await this.customerRepository.getDishesWithDetails(
      orderData.dishes.map(d => d.name)
    );

    const notFoundDishes = orderData.dishes
      .filter(d => !dishDetails.some(detail => detail.name === d.name))
      .map(d => d.name);

    if (notFoundDishes.length > 0) {
      throw new AppError(
        `Dishes not found: ${notFoundDishes.join(", ")}`,
        StatusCodes.BAD_REQUEST
      );
    }

    const restaurantId = dishDetails[0].restaurant_id;
    if (!dishDetails.every(d => d.restaurant_id === restaurantId)) {
      throw new AppError(
        "All dishes must be from the same restaurant",
        StatusCodes.BAD_REQUEST
      );
    }

    const mappedDishes: IOrderDishRepository[] = orderData.dishes.map(dish => ({
      dishId: dishDetails.find(d => d.name === dish.name)!.id,
      quantity: dish.quantity,
      note: dish.note
    }));

    return this.customerRepository.createOrder({
      customerId,
      location: orderData.location,
      note: orderData.note,
      dishes: mappedDishes
    });
  }
}