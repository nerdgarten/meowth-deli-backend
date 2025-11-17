export interface BaseReviewPayload {
  title: string;
  customer_id: number;
  order_id: number;
  rate: number;
  review_text?: string;
  image?: string;
}

export interface CreateRestaurantReviewRequestDTO extends BaseReviewPayload {
  restaurant_id: number;
}

export interface CreateDriverReviewRequestDTO extends BaseReviewPayload {
  driver_id: number;
}

export interface CreateRestaurantReviewResponseDTO extends BaseReviewPayload {
  id: number;
  restaurant_id: number;
  order_id: number;
  restaurant: {
    id: number;
    name: string;
    banner?: string;
    tel: string;
  };
  customer: {
    id: number;
    firstname: string;
    lastname: string;
    image?: string;
    tel: string;
  };
}

export interface CreateDriverReviewResponseDTO extends BaseReviewPayload {
  id: number;
  driver_id: number;
  order_id: number;
  driver: {
    id: number;
    firstname: string;
    lastname: string;
    image?: string;
    tel?: string;
  };
  customer: {
    id: number;
    firstname: string;
    lastname: string;
    image?: string;
    tel: string;
  };
}

export interface GetRestaurantReviewResponseDTO {
  id: number;
  title: string;
  customer_id: number;
  restaurant_id: number;
  order_id: number;
  rate: number;
  review_text?: string;
  image?: string;
  restaurant: {
    id: number;
    name: string;
    banner?: string;
    tel: string;
  };
  customer: {
    id: number;
    firstname: string;
    lastname: string;
    image?: string;
    tel: string;
  };
}

export interface GetDriverReviewResponseDTO {
  id: number;
  title: string;
  customer_id: number;
  driver_id: number;
  order_id: number;
  rate: number;
  review_text?: string;
  image?: string;
  driver: {
    id: number;
    firstname: string;
    lastname: string;
    image?: string;
    tel?: string;
  };
  customer: {
    id: number;
    firstname: string;
    lastname: string;
    image?: string;
    tel: string;
  };
}
