export interface IBaseUser {
  email: string;
  password: string;
  tel: string;
  accepted_term_of_service?: boolean;
  accepted_pdpa?: boolean;
  accepted_cookie_tracking?: boolean;
}

export interface ICustomer extends IBaseUser {
  firstname: string;
  lastname: string;
}

export interface IDriver extends IBaseUser {
  firstname: string;
  lastname: string;
  vehicle: string;
  licence: string;
  fee_rate?: number;
}

export interface IRestaurant extends IBaseUser {
  name: string;
  location: string;
  detail?: string;
  fee_rate?: number;
}

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

// Payment interfaces
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