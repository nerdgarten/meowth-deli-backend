import { Location } from "@/generated/prisma/client";

export type CreateLocationRequestDTO = Omit<
  Location,
  "id" | "created_at" | "updated_at"
>;

export type CreateCustomerLocationResponseDTO = {
  customer_id: number;
  created_at: Date;
  updated_at: Date;
} & Location;

export type CreateRestaurantLocationResponseDTO = {
  restaurant_id: number;
  created_at: Date;
  updated_at: Date;
} & Location;

export type GetLocationResponseDTO = Omit<
  Location,
  "created_at" | "updated_at"
>;
