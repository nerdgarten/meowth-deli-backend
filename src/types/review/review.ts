export interface BaseReviewPayload {
  rate: number | string;
  reviewText?: string;
  review_text?: string;
}

export interface CreateDriverReviewBody extends BaseReviewPayload {
  orderId: number | string;
}

export interface CreateRestaurantReviewBody extends BaseReviewPayload {
  orderId: number | string;
}

export interface CreateOrderReviewBody {
  driverReview?: BaseReviewPayload & {
    driverId?: number | string;
  };
  restaurantReview?: BaseReviewPayload & {
    restaurantId?: number | string;
  };
}

export interface ReviewPaginationQuery {
  limit?: string | string[];
  offset?: string | string[];
}
