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
    return order;
  }

  async createOrder(
    body: CreateOrderRequestDTO
  ): Promise<CreateOrderResponseDTO> {
    const dto = CreateOrderRequestSchema.parse(body);
    const customer = await this.customerRepository.getCustomerProfileById(
      dto.customer_id
    );
    if (!customer) {
      throw new Error("Customer not found");
    }
    const restaurant = await this.restaurantRepository.getRestaurantProfileById(
      dto.restaurant_id
    );
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    const driver = await this.driverRepository.getDriverProfileById(
      dto.driver_id
    );
    if (!driver) {
      throw new Error("Driver not found");
    }
    const location = await this.locationRepository.getLocationById(
      dto.location_id
    );
    if (!location) {
      throw new Error("Location not found");
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
    });
    return data;
  }
}
