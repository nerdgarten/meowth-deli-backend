import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import ReviewService from "@/services/review.service";
import { handleError } from "@/utils/handleError";
import { resultingFilePath } from "@/utils/fileConfig";

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
    let filePath: string | undefined = undefined;
    if (req.file) filePath = resultingFilePath(req);

    try {
      const review = await this.reviewService.createDriverReview(userId, {
        ...req.body,
        image: filePath,
      });

      res.status(StatusCodes.CREATED).json(review);
    } catch (error: unknown) {
      handleError(error, res, "create driver review");
    }
  }

  async createRestaurantReview(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      return;
    }

    let filePath: string | undefined = undefined;
    if (req.file) filePath = resultingFilePath(req);

    try {
      const review = await this.reviewService.createRestaurantReview(userId, {
        ...req.body,
        image: filePath,
      });

      res.status(StatusCodes.CREATED).json(review);
    } catch (error: unknown) {
      handleError(error, res, "create restaurant review");
    }
  }

  async getRestaurantReviewsById(req: Request, res: Response) {
    try {
      const reviews = await this.reviewService.getRestaurantReviewsById(
        Number(req.params.restaurantId)
      );

      res.status(StatusCodes.OK).json(reviews);
    } catch (error: unknown) {
      handleError(error, res, "get restaurant reviews by id");
    }
  }

  async getDriverReviewsById(req: Request, res: Response) {
    try {
      const reviews = await this.reviewService.getDriverReviewsById(
        Number(req.params.driverId)
      );

      res.status(StatusCodes.OK).json(reviews);
    } catch (error: unknown) {
      handleError(error, res, "list driver reviews");
    }
  }

  async getDriverReviewByReviewId(req: Request, res: Response) {
    try {
      const review = await this.reviewService.getDriverReviewByReviewId(
        Number(req.params.reviewId)
      );

      res.status(StatusCodes.OK).json(review);
    } catch (error: unknown) {
      handleError(error, res, "get driver review");
    }
  }

  async getRestaurantReviewByReviewId(req: Request, res: Response) {
    try {
      const review = await this.reviewService.getRestaurantReviewByReviewId(
        Number(req.params.reviewId)
      );

      res.status(StatusCodes.OK).json(review);
    } catch (error: unknown) {
      handleError(error, res, "get restaurant review");
    }
  }
}
