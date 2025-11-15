import { OrderStatus } from "@/generated/prisma/enums";
import { z } from "zod";

export const OrderDishSchema = z.object({
  dish_id: z.number().positive("Dish ID must be positive"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  note: z.string().max(255, "Note is too long").optional(),
  name: z.string().optional(),
});

export const CreateOrderRequestSchema = z.object({
  customer_id: z.number().positive("Customer ID must be positive"),
  driver_id: z.number().positive("Driver ID must be positive"),
  location_id: z.number().positive("Location ID must be positive"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(255, "Location is too long"),
  remark: z.string().max(500, "Remark is too long").optional(),
  restaurant_id: z.number().positive("Restaurant ID must be positive"),
  dishes: z
    .array(OrderDishSchema)
    .min(1, "At least one dish is required")
    .max(20, "Maximum 20 dishes per order"),
  total_amount: z.number(),
  driver_fee: z.number(),
  status: z.enum(OrderStatus),
});
