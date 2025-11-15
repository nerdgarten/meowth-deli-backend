import { Dish } from "@/generated/prisma/client";

export type IDish = Omit<Dish, "id" | "created_at" | "updated_at">;
export type GetDishResponseDTO = IDish & { id: number };
export type CreateDishRequestDTO = IDish;
export type CreateDishResponseDTO = IDish;
export type UpdateDishRequestDTO = Partial<IDish>;
