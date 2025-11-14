import { Driver } from "@/generated/prisma/client";

export type IDriver = Omit<Driver, "is_deleted">;

export type UpdateDriverProfileRequestDTO = Pick<
  IDriver,
  "firstname" | "lastname" | "tel" | "image" | "licence" | "vehicle"
>;

export type GetRestaurantResponseDTO = IDriver;
