import { StatusCodes } from "http-status-codes";

import CustomerRepository from "@/repositories/customer.repository";
import { AppError } from "@/types/error";
import { ICustomer, IDriver, IRestaurant } from "@/types/user";
import {MockPaymentResult, PaymentRequest, OrderStatusInfo} from "@/types/order"
import { OrderStatus } from "@/generated/prisma/client";

export default class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async getCustomerProfile(userId: number) {
    const profile = await this.customerRepository.getCustomerProfile(userId);
    if (!profile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return profile;
  }

  async updateCustomerProfile(userId: number, data: Partial<ICustomer>) {
    const updatedProfile = await this.customerRepository.updateCustomerProfile(
      userId,
      data
    );
    if (!updatedProfile) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return updatedProfile;
  }
  async getOrderStatus(customerId: number, orderId: number): Promise<OrderStatusInfo> {
    const order = await this.customerRepository.getOrderWithDetails(orderId, customerId);

    if (!order) {
      throw new AppError("Order not found or access denied", StatusCodes.NOT_FOUND);
    }

    // Map status to user-friendly description
    const statusDescription = this.getStatusDescription(order.status);

    // Handle items from orderDishes relation with dish
    const items = order.orderDishes?.map((orderDish: any) => ({
      name: orderDish.dish?.name || 'Unknown Item',
      quantity: orderDish.amount, // Using 'amount' field from OrderDish
      price: orderDish.dish?.price || 0,
    }));

    // Get restaurant info from the first dish
    const restaurantName = order.orderDishes?.[0]?.dish?.restaurant?.name || 'Restaurant';

    return {
      orderId: order.id,
      currentStatus: order.status,
      statusDescription: statusDescription,
      restaurantName: restaurantName,
      orderDate: order.created_at,
      lastUpdatedAt: order.updated_at,
      estimatedDeliveryTime: undefined, // Add this field to your Order model if needed
      totalAmount: order.total_amount,
      items: items,
      trackingInfo: this.getTrackingInfo(order),
    };
  }

  // Get all orders with their status (with optional filter)
  async getAllOrdersWithStatus(customerId: number, statusFilter?: string) {
    const orders = await this.customerRepository.getCustomerOrders(
      customerId,
      statusFilter
    );

    return orders.map(order => ({
      orderId: order.id,
      currentStatus: order.status,
      statusDescription: this.getStatusDescription(order.status),
      restaurantName: 'Restaurant', // Add restaurant relation if needed
      totalAmount: order.total_amount,
      orderDate: order.created_at,
      lastUpdatedAt: order.updated_at,
      estimatedDeliveryTime: undefined,
      itemCount: order._count?.orderDishes || 0,
    }));
  }

  // Mock payment processor
  async processMockPayment(
    customerId: number,
    orderId: number,
    paymentRequest: PaymentRequest
  ): Promise<MockPaymentResult> {
    // Verify the order belongs to the customer
    const order = await this.customerRepository.getOrderWithDetails(orderId, customerId);

    if (!order) {
      throw new AppError("Order not found or access denied", StatusCodes.NOT_FOUND);
    }

    // Only allow payment for pending orders
    if (order.status !== OrderStatus.pending) {
      throw new AppError(
        `Cannot process payment for order with status: ${order.status}`,
        StatusCodes.BAD_REQUEST
      );
    }

    // Simulate payment processing
    const paymentResult = await this.simulatePaymentGateway(paymentRequest);

    if (paymentResult.success) {
      // Create payment record with success status
      await this.customerRepository.createPayment({
        order_id: orderId,
        payment_method_id: 1, // Default payment method ID, adjust as needed
        status: "COMPLETED" as any, // Cast to match your Prisma $Enums.VerificationStatus
        image: null,
      });

      // Update order status to success after successful payment
      await this.customerRepository.updateOrderStatus(
        orderId,
        OrderStatus.success
      );

      // Simulate restaurant preparing after confirmation (optional)
      setTimeout(async () => {
        await this.customerRepository.updateOrderStatus(
          orderId,
          OrderStatus.preparing
        );
      }, 5000);

      return {
        ...paymentResult,
        orderId: orderId,
        newOrderStatus: OrderStatus.success,
      };
    } else {
      // Create payment record with failed status
      await this.customerRepository.createPayment({
        order_id: orderId,
        payment_method_id: 1, // Default payment method ID
        status: "FAILED" as any, // Cast to match your Prisma $Enums.VerificationStatus
        image: null,
      });
    }

    return paymentResult;
  }

  // Private helper methods
  private getStatusDescription(status: string): string {
    const descriptions: Record<string, string> = {
      [OrderStatus.pending]: "Your order is awaiting payment",
      [OrderStatus.success]: "Restaurant has success your order",
      [OrderStatus.preparing]: "Your order is being prepared",
      [OrderStatus.delivered]: "Your order has been delivered",
      [OrderStatus.rejected]: "Your order has been rejected",
    };

    return descriptions[status] || "Unknown status";
  }

  private getTrackingInfo(order: any) {
    if (order.status === OrderStatus.delivered && order.driver) {
      return {
        driverName: `${order.driver.firstname} ${order.driver.lastname}`,
        driverPhone: order.driver.tel,
        estimatedArrival: undefined, // Add estimated time if available
      };
    }
    return undefined;
  }
