import { Restaurant } from "@/generated/prisma/client";

export type IRestaurant = Omit<Restaurant, "is_deleted">;
export type IRestaurantProfile = Omit<
  Restaurant,
  "is_deleted" | "id" | "created_at" | "updated_at"
>;

export type UpdateRestaurantProfileRequestDTO = Pick<
  IRestaurant,
  "name" | "detail" | "tel" | "banner"
>;

export type GetRestaurantResponseDTO = IRestaurant;
