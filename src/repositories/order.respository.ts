import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/libs/prisma";
import { AppError } from "@/types/error";
import { OrderCreateBody, OrderStatus, OrderDishBody } from "@/types/order";
import { StatusCodes } from "http-status-codes";
import { get } from "node:http";

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

  async calculateTotalAmount(orderId: number): Promise<number> {
    let total = 0;
    const order = await this.getOrderById(orderId);
    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND);
    }
    for (const orderDish of order.orderDishes) {
      total += orderDish.amount * orderDish.dish.price;
    }
    return total;
  }
}
