import { z } from "zod";

import { Allergy } from "@/generated/prisma/enums";

export const DishUpdateSchema = z.object({
  name: z.string().min(1, "Dish name cannot be empty").optional(),
  detail: z.string().optional(),
  price: z.number().positive("Price must be greater than zero").optional(),
  is_out_of_stock: z.boolean().optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  allergy: z.array(z.nativeEnum(Allergy)).optional(),
});

export const DishBodySchema = z.object({
  restaurant_id: z.number(),
  name: z.string().min(1, "Dish name cannot be empty"),
  detail: z.string().max(255, "Detail is too long").optional(),
  price: z.number().positive("Price must be greater than zero"),
  is_out_of_stock: z.boolean().optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  allergy: z.array(z.nativeEnum(Allergy)).optional(),
});
