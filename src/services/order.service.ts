import OrderRespository from "@/repositories/order.respository";
import type { OrderCreateBody } from "@/types/order";

export default class OrderService {
  private orderRepository: OrderRespository;

  constructor() {
    this.orderRepository = new OrderRespository();
  }

  async getOrderById(orderId: number) {
    return this.orderRepository.getOrderById(orderId);
  }

  async getOrdersByCustomerId(customerId: number) {
    return this.orderRepository.getOrdersByCustomerId(customerId);
  }

  async getOrdersByRestaurantId(restaurantId: number) {
    return this.orderRepository.getOrdersByRestaurantId(restaurantId);
  }

  async getOrdersByDriverId(driverId: number) {
    return this.orderRepository.getOrdersByDriverId(driverId);
  }

  async createOrder(data: OrderCreateBody) {
    return this.orderRepository.createOrder(data);
  }
}
