import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/libs/prisma";
import { OrderCreateBody, OrderStatus, OrderDishBody } from "@/types/order";

export default class OrderRespository {
  async getOrderById(orderId: number) {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderDishes: {
          include: {
            dish: true,
          },
        },
        customer: true,
        restaurant: true,
        driver: true,
        location: true,
      },
    });
  }

  async getOrdersByCustomerId(customerId: number) {
    return await prisma.order.findMany({
      where: { customer_id: customerId },
      include: {
        orderDishes: {
          include: {
            dish: true,
          },
        },
        customer: true,
        restaurant: true,
        driver: true,
        location: true,
      },
      orderBy: { id: "desc" },
    });
  }

  async getOrdersByRestaurantId(restaurantId: number) {
    return await prisma.order.findMany({
      where: { restaurant_id: restaurantId },
      include: {
        orderDishes: {
          include: {
            dish: true,
          },
        },
        customer: true,
        restaurant: true,
        driver: true,
        location: true,
      },
      orderBy: { id: "desc" },
    });
  }

  async getOrdersByDriverId(driverId: number) {
    return await prisma.order.findMany({
      where: { driver_id: driverId },
      include: {
        orderDishes: {
          include: {
            dish: true,
          },
        },
        customer: true,
        restaurant: true,
        driver: true,
        location: true,
      },
      orderBy: { id: "desc" },
    });
  }

  async createOrder(data: Prisma.OrderCreateInput) {
    return prisma.order.create({
      data,
      include: {
        orderDishes: {
          include: {
            dish: true,
          },
        },
      },
    });
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        orderDishes: {
          include: {
            dish: true,
          },
        },
      },
    });
  }
}
