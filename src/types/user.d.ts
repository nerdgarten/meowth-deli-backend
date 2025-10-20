import { z } from "zod";
import { 
  Role, 
  OrderStatus, 
  PaymentType, 
  VerificationStatus 
} from "@prisma/client";

// Base User Interfaces
export interface IBaseUser {
  email: string;
  password: string;
  tel: string;
  accepted_term_of_service?: boolean;
  accepted_pdpa?: boolean;
  accepted_cookie_tracking?: boolean;
}

// Specific User Types
export interface ICustomer extends IBaseUser {
  id?: number;
  firstname: string;
  lastname: string;
  image?: string;
}

export interface IDriver extends IBaseUser {
  id?: number;
  firstname: string;
  lastname: string;
  vehicle: string;
  licence: string;
  fee_rate?: number;
  image?: string;
}

export interface IRestaurant extends IBaseUser {
  id?: number;
  name: string;
  location: string;
  detail?: string;
  fee_rate?: number;
  image?: string;
}

// Profile Types
export type ICustomerProfile = Pick<ICustomer, "firstname" | "lastname" | "tel" | "image">;
export type IDriverProfile = Pick<IDriver, "firstname" | "lastname" | "tel" | "vehicle" | "image">;
export type IRestaurantProfile = Pick<IRestaurant, "name" | "location" | "tel" | "image">;

// Order-related Interfaces
export interface IOrderDish {
  dish_id: number;
  quantity: number;
  note?: string;
  name?: string;
}

export interface ICreateOrderRequest {
  location: string;
  note?: string;
  restaurant_id: number;
  dishes: IOrderDish[];
  total_amount?: number;
  driver_fee?: number;
}

export interface ICreateOrderRepository {
  customerId: number;
  location: string;
  note?: string;
  restaurant_id: number;
  total_amount: number;
  driver_fee: number;
  dishes: IOrderDishRepository[];
}

export interface IOrderDishRepository {
  dishId: number;
  quantity: number;
  note?: string;
}

// Validation Schemas
export const OrderDishSchema = z.object({
  dish_id: z.number().positive("Dish ID must be positive"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  note: z.string().optional().max(255, "Note is too long"),
  name: z.string().optional()
});

export const CreateOrderRequestSchema = z.object({
  location: z.string().min(1, "Location is required").max(255, "Location is too long"),
  note: z.string().optional().max(500, "Note is too long"),
  restaurant_id: z.number().positive("Restaurant ID must be positive"),
  dishes: z.array(OrderDishSchema).min(1, "At least one dish is required").max(20, "Maximum 20 dishes per order"),
  total_amount: z.number().optional(),
  driver_fee: z.number().optional()
});
