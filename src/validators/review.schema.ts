import { title } from "process";
import { z } from "zod";

export const createRestaurantReviewBodySchema = z.object({
  customer_id: z.number().int().positive(),
  restaurant_id: z.number().int().positive(),
  rate: z
    .number()
    .int()
    .min(0, { message: "Rating must be at least 0" })
    .max(5, { message: "Rating must be at most 5" }),
  title: z.string().max(100),
  review_text: z.string().max(500).optional(),
  image: z.string().url().optional(),
});

export const createDriverReviewBodySchema = z.object({
  customer_id: z.number().int().positive(),
  driver_id: z.number().int().positive(),
  rate: z
    .number()
    .int()
    .min(0, { message: "Rating must be at least 0" })
    .max(5, { message: "Rating must be at most 5" }),
  title: z.string().max(100),
  review_text: z.string().max(500).optional(),
  image: z.string().url().optional(),
});
