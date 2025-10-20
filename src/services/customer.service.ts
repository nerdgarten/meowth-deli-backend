import { StatusCodes } from "http-status-codes";

import CustomerRepository from "@/repositories/customer.repository";
import { AppError } from "@/types/error";
import { ICustomer, ICreateOrderRequest, IOrderDishRepository } from "@/types/user";
import { type Order } from "@/generated/prisma/client";
import { prisma } from "@/libs/prisma";

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
      data
    );
    if (!updatedProfile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return updatedProfile;
  }

  async createOrder(customerId: number, orderData: ICreateOrderRequest): Promise<Order> {
    // Validate input
    this.validateOrderInput(orderData);

    // Validate restaurant
    const restaurant = await this.validateRestaurant(orderData.restaurant_id);

    // Validate dishes
    const dishDetails = await this.validateDishes(
      orderData.dishes.map(d => d.dish_id), 
      restaurant.id
    );

    // Calculate total amount and driver fee
    const { totalAmount, driverFee } = this.calculateOrderCosts(
      dishDetails, 
      orderData.dishes, 
      restaurant.fee_rate
    );

    // Prepare mapped dishes
    const mappedDishes: IOrderDishRepository[] = orderData.dishes.map(dish => ({
      dishId: dish.dish_id,
      quantity: dish.quantity,
      note: dish.note
    }));

    // Create order
    return this.customerRepository.createOrder({
      customerId,
      restaurant_id: restaurant.id,
      location: orderData.location,
      note: orderData.note,
      total_amount: totalAmount,
      driver_fee: driverFee,
      dishes: mappedDishes
    });
  }

  // Validate order input
  private validateOrderInput(orderData: ICreateOrderRequest) {
    // Location validation
    if (!orderData.location?.trim()) {
      throw new AppError("Location is required", StatusCodes.BAD_REQUEST);
    }

    // Dishes validation
    if (!orderData.dishes?.length) {
      throw new AppError("At least one dish is required", StatusCodes.BAD_REQUEST);
    }

    // Dish format validation
    const isValidDishes = orderData.dishes.every(dish => 
      dish.dish_id > 0 && 
      dish.quantity > 0
    );

    if (!isValidDishes) {
      throw new AppError(
        "Invalid dish format. Each dish must have a valid dish ID and quantity > 0", 
        StatusCodes.BAD_REQUEST
      );
    }
  }

  // Validate restaurant
  private async validateRestaurant(restaurantId: number) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { 
        id: restaurantId,
        is_available: true 
      },
      select: {
        id: true,
        name: true,
        fee_rate: true
      }
    });

    if (!restaurant) {
      throw new AppError(
        "Restaurant not found or unavailable", 
        StatusCodes.BAD_REQUEST
      );
    }

    return restaurant;
  }

  // Validate dishes
  private async validateDishes(dishIds: number[], restaurantId: number) {
    const dishDetails = await prisma.dish.findMany({
      where: {
        id: { in: dishIds },
        restaurant_id: restaurantId,
        is_out_of_stock: false
      },
      select: {
        id: true,
        name: true,
        price: true,
        restaurant_id: true
      }
    });

    // Check if all dishes are found and from the same restaurant
    if (dishDetails.length !== dishIds.length) {
      const foundDishIds = dishDetails.map(d => d.id);
      const missingDishIds = dishIds.filter(id => !foundDishIds.includes(id));
      
      throw new AppError(
        `Dishes not found or out of stock: ${missingDishIds.join(", ")}`,
        StatusCodes.BAD_REQUEST
      );
    }

    return dishDetails;
  }

  // Calculate order costs
  private calculateOrderCosts(
    dishDetails: Array<{ id: number; price: number }>, 
    orderDishes: Array<{ dish_id: number; quantity: number }>,
    feeRate: number
  ) {
    // Calculate total amount
    const totalAmount = orderDishes.reduce((total, dish) => {
      const dishDetail = dishDetails.find(d => d.id === dish.dish_id);
      return total + (dishDetail?.price ?? 0) * dish.quantity;
    }, 0);

    // Calculate driver fee
    const driverFee = totalAmount * feeRate;

    return { totalAmount, driverFee };
  }
}