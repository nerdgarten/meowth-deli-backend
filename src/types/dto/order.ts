import { Dish, Order, OrderDish } from "@/generated/prisma/client";

export type CreateOrderRequestDTO = Omit<
  Order,
  "id" | "created_at" | "updated_at"
>;

export type CreateOrderResponseDTO = Order;

export type UpdateOrderRequestDTO = Omit<
  Order,
  "id" | "created_at" | "updated_at"
>;

export type GetOrderResponseDTO = Order & {
  order_dishes: Array<
    OrderDish & {
      dish: Dish;
    }
  >;
};
