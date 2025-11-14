import { OrderStatus } from "@/generated/prisma/enums";
import { ILocation } from "@/types/location";

import { ICustomerProfile } from "@/types/users/customer";
import { IDriverProfile } from "@/types/users/driver";
import { IRestaurantProfile } from "@/types/users/restaurant";

export interface OrderDishBody {
  dish_id: number;
  amount: number;
  remark?: string;
}

export interface IOrder {
  id: number;
  delivery_location_id: number;
  total_amount: number;
  driver_fee: number;
  status: OrderStatus;
  remark?: string | null;
  created_at: Date;
  updated_at: Date;
  order_dishes: IOrderDish[];
}

export interface IOrderJoined extends IOrder {
  customer: ICustomerProfile;
  restaurant: IRestaurantProfile;
  driver?: IDriverProfile | null;
  location: ILocation;
}

export interface OrderCreateBody {
  customer_id: number;
  restaurant_id: number;
  delivery_location_id: number;
  total_amount: number;
  driver_fee: number;
  driver_id?: number | null;
  status?: OrderStatus;
  remark?: string | null;
  order_dishes: IOrderDishRepository[];
}

export interface IOrderStatusInfo {
  orderId: number;
  currentStatus: OrderStatus;
  statusDescription: string;
  restaurantName?: string;
  orderDate: Date;
  lastUpdatedAt: Date;
  estimatedDeliveryTime?: Date;
  totalAmount: number;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  trackingInfo?: {
    driverName?: string;
    driverPhone?: string;
    estimatedArrival?: Date;
  };
}

export interface MockPaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  timestamp: Date;
  orderId?: number;
  newOrderStatus?: string;
}

export interface OrderDishWithRestaurant {
  amount: number;
  remark?: string | null;
  dish: {
    id: number;
    name: string;
    detail: string | null;
    price: number;
    allergy: string[];
    is_out_of_stock: boolean;
    restaurant: {
      id: number;
      name: string;
      location: string;
    };
  };
}

// Order-related Interfaces
export interface IOrderDish {
  dish_id: number;
  amount: number;
  remark?: string | null;
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

export interface OrderWhereClause {
  id?: number;
  driver_id?: number;
  status?: OrderStatus;
}

export { OrderStatus };
