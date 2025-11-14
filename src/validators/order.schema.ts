import { z } from "zod";

export const OrderDishSchema = z.object({
  dish_id: z.number().positive("Dish ID must be positive"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  note: z.string().optional().max(255, "Note is too long"),
  name: z.string().optional(),
});

export const CreateOrderRequestSchema = z.object({
  location: z
    .string()
    .min(1, "Location is required")
    .max(255, "Location is too long"),
  note: z.string().optional().max(500, "Note is too long"),
  restaurant_id: z.number().positive("Restaurant ID must be positive"),
  dishes: z
    .array(OrderDishSchema)
    .min(1, "At least one dish is required")
    .max(20, "Maximum 20 dishes per order"),
  total_amount: z.number().optional(),
  driver_fee: z.number().optional(),
});
