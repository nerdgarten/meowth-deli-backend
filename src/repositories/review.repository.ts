import { prisma } from "@/libs/prisma";

import type { Prisma } from "@/generated/prisma/client";

const DRIVER_REVIEW_INCLUDE = {
  customer: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
    },
  },
  driver: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
    },
  },
};

const RESTAURANT_REVIEW_INCLUDE = {
  user: {
    select: {
      id: true,
      email: true,
    },
  },
  restaurant: {
    select: {
      id: true,
      name: true,
    },
  },
};

export default class ReviewRepository {
  private getClient(tx?: Prisma.TransactionClient) {
    return tx ?? prisma;
  }

  async executeTransaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return prisma.$transaction(callback);
  }

  createDriverReview(
    data: {
      customer_id: number;
      driver_id: number;
      order_id: number;
      rate: number;
      review_text?: string;
    },
    tx?: Prisma.TransactionClient
  ) {
    const client = this.getClient(tx);
    return client.driverReview.create({
      data,
      include: DRIVER_REVIEW_INCLUDE,
    });
  }

  createRestaurantReview(
    data: {
      customer_id: number;
      restaurant_id: number;
      order_id: number;
      rate: number;
      review_text?: string;
    },
    tx?: Prisma.TransactionClient
  ) {
    const client = this.getClient(tx);
    return client.restaurantReview.create({
      data,
      include: RESTAURANT_REVIEW_INCLUDE,
    });
  }

  findDriverReviews(driverId: number, limit: number, offset: number) {
    return prisma.driverReview.findMany({
      where: { driver_id: driverId },
      take: limit,
      skip: offset,
      orderBy: { created_at: "desc" },
      include: DRIVER_REVIEW_INCLUDE,
    });
  }

  countDriverReviews(driverId: number) {
    return prisma.driverReview.count({
      where: { driver_id: driverId },
    });
  }

  findDriverReviewById(driverId: number, reviewId: number) {
    return prisma.driverReview.findFirst({
      where: { id: reviewId, driver_id: driverId },
      include: DRIVER_REVIEW_INCLUDE,
    });
  }

  findDriverReviewByOrderAndCustomer(
    orderId: number,
    customerId: number,
    tx?: Prisma.TransactionClient
  ) {
    const client = this.getClient(tx);
    return client.driverReview.findFirst({
      where: {
        order_id: orderId,
        customer_id: customerId,
      },
      include: DRIVER_REVIEW_INCLUDE,
    });
  }

  findRestaurantReviews(restaurantId: number, limit: number, offset: number) {
    return prisma.restaurantReview.findMany({
      where: { restaurant_id: restaurantId },
      take: limit,
      skip: offset,
      orderBy: { created_at: "desc" },
      include: RESTAURANT_REVIEW_INCLUDE,
    });
  }

  countRestaurantReviews(restaurantId: number) {
    return prisma.restaurantReview.count({
      where: { restaurant_id: restaurantId },
    });
  }

  findRestaurantReviewById(restaurantId: number, reviewId: number) {
    return prisma.restaurantReview.findFirst({
      where: { id: reviewId, restaurant_id: restaurantId },
      include: RESTAURANT_REVIEW_INCLUDE,
    });
  }

  findRestaurantReviewByOrderAndUser(
    orderId: number,
    userId: number,
    tx?: Prisma.TransactionClient
  ) {
    const client = this.getClient(tx);
    return client.restaurantReview.findFirst({
      where: {
        order_id: orderId,
        customer_id: userId,
      },
      include: RESTAURANT_REVIEW_INCLUDE,
    });
  }

  findDriverById(driverId: number) {
    return prisma.driver.findUnique({
      where: { id: driverId },
      select: { id: true },
    });
  }

  findRestaurantById(restaurantId: number) {
    return prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { id: true },
    });
  }

  findCustomerById(userId: number) {
    return prisma.customer.findUnique({
      where: { id: userId },
      select: { id: true },
    });
  }

  findOrderWithDetails(orderId: number) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderDishes: {
          include: {
            dish: {
              select: {
                id: true,
                restaurant_id: true,
              },
            },
          },
        },
        driver: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });
  }
}
