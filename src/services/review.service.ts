import { StatusCodes } from "http-status-codes";

import ReviewRepository from "@/repositories/review.repository";
import { AppError } from "@/types/error";
import {
  CreateDriverReviewBody,
  CreateOrderReviewBody,
  CreateRestaurantReviewBody,
  ReviewPaginationQuery,
} from "@/types/review/review";

import type { Prisma } from "@/generated/prisma/client";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const MIN_RATE = 1;
const MAX_RATE = 5;

type OrderWithDetails = NonNullable<
  Awaited<ReturnType<ReviewRepository["findOrderWithDetails"]>>
>;

export default class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  async createDriverReview(
    userId: number,
    driverIdValue: unknown,
    body: CreateDriverReviewBody
  ) {
    const driverId = this.parseId(driverIdValue, "driverId");
    const orderId = this.parseId(body.orderId, "orderId");
    const rate = this.parseRate(body.rate);
    const reviewText = this.extractReviewText(body);

    await this.ensureCustomerExists(userId);
    const order = await this.getOrderForCustomer(orderId, userId);

    return this.reviewRepository.executeTransaction(async (tx) =>
      this.createDriverReviewInternal({
        userId,
        driverId,
        order,
        rate,
        reviewText,
        tx,
      })
    );
  }

  async getDriverReviews(
    driverIdValue: unknown,
    query?: ReviewPaginationQuery
  ) {
    const driverId = this.parseId(driverIdValue, "driverId");
    await this.ensureDriverExists(driverId);

    const { limit, offset } = this.normalizePagination(
      query?.limit,
      query?.offset
    );

    const [reviews, total] = await Promise.all([
      this.reviewRepository.findDriverReviews(driverId, limit, offset),
      this.reviewRepository.countDriverReviews(driverId),
    ]);

    return {
      data: reviews,
      pagination: {
        total,
        limit,
        offset,
      },
    };
  }

  async getDriverReview(driverIdValue: unknown, reviewIdValue: unknown) {
    const driverId = this.parseId(driverIdValue, "driverId");
    const reviewId = this.parseId(reviewIdValue, "reviewId");

    await this.ensureDriverExists(driverId);

    const review = await this.reviewRepository.findDriverReviewById(
      driverId,
      reviewId
    );

    if (!review) {
      throw new AppError("Review not found", StatusCodes.NOT_FOUND);
    }

    return review;
  }

  async createRestaurantReview(
    userId: number,
    restaurantIdValue: unknown,
    body: CreateRestaurantReviewBody
  ) {
    const restaurantId = this.parseId(restaurantIdValue, "restaurantId");
    const orderId = this.parseId(body.orderId, "orderId");
    const rate = this.parseRate(body.rate);
    const reviewText = this.extractReviewText(body);

    await this.ensureCustomerExists(userId);
    const order = await this.getOrderForCustomer(orderId, userId);

    return this.reviewRepository.executeTransaction(async (tx) =>
      this.createRestaurantReviewInternal({
        userId,
        restaurantId,
        order,
        rate,
        reviewText,
        tx,
      })
    );
  }

  async getRestaurantReviews(
    restaurantIdValue: unknown,
    query?: ReviewPaginationQuery
  ) {
    const restaurantId = this.parseId(restaurantIdValue, "restaurantId");
    await this.ensureRestaurantExists(restaurantId);

    const { limit, offset } = this.normalizePagination(
      query?.limit,
      query?.offset
    );

    const [reviews, total] = await Promise.all([
      this.reviewRepository.findRestaurantReviews(restaurantId, limit, offset),
      this.reviewRepository.countRestaurantReviews(restaurantId),
    ]);

    return {
      data: reviews,
      pagination: {
        total,
        limit,
        offset,
      },
    };
  }

  async getRestaurantReview(
    restaurantIdValue: unknown,
    reviewIdValue: unknown
  ) {
    const restaurantId = this.parseId(restaurantIdValue, "restaurantId");
    const reviewId = this.parseId(reviewIdValue, "reviewId");

    await this.ensureRestaurantExists(restaurantId);

    const review = await this.reviewRepository.findRestaurantReviewById(
      restaurantId,
      reviewId
    );

    if (!review) {
      throw new AppError("Review not found", StatusCodes.NOT_FOUND);
    }

    return review;
  }

  async createOrderReviews(
    userId: number,
    orderIdValue: unknown,
    body: CreateOrderReviewBody
  ) {
    const orderId = this.parseId(orderIdValue, "orderId");

    if (!body || (!body.driverReview && !body.restaurantReview)) {
      throw new AppError(
        "At least one review payload is required",
        StatusCodes.BAD_REQUEST
      );
    }

    await this.ensureCustomerExists(userId);
    const order = await this.getOrderForCustomer(orderId, userId);

    const driverPayload = body.driverReview
      ? {
          driverId: this.resolveDriverId(body.driverReview.driverId, order),
          rate: this.parseRate(body.driverReview.rate),
          reviewText: this.extractReviewText(body.driverReview),
        }
      : null;

    const restaurantPayload = body.restaurantReview
      ? {
          restaurantId: this.parseId(
            body.restaurantReview.restaurantId,
            "restaurantId"
          ),
          rate: this.parseRate(body.restaurantReview.rate),
          reviewText: this.extractReviewText(body.restaurantReview),
        }
      : null;

    const result = await this.reviewRepository.executeTransaction(
      async (tx) => {
        const created = {
          driverReview: null as Awaited<
            ReturnType<ReviewRepository["createDriverReview"]>
          > | null,
          restaurantReview: null as Awaited<
            ReturnType<ReviewRepository["createRestaurantReview"]>
          > | null,
        };

        if (restaurantPayload) {
          created.restaurantReview = await this.createRestaurantReviewInternal({
            userId,
            restaurantId: restaurantPayload.restaurantId,
            order,
            rate: restaurantPayload.rate,
            reviewText: restaurantPayload.reviewText,
            tx,
          });
        }

        if (driverPayload) {
          created.driverReview = await this.createDriverReviewInternal({
            userId,
            driverId: driverPayload.driverId,
            order,
            rate: driverPayload.rate,
            reviewText: driverPayload.reviewText,
            tx,
          });
        }

        return created;
      }
    );

    return {
      orderId,
      restaurantReview: result.restaurantReview,
      driverReview: result.driverReview,
    };
  }

  async getOrderReviews(userId: number, orderIdValue: unknown) {
    const orderId = this.parseId(orderIdValue, "orderId");

    await this.ensureCustomerExists(userId);
    const order = await this.getOrderForCustomer(orderId, userId);

    const [driverReview, restaurantReview] = await Promise.all([
      this.reviewRepository.findDriverReviewByOrderAndCustomer(
        order.id,
        userId
      ),
      this.reviewRepository.findRestaurantReviewByOrderAndUser(
        order.id,
        userId
      ),
    ]);

    return {
      orderId,
      driverReview,
      restaurantReview,
    };
  }

  private async ensureCustomerExists(userId: number) {
    const customer = await this.reviewRepository.findCustomerById(userId);
    if (!customer) {
      throw new AppError("Customer profile not found", StatusCodes.FORBIDDEN);
    }
    return customer;
  }

  private async ensureDriverExists(driverId: number) {
    const driver = await this.reviewRepository.findDriverById(driverId);
    if (!driver) {
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
    }
    return driver;
  }

  private async ensureRestaurantExists(restaurantId: number) {
    const restaurant =
      await this.reviewRepository.findRestaurantById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }
    return restaurant;
  }

  private async getOrderForCustomer(orderId: number, customerId: number) {
    const order = await this.reviewRepository.findOrderWithDetails(orderId);

    if (!order) {
      throw new AppError("Order not found", StatusCodes.NOT_FOUND);
    }

    if (order.customer_id !== customerId) {
      throw new AppError(
        "You are not allowed to access this order",
        StatusCodes.FORBIDDEN
      );
    }

    return order;
  }

  private ensureOrderContainsRestaurant(
    order: OrderWithDetails,
    restaurantId: number
  ) {
    const hasRestaurant = order.orderDishes.some(
      (orderDish) => orderDish.dish.restaurant_id === restaurantId
    );

    if (!hasRestaurant) {
      throw new AppError(
        "Order does not contain dishes from this restaurant",
        StatusCodes.BAD_REQUEST
      );
    }
  }

  private async createDriverReviewInternal(params: {
    userId: number;
    driverId: number;
    order: OrderWithDetails;
    rate: number;
    reviewText?: string;
    tx?: Prisma.TransactionClient;
  }) {
    await this.ensureDriverExists(params.driverId);

    if (params.order.driver_id === null) {
      throw new AppError(
        "No driver is assigned to this order",
        StatusCodes.BAD_REQUEST
      );
    }

    if (params.order.driver_id !== params.driverId) {
      throw new AppError(
        "Driver is not assigned to this order",
        StatusCodes.BAD_REQUEST
      );
    }

    const existingReview =
      await this.reviewRepository.findDriverReviewByOrderAndCustomer(
        params.order.id,
        params.userId,
        params.tx
      );

    if (existingReview) {
      throw new AppError(
        "Driver review already exists for this order",
        StatusCodes.CONFLICT
      );
    }

    return this.reviewRepository.createDriverReview(
      {
        customer_id: params.userId,
        driver_id: params.driverId,
        order_id: params.order.id,
        rate: params.rate,
        review_text: params.reviewText,
      },
      params.tx
    );
  }

  private async createRestaurantReviewInternal(params: {
    userId: number;
    restaurantId: number;
    order: OrderWithDetails;
    rate: number;
    reviewText?: string;
    tx?: Prisma.TransactionClient;
  }) {
    await this.ensureRestaurantExists(params.restaurantId);
    this.ensureOrderContainsRestaurant(params.order, params.restaurantId);

    const existingReview =
      await this.reviewRepository.findRestaurantReviewByOrderAndUser(
        params.order.id,
        params.userId,
        params.tx
      );

    if (existingReview) {
      throw new AppError(
        "Restaurant review already exists for this order",
        StatusCodes.CONFLICT
      );
    }

    return this.reviewRepository.createRestaurantReview(
      {
        user_id: params.userId,
        restaurant_id: params.restaurantId,
        order_id: params.order.id,
        rate: params.rate,
        review_text: params.reviewText,
      },
      params.tx
    );
  }

  private resolveDriverId(
    driverIdValue: number | string | undefined,
    order: OrderWithDetails
  ) {
    if (driverIdValue !== undefined && driverIdValue !== null) {
      return this.parseId(driverIdValue, "driverId");
    }

    if (order.driver_id) {
      return order.driver_id;
    }

    throw new AppError("Driver ID is required", StatusCodes.BAD_REQUEST);
  }

  private parseId(value: unknown, fieldName: string) {
    const numeric = this.parseOptionalNumber(value);
    if (numeric === undefined || !Number.isInteger(numeric) || numeric <= 0) {
      throw new AppError(`Invalid ${fieldName}`, StatusCodes.BAD_REQUEST);
    }
    return numeric;
  }

  private parseRate(value: unknown) {
    const numeric = this.parseOptionalNumber(value);
    if (numeric === undefined) {
      throw new AppError("Rate is required", StatusCodes.BAD_REQUEST);
    }

    if (numeric < MIN_RATE || numeric > MAX_RATE) {
      throw new AppError(
        `Rate must be between ${MIN_RATE} and ${MAX_RATE}`,
        StatusCodes.BAD_REQUEST
      );
    }

    return numeric;
  }

  private extractReviewText(payload: {
    reviewText?: string;
    review_text?: string;
  }) {
    const text = payload.reviewText ?? payload.review_text;
    if (!text) {
      return undefined;
    }

    const trimmed = text.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private normalizePagination(limitValue?: unknown, offsetValue?: unknown) {
    const limitNumber = this.parseOptionalNumber(limitValue);
    const offsetNumber = this.parseOptionalNumber(offsetValue);

    const limit = Math.min(
      Math.max(
        limitNumber !== undefined ? Math.floor(limitNumber) : DEFAULT_LIMIT,
        1
      ),
      MAX_LIMIT
    );

    const offset = Math.max(
      offsetNumber !== undefined ? Math.floor(offsetNumber) : 0,
      0
    );

    return { limit, offset };
  }

  private parseOptionalNumber(value: unknown): number | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    const candidate = Array.isArray(value) ? Number(value[0]) : Number(value);

    if (!Number.isFinite(candidate)) {
      return undefined;
    }

    return candidate;
  }
}
