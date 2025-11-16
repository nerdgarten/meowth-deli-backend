import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

import { OrderStatus, Prisma } from "@/generated/prisma/client";
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
import { AppError } from "@/types/error";
import { CreateOrderRequestSchema } from "@/validators/order.schema";

type RepositoryOrder = Prisma.OrderGetPayload<{
  include: {
    orderDishes: {
      include: {
        dish: true;
      };
    };
    customer: true;
    restaurant: {
      include: {
        location: true;
      };
    };
    driver: true;
    location: true;
  };
}>;

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
      throw new AppError("Order not found", StatusCodes.NOT_FOUND);
    }
    return {
      ...this.formatOrderResponse(order),
      total_amount: await this.orderRepository.calculateTotalAmount(orderId),
    };
  }

  async getOrdersByCustomerId(
    customerId: number
  ): Promise<GetOrderResponseDTO[]> {
    if (!(await this.customerRepository.getCustomerProfileById(customerId))) {
      throw new AppError("Customer not found", StatusCodes.NOT_FOUND);
    }
    const orders = await this.orderRepository.getOrdersByCustomerId(customerId);
    return Promise.all(
      orders.map(async (order) => ({
        ...this.formatOrderResponse(order),
        total_amount: await this.orderRepository.calculateTotalAmount(order.id),
      }))
    );
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
    return Promise.all(
      orders.map(async (order) => ({
        ...this.formatOrderResponse(order),
        total_amount: await this.orderRepository.calculateTotalAmount(order.id),
      }))
    );
  }

  async getOrdersByDriverId(driverId: number): Promise<GetOrderResponseDTO[]> {
    if (!(await this.driverRepository.getDriverProfileById(driverId))) {
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
    }
    const orders = await this.orderRepository.getOrdersByDriverId(driverId);
    return Promise.all(
      orders.map(async (order) => ({
        ...this.formatOrderResponse(order),
        total_amount: await this.orderRepository.calculateTotalAmount(order.id),
      }))
    );
  }

  async createOrder(
    body: CreateOrderRequestDTO
  ): Promise<CreateOrderResponseDTO> {
    const dto = CreateOrderRequestSchema.parse(body);
    if (
      !(await this.customerRepository.getCustomerProfileById(dto.customer_id))
    ) {
      throw new AppError("Customer not found", StatusCodes.NOT_FOUND);
    }

    if (
      !(await this.restaurantRepository.getRestaurantProfileById(
        dto.restaurant_id
      ))
    ) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }
    if (
      dto.driver_id !== undefined &&
      !(await this.driverRepository.getDriverProfileById(dto.driver_id))
    ) {
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
    }
    if (
      dto.delivery_location_id &&
      !(await this.locationRepository.getLocationById(dto.delivery_location_id))
    ) {
      throw new AppError("Location not found", StatusCodes.NOT_FOUND);
    }
    const data = await this.orderRepository.createOrder({
      customer: {
        connect: { id: dto.customer_id },
      },
      restaurant: {
        connect: { id: dto.restaurant_id },
      },
      driver: dto.driver_id
        ? {
            connect: { id: dto.driver_id },
          }
        : undefined,
      location: {
        connect: { id: dto.delivery_location_id },
      },
      status: dto.status,
      driver_fee: dto.driver_fee,
      remark: dto.remark,
      orderDishes: {
        create: dto.orderDishes.map((orderDish) => ({
          amount: orderDish.quantity,
          remark: orderDish.remark,
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
      throw new AppError("Order not found", StatusCodes.NOT_FOUND);
    }
    await this.orderRepository.updateOrderStatus(orderId, status);
  }

  formatOrderResponse(
    order: RepositoryOrder
  ): Omit<GetOrderResponseDTO, "total_amount"> {
    return {
      id: order.id,
      customer_id: order.customer_id,
      restaurant_id: order.restaurant_id,
      driver_id: order.driver_id,
      delivery_location_id: order.location.id,
      customer: {
        firstname: order.customer.firstname,
        lastname: order.customer.lastname,
        tel: order.customer.tel,
        image: order.customer.image,
      },
      restaurant: {
        name: order.restaurant.name,
        tel: order.restaurant.tel,
        detail: order.restaurant.detail,
        banner: order.restaurant.banner,
        location: order.restaurant.location,
      },
      driver: order.driver
        ? {
            firstname: order.driver.firstname,
            lastname: order.driver.lastname,
            tel: order.driver.tel,
            image: order.driver.image,
            licence: order.driver.licence,
            vehicle: order.driver.vehicle,
          }
        : null,
      location: {
        latitude: order.location.latitude,
        longitude: order.location.longitude,
        address: order.location.address,
      },
      status: order.status,
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
      created_at: order.created_at,
    };
  }
}
