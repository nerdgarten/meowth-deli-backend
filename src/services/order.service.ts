import CustomerRepository from "@/repositories/customer.repository";
import DriverRepository from "@/repositories/driver.repository";
import LocationRepository from "@/repositories/location.repository";
import OrderRespository from "@/repositories/order.respository";
import RestaurantRepository from "@/repositories/restaurant.repository";

import {
  CreateOrderRequestDTO,
  GetOrderResponseDTO,
  CreateOrderResponseDTO,
} from "@/types/dto/order";
import { CreateOrderRequestSchema } from "@/validators/order.schema";
import { OrderStatus } from "@/generated/prisma/client";
import { AppError } from "@/types/error";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

export default class OrderService {
  private orderRepository: OrderRespository;
  private customerRepository: CustomerRepository;
  private restaurantRepository: RestaurantRepository;
  private driverRepository: DriverRepository;
  private locationRepository: LocationRepository;

  constructor() {
    this.orderRepository = new OrderRespository();
    this.customerRepository = new CustomerRepository();
    this.restaurantRepository = new RestaurantRepository();
    this.driverRepository = new DriverRepository();
    this.locationRepository = new LocationRepository();
  }

  async getOrderById(orderId: number): Promise<GetOrderResponseDTO> {
    const order = await this.orderRepository.getOrderById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    return {
      id: order.id,
      customer: order.customer,
      restaurant: order.restaurant,
      driver: order.driver,
      location: order.location,
      status: order.status,
      total_amount: order.total_amount,
      driver_fee: order.driver_fee,
      remark: order.remark,
      orderDishes: order.orderDishes.map((orderDish) => ({
        amount: orderDish.amount,
        remark: orderDish.remark,
        dish: {
          id: orderDish.dish.id,
          name: orderDish.dish.name,
          detail: orderDish.dish.detail,
          price: orderDish.dish.price,
          image: orderDish.dish.image,
        },
      })),
    };
  }

  async getOrdersByCustomerId(
    customerId: number
  ): Promise<GetOrderResponseDTO[]> {
    if (!(await this.customerRepository.getCustomerProfileById(customerId))) {
      throw new AppError("Customer not found", StatusCodes.NOT_FOUND);
    }
    const orders = await this.orderRepository.getOrdersByCustomerId(customerId);
    return orders.map((order) => ({
      id: order.id,
      customer: order.customer,
      restaurant: order.restaurant,
      driver: order.driver,
      location: order.location,
      status: order.status,
      total_amount: order.total_amount,
      driver_fee: order.driver_fee,
      remark: order.remark,
      orderDishes: order.orderDishes.map((orderDish) => ({
        amount: orderDish.amount,
        remark: orderDish.remark,
        dish: {
          id: orderDish.dish.id,
          name: orderDish.dish.name,
          detail: orderDish.dish.detail,
          price: orderDish.dish.price,
          image: orderDish.dish.image,
        },
      })),
    }));
  }

  async getOrdersByRestaurantId(
    restaurantId: number
  ): Promise<GetOrderResponseDTO[]> {
    if (
      !(await this.restaurantRepository.getRestaurantProfileById(restaurantId))
    ) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }
    const orders =
      await this.orderRepository.getOrdersByRestaurantId(restaurantId);
    return orders.map((order) => ({
      id: order.id,
      customer: order.customer,
      restaurant: order.restaurant,
      driver: order.driver,
      location: order.location,
      status: order.status,
      total_amount: order.total_amount,
      driver_fee: order.driver_fee,
      remark: order.remark,
      orderDishes: order.orderDishes.map((orderDish) => ({
        amount: orderDish.amount,
        remark: orderDish.remark,
        dish: {
          id: orderDish.dish.id,
          name: orderDish.dish.name,
          detail: orderDish.dish.detail,
          price: orderDish.dish.price,
          image: orderDish.dish.image,
        },
      })),
    }));
  }

  async getOrdersByDriverId(driverId: number): Promise<GetOrderResponseDTO[]> {
    if (!(await this.driverRepository.getDriverProfileById(driverId))) {
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
    }
    const orders = await this.orderRepository.getOrdersByDriverId(driverId);
    return orders.map((order) => ({
      id: order.id,
      customer: order.customer,
      restaurant: order.restaurant,
      driver: order.driver,
      location: order.location,
      status: order.status,
      total_amount: order.total_amount,
      driver_fee: order.driver_fee,
      remark: order.remark,
      orderDishes: order.orderDishes.map((orderDish) => ({
        amount: orderDish.amount,
        remark: orderDish.remark,
        dish: {
          id: orderDish.dish.id,
          name: orderDish.dish.name,
          detail: orderDish.dish.detail,
          price: orderDish.dish.price,
          image: orderDish.dish.image,
        },
      })),
    }));
  }

  async createOrder(
    body: CreateOrderRequestDTO
  ): Promise<CreateOrderResponseDTO> {
    const dto = CreateOrderRequestSchema.parse(body);
    const customer = await this.customerRepository.getCustomerProfileById(
      dto.customer_id
    );
    if (!customer) {
      throw new AppError("Customer not found", StatusCodes.NOT_FOUND);
    }
    const restaurant = await this.restaurantRepository.getRestaurantProfileById(
      dto.restaurant_id
    );
    if (!restaurant) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }
    const driver = await this.driverRepository.getDriverProfileById(
      dto.driver_id
    );
    if (!driver) {
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
    }
    const location = await this.locationRepository.getLocationById(
      dto.location_id
    );
    if (!location) {
      throw new AppError("Location not found", StatusCodes.NOT_FOUND);
    }
    const data = await this.orderRepository.createOrder({
      customer: {
        connect: { id: dto.customer_id },
      },
      restaurant: {
        connect: { id: dto.restaurant_id },
      },
      driver: {
        connect: { id: dto.driver_id },
      },
      location: {
        connect: { id: dto.location_id },
      },
      status: dto.status,
      total_amount: dto.total_amount,
      driver_fee: dto.driver_fee,
      remark: dto.remark,
      orderDishes: {
        create: dto.orderDishes.map((orderDish) => ({
          amount: orderDish.amount,
          dish: {
            connect: { id: orderDish.dish_id },
          },
        })),
      },
    });
    return data;
  }

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
    if (!(await this.orderRepository.getOrderById(orderId))) {
      throw new Error("Order not found");
    }
    const updatedOrder = await this.orderRepository.updateOrderStatus(
      orderId,
      status
    );
  }
}
