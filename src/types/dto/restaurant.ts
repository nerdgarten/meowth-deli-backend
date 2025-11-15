import { Restaurant } from "@/generated/prisma/client";

export type IRestaurant = Omit<Restaurant, "is_deleted">;
export type IRestaurantProfile = Pick<
  Restaurant,
  "name" | "detail" | "tel" | "banner"
>;

export type UpdateRestaurantProfileRequestDTO = Pick<
  IRestaurant,
  "name" | "detail" | "tel" | "banner"
>;

export type GetRestaurantResponseDTO = IRestaurant;
