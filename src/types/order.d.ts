import { OrderStatus } from "@/generated/prisma/enums";

export interface OrderStatusInfo {
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

export interface PaymentRequest {
  amount: number;
  paymentMethod: PaymentType;
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
