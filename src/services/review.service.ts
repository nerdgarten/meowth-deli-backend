import { StatusCodes } from "http-status-codes";

import ReviewRepository from "@/repositories/review.repository";
import { AppError } from "@/types/error";
import {
  CreateDriverReviewRequestDTO,
  CreateDriverReviewResponseDTO,
  CreateRestaurantReviewRequestDTO,
  CreateRestaurantReviewResponseDTO,
  GetRestaurantReviewResponseDTO,
} from "@/types/review/review";
import {
  createRestaurantReviewBodySchema,
  createDriverReviewBodySchema,
} from "@/validators/review.schema";
import DriverRepository from "@/repositories/driver.repository";
import RestaurantRepository from "@/repositories/restaurant.repository";
import CustomerRepository from "@/repositories/customer.repository";

export default class ReviewService {
  private reviewRepository: ReviewRepository;
  private driverRepository: DriverRepository;
  private restaurantRepository: RestaurantRepository;
  private customerRepository: CustomerRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
    this.driverRepository = new DriverRepository();
    this.restaurantRepository = new RestaurantRepository();
    this.customerRepository = new CustomerRepository();
  }

  async createDriverReview(
    userId: number,
    body: CreateDriverReviewRequestDTO
  ): Promise<CreateDriverReviewResponseDTO> {
    const dto = createDriverReviewBodySchema.parse({
      ...body,
      customer_id: Number(body.customer_id),
      driver_id: Number(body.driver_id),
      rate: Number(body.rate),
    });

    const customer = await this.customerRepository.getCustomerProfileById(
      dto.customer_id
    );
    if (!customer) {
      throw new AppError("Customer not found", StatusCodes.NOT_FOUND);
    }

    const driver = await this.driverRepository.getDriverProfileById(
      dto.driver_id
    );
    if (!driver) {
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
    }

    const data = await this.reviewRepository.createDriverReview({
      title: dto.title,
      customer: { connect: { id: dto.customer_id } },
      driver: { connect: { id: dto.driver_id } },
      rate: dto.rate,
      review_text: dto.review_text,
      image: dto.image ?? undefined,
    });

    return {
      id: data.id,
      title: data.title,
      customer_id: data.customer_id,
      driver_id: data.driver_id,
      customer: {
        id: data.customer.id,
        firstname: data.customer.firstname,
        lastname: data.customer.lastname,
        image: data.customer.image ?? undefined,
        tel: data.customer.tel,
      },
      driver: {
        id: data.driver.id,
        firstname: data.driver.firstname,
        lastname: data.driver.lastname,
        image: data.driver.image ?? undefined,
        tel: data.driver.tel ?? undefined,
      },
      rate: data.rate,
      review_text: data.review_text ?? undefined,
      image: data.image ?? undefined,
    };
  }

  async createRestaurantReview(
    userId: number,
    body: CreateRestaurantReviewRequestDTO
  ): Promise<CreateRestaurantReviewResponseDTO> {
    const dto = createRestaurantReviewBodySchema.parse({
      ...body,
      customer_id: Number(body.customer_id),
      restaurant_id: Number(body.restaurant_id),
      rate: Number(body.rate),
    });

    const customer = await this.customerRepository.getCustomerProfileById(
      dto.customer_id
    );
    if (!customer) {
      throw new AppError("Customer not found", StatusCodes.NOT_FOUND);
    }

    const restaurant = await this.restaurantRepository.getRestaurantProfileById(
      dto.restaurant_id
    );
    if (!restaurant) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }

    const data = await this.reviewRepository.createRestaurantReview({
      title: dto.title,
      customer: { connect: { id: dto.customer_id } },
      restaurant: { connect: { id: dto.restaurant_id } },
      rate: dto.rate,
      review_text: dto.review_text,
      image: dto.image ?? null,
    });

    return {
      id: data.id,
      title: data.title,
      customer_id: data.customer_id,
      restaurant_id: data.restaurant_id,
      customer: {
        id: data.customer.id,
        firstname: data.customer.firstname,
        lastname: data.customer.lastname,
        image: data.customer.image ?? undefined,
        tel: data.customer.tel,
      },
      restaurant: {
        id: data.restaurant.id,
        name: data.restaurant.name,
        banner: data.restaurant.banner ?? undefined,
        tel: data.restaurant.tel ?? undefined,
      },
      rate: data.rate,
      review_text: data.review_text ?? undefined,
      image: data.image ?? undefined,
    };
  }

  async getRestaurantReviewsById(
    restaurantId: number
  ): Promise<GetRestaurantReviewResponseDTO[]> {
    const restaurant =
      await this.restaurantRepository.getRestaurantProfileById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }
    const reviews =
      await this.reviewRepository.getRestaurantReviewsById(restaurantId);

    return reviews.map((data) => ({
      id: data.id,
      title: data.title,
      customer_id: data.customer_id,
      restaurant_id: data.restaurant_id,
      customer: {
        id: data.customer.id,
        firstname: data.customer.firstname,
        lastname: data.customer.lastname,
        image: data.customer.image ?? undefined,
        tel: data.customer.tel,
      },
      restaurant: {
        id: data.restaurant.id,
        name: data.restaurant.name,
        banner: data.restaurant.banner ?? undefined,
        tel: data.restaurant.tel ?? undefined,
      },
      rate: data.rate,
      review_text: data.review_text ?? undefined,
      image: data.image ?? undefined,
    }));
  }

  async getDriverReviewsById(
    driverId: number
  ): Promise<CreateDriverReviewResponseDTO[]> {
    const driver = await this.driverRepository.getDriverProfileById(driverId);
    if (!driver) {
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
    }
    const reviews = await this.reviewRepository.getDriverReviewsById(driverId);

    return reviews.map((data) => ({
      id: data.id,
      title: data.title,
      customer_id: data.customer_id,
      driver_id: data.driver_id,
      customer: {
        id: data.customer.id,
        firstname: data.customer.firstname,
        lastname: data.customer.lastname,
        image: data.customer.image ?? undefined,
        tel: data.customer.tel,
      },
      driver: {
        id: data.driver.id,
        firstname: data.driver.firstname,
        lastname: data.driver.lastname,
        image: data.driver.image ?? undefined,
        tel: data.driver.tel ?? undefined,
      },
      rate: data.rate,
      review_text: data.review_text ?? undefined,
      image: data.image ?? undefined,
    }));
  }

  async getRestaurantReviewByReviewId(
    reviewId: number
  ): Promise<GetRestaurantReviewResponseDTO> {
    const data =
      await this.reviewRepository.getRestaurantReviewByReviewId(reviewId);
    if (!data) throw new AppError("Review not found", StatusCodes.NOT_FOUND);
    return {
      id: data.id,
      title: data.title,
      customer_id: data.customer_id,
      restaurant_id: data.restaurant_id,
      customer: {
        id: data.customer.id,
        firstname: data.customer.firstname,
        lastname: data.customer.lastname,
        image: data.customer.image ?? undefined,
        tel: data.customer.tel,
      },
      restaurant: {
        id: data.restaurant.id,
        name: data.restaurant.name,
        banner: data.restaurant.banner ?? undefined,
        tel: data.restaurant.tel ?? undefined,
      },
      rate: data.rate,
      review_text: data.review_text ?? undefined,
      image: data.image ?? undefined,
    };
  }

  async getDriverReviewByReviewId(
    reviewId: number
  ): Promise<CreateDriverReviewResponseDTO> {
    const data =
      await this.reviewRepository.getDriverReviewByReviewId(reviewId);
    if (!data) {
      throw new AppError("Review not found", StatusCodes.NOT_FOUND);
    }
    return {
      id: data.id,
      title: data.title,
      customer_id: data.customer_id,
      driver_id: data.driver_id,
      customer: {
        id: data.customer.id,
        firstname: data.customer.firstname,
        lastname: data.customer.lastname,
        image: data.customer.image ?? undefined,
        tel: data.customer.tel,
      },
      driver: {
        id: data.driver.id,
        firstname: data.driver.firstname,
        lastname: data.driver.lastname,
        image: data.driver.image ?? undefined,
        tel: data.driver.tel ?? undefined,
      },
      rate: data.rate,
      review_text: data.review_text ?? undefined,
      image: data.image ?? undefined,
    };
  }
}
