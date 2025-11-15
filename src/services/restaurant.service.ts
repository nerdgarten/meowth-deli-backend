import { StatusCodes } from "http-status-codes";

import { VerificationStatus, OrderStatus } from "@/generated/prisma/enums";
import RestaurantRepository from "@/repositories/restaurant.repository";
import { AppError } from "@/types/error";
import { restaurantOwnershipValidator } from "@/utils/restaurantOwnershipValidator";

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

  async updateRestaurantAvailability(userId: number, is_available: boolean) {
    const userRestaurant =
      await restaurantOwnershipValidator.validateUserIsRestaurantOwner(userId);

    const updatedRestaurant =
      await this.restaurantRepository.updateRestaurantAvailability(
        userRestaurant.id,
        is_available
      );

    return updatedRestaurant;
  }

  async getRestaurantOrders(userId: number, status?: OrderStatus) {
    const userRestaurant = await restaurantOwnershipValidator.validateUserIsRestaurantOwner(userId);
    
    const orders = await this.restaurantRepository.getOrdersByRestaurantId(userRestaurant.id, status);
    
    return orders;
  }

  async updateOrderStatus(userId: number, orderId: number, status: OrderStatus) {
    const userRestaurant = await restaurantOwnershipValidator.validateUserIsRestaurantOwner(userId);
    
    const order = await this.restaurantRepository.findOrderById(orderId);
    if (!order || !order.orderDishes.some(od => od.dish.restaurant_id === userRestaurant.id)) {
      throw new AppError("Order not found or doesn't belong to this restaurant", StatusCodes.NOT_FOUND);
    }
    
    const allowedStatuses: OrderStatus[] = [OrderStatus.preparing, OrderStatus.rejected];
    if (!allowedStatuses.includes(status)) {
      throw new AppError("Invalid status. Restaurant can only set status to 'preparing' or 'rejected'", StatusCodes.BAD_REQUEST);
    }
    
    if (order.status !== OrderStatus.pending) {
      throw new AppError("Order status can only be updated when it's in 'pending' state", StatusCodes.BAD_REQUEST);
    }
    
    const updatedOrder = await this.restaurantRepository.updateOrderStatus(orderId, status);
    
    return updatedOrder;
  }

  async getDishesByRestaurantId(restaurantId: number) {
    if(!restaurantId || isNaN(restaurantId)) {
      throw new AppError("Invalid restaurant ID", StatusCodes.BAD_REQUEST);
    }
    const dishes = await this.restaurantRepository.findDishesByRestaurantId(restaurantId);
    return dishes;
  }
  async getRestaurantById(restaurantId: number) {
    if(!restaurantId || isNaN(restaurantId)) {
      throw new AppError("Invalid restaurant ID", StatusCodes.BAD_REQUEST);
    }
    const restaurant = await this.restaurantRepository.findRestaurantById(restaurantId);
    if(!restaurant) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }
    return restaurant;
  }
}
