import { Dish, Order, OrderDish } from "@/generated/prisma/client";
import { ICustomerProfile } from "@/types/dto/customer";
import { IRestaurantProfile } from "@/types/dto/restaurant";
import { IDriverProfile } from "@/types/dto/driver";
import { GetLocationResponseDTO } from "@/types/dto/location";

export type CreateOrderRequestDTO = Omit<
  Order,
  "id" | "created_at" | "updated_at"
>;

export type CreateOrderResponseDTO = Order;

export type UpdateOrderRequestDTO = Omit<
  Order,
  "id" | "created_at" | "updated_at"
>;

export type GetOrderResponseDTO = Omit<
  Order,
  | "created_at"
  | "updated_at"
  | "customer_id"
  | "restaurant_id"
  | "driver_id"
  | "delivery_location_id"
> & {
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
