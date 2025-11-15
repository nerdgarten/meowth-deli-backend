import { Restaurant } from "@/generated/prisma/client";

export type IRestaurant = Omit<Restaurant, "is_deleted">;

export type UpdateRestaurantProfileRequestDTO = Pick<
  IRestaurant,
  "name" | "detail" | "tel" | "banner"
>;

export type GetRestaurantResponseDTO = IRestaurant;
