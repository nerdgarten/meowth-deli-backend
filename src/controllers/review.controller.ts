import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import ReviewService from "@/services/review.service";
import { AppError } from "@/types/error";
import { ReviewPaginationQuery } from "@/types/review/review";

export default class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  async createDriverReview(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      return;
    }

    try {
      const review = await this.reviewService.createDriverReview(
        userId,
        req.params.driverId,
        req.body
      );

      res.status(StatusCodes.CREATED).json(review);
    } catch (error: unknown) {
      this.handleError(res, error, "create driver review");
    }
  }

  async listDriverReviews(req: Request, res: Response) {
    try {
      const reviews = await this.reviewService.getDriverReviews(
        req.params.driverId,
        req.query as ReviewPaginationQuery
      );

      res.status(StatusCodes.OK).json(reviews);
    } catch (error: unknown) {
      this.handleError(res, error, "list driver reviews");
    }
  }

  async getDriverReview(req: Request, res: Response) {
    try {
      const review = await this.reviewService.getDriverReview(
        req.params.driverId,
        req.params.reviewId
      );

      res.status(StatusCodes.OK).json(review);
    } catch (error: unknown) {
      this.handleError(res, error, "get driver review");
    }
  }

  async createRestaurantReview(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      return;
    }

    try {
      const review = await this.reviewService.createRestaurantReview(
        userId,
        req.params.restaurantId,
        req.body
      );

      res.status(StatusCodes.CREATED).json(review);
    } catch (error: unknown) {
      this.handleError(res, error, "create restaurant review");
    }
  }

  async listRestaurantReviews(req: Request, res: Response) {
    try {
      const reviews = await this.reviewService.getRestaurantReviews(
        req.params.restaurantId,
        req.query as ReviewPaginationQuery
      );

      res.status(StatusCodes.OK).json(reviews);
    } catch (error: unknown) {
      this.handleError(res, error, "list restaurant reviews");
    }
  }

  async getRestaurantReview(req: Request, res: Response) {
    try {
      const review = await this.reviewService.getRestaurantReview(
        req.params.restaurantId,
        req.params.reviewId
      );

      res.status(StatusCodes.OK).json(review);
    } catch (error: unknown) {
      this.handleError(res, error, "get restaurant review");
    }
  }

  async createOrderReviews(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      return;
    }

    try {
      const result = await this.reviewService.createOrderReviews(
        userId,
        req.params.orderId,
        req.body
      );

      res.status(StatusCodes.CREATED).json(result);
    } catch (error: unknown) {
      this.handleError(res, error, "create order reviews");
    }
  }

  async getOrderReviews(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      return;
    }

    try {
      const reviews = await this.reviewService.getOrderReviews(
        userId,
        req.params.orderId
      );

      res.status(StatusCodes.OK).json(reviews);
    } catch (error: unknown) {
      this.handleError(res, error, "get order reviews");
    }
  }

  private handleError(res: Response, error: unknown, context: string) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error(`Unexpected error during ${context}:`, error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
}
