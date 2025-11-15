import { Driver } from "@/generated/prisma/client";

export type IDriver = Omit<Driver, "is_deleted">;
export type IDriverProfile = Omit<
  Driver,
  "is_deleted" | "id" | "created_at" | "updated_at"
>;

export type UpdateDriverProfileRequestDTO = Pick<
  IDriver,
  "firstname" | "lastname" | "tel" | "image" | "licence" | "vehicle"
>;

export type GetDriverResponseDTO = IDriver;
