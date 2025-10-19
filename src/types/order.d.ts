export type ICustomerProfile = Pick<ICustomer, "firstname", "lastname", "tel">;
export interface OrderStatusInfo {
  orderId: number;
  currentStatus: string;
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
  paymentMethod: string;
}

export interface MockPaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  timestamp: Date;
  orderId?: number;
  newOrderStatus?: string;
}