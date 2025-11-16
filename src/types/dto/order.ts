import { Dish, Order, OrderDish } from "@/generated/prisma/client";
import { ICustomerProfile } from "@/types/dto/customer";
import { IDriverProfile } from "@/types/dto/driver";
import { GetLocationResponseDTO } from "@/types/dto/location";
import { IRestaurantProfile } from "@/types/dto/restaurant";

export type CreateOrderRequestDTO = Omit<
  Order,
  "id" | "created_at" | "updated_at"
>;

export type CreateOrderResponseDTO = Order;

export type UpdateOrderRequestDTO = Omit<
  Order,
  "id" | "created_at" | "updated_at"
>;

export type GetOrderResponseDTO = Omit<Order, "updated_at"> & {
  customer: ICustomerProfile;
  restaurant: IRestaurantProfile;
  driver: IDriverProfile | null;
  location: Omit<GetLocationResponseDTO, "id">;
  orderDishes: Array<
    Omit<OrderDish, "dish_id" | "created_at" | "updated_at" | "order_id"> & {
      dish: Pick<Dish, "id" | "name" | "detail" | "price" | "image">;
    }
  >;
  total_amount: number;
};
