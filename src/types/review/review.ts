export interface BaseReviewPayload {
  title: string;
  rate: number | string;
  reviewText?: string;
  review_text?: string;
}

export interface CreateDriverReviewBody extends BaseReviewPayload {
  driverId: number;
  orderId: number;
}

export interface CreateRestaurantReviewBody extends BaseReviewPayload {
  restaurantId: number;
  orderId: number;
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
