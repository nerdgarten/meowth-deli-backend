import axios from "axios";
import { StatusCodes } from "http-status-codes";

import {
  OrderStatus,
  VerificationStatus,
  type Order,
} from "@/generated/prisma/client";
import { prisma } from "@/libs/prisma";
import CustomerRepository from "@/repositories/customer.repository";
import { Allergy } from "@/types/allergy";
import {
  GetCustomerResponseDTO,
  UpdateCustomerProfileRequestDTO,
} from "@/types/dto/customer";
import { AppError } from "@/types/error";
import {
  allergyUpdateSchema,
  customerUpdateProfileSchema,
} from "@/validators/profile.schema";

export default class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async getCustomers(): Promise<GetCustomerResponseDTO[]> {
    return await this.customerRepository.getCustomers();
  }

  async getCustomerProfileById(userId: number) {
    const data = await this.customerRepository.getCustomerProfileById(userId);
    if (!data) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return data;
  }

  async updateCustomerProfileById(
    userId: number,
    body: UpdateCustomerProfileRequestDTO
  ) {
    const dto = customerUpdateProfileSchema.parse(body);
    const data = await this.customerRepository.updateCustomerProfileById(
      userId,
      dto
    );
    if (!data) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }

    return data;
  }

  async getAllergies(userId: number): Promise<Allergy[]> {
    const result = await this.customerRepository.getAllergies(userId);
    if (!result) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }
    return result.allergy ?? [];
  }

  async updateAllergies(
    userId: number,
    allergies: Allergy[]
  ): Promise<Allergy[]> {
    const validAllergies = allergyUpdateSchema.parse({ allergies }).allergies;
    const data = await this.customerRepository.updateAllergies(
      userId,
      validAllergies
    );
    if (!data) {
      throw new AppError("Profile not found", StatusCodes.NOT_FOUND);
    }
    return data.allergy;
  }

  async processMockPayment(
    userId: number,
    orderId: number,
    amount: number,
    paymentMethod: string
  ) {
    // Map payment method to PaymentType
    let paymentType: string;
    switch (paymentMethod) {
      case "cash":
        paymentType = "cash";
        break;
      case "mobilebanking":
        paymentType = "mobilebanking";
        break;
      case "creditcard":
        paymentType = "creditcard";
        break;
      case "meowth-wallet":
        paymentType = "meowth-wallet";
        break;
      default:
        throw new AppError("Invalid payment method", StatusCodes.BAD_REQUEST);
    }

    // Call mock payment service
    try {
      const response = await axios.post(
        `${process.env.MOCK_PAYMENT_SERVICE_URL}/process-payment`,
        {
          type: paymentType,
          amount: amount,
          order_id: orderId.toString(),
        }
      );

      if (response.data.success) {
        // Update order status to paid
        const orderRepository = (
          await import("@/repositories/order.respository")
        ).default;
        const orderRepo = new orderRepository();
        await orderRepo.updateOrderStatus(orderId, "success");

        return {
          success: true,
          transactionId: response.data.transaction_id,
          message: response.data.message,
          orderId: orderId,
          newOrderStatus: "success",
          timestamp: new Date(),
        };
      } else {
        throw new AppError(
          response.data.message || "Payment failed",
          StatusCodes.BAD_REQUEST
        );
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new AppError(
          error.response.data.message,
          StatusCodes.BAD_REQUEST
        );
      }
      throw new AppError(
        "Payment service unavailable",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getWalletBalance(userId: number) {
    // Call mock payment service to get wallet balance
    try {
      const response = await axios.get(
        `${process.env.MOCK_PAYMENT_SERVICE_URL}/accounts/meowth-wallet`
      );

      return response.data.balance;
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      throw new AppError(
        "Payment service unavailable",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
