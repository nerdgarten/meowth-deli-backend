import { prisma } from "@/libs/prisma";
import { OrderCreateBody, OrderStatus, OrderDishBody } from "@/types/order";

export default class OrderRespository {
  async getOrderById(orderId: number) {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        order_dishes: true,
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
        order_dishes: true,
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
        order_dishes: true,
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
        order_dishes: true,
        customer: true,
        restaurant: true,
        driver: true,
        location: true,
      },
      orderBy: { id: "desc" },
    });
  }

  async createOrder(data: OrderCreateBody) {
    return prisma.order.create({
      data: {
        customer_id: data.customer_id,
        restaurant_id: data.restaurant_id,
        delivery_location_id: data.delivery_location_id,
        total_amount: data.total_amount,
        driver_fee: data.driver_fee,
        driver_id: data.driver_id || null,
        status: data.status ?? OrderStatus.pending,
        remark: data.remark || null,
        order_dishes: {
          create: data.order_dishes.map((dish: OrderDishBody) => ({
            dish_id: dish.dish_id,
            quantity: dish.amount,
            remark: dish.remark || "",
          })),
        },
      },
      include: {
        order_dishes: true,
      },
    });
  }
}
