import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ICreateOrderRequest } from "@/types/user";
import CustomerService from "@/services/customer.service";
import { AppError } from "@/types/error";
import { OrderStatus} from "@/generated/prisma/client";

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  // Error handling method
  private handleError(error: unknown, res: Response) {
    console.error(error); // Log the full error for internal tracking

    if (error instanceof AppError) {
      res.status(error.statusCode).json({ 
        message: error.message 
      });
    } else if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Unexpected error occurred"
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "An unexpected error occurred"
      });
    }
  }

  // Get Customer Profile
  async getCustomerProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await this.customerService.getCustomerProfile(userId);

      res.status(StatusCodes.OK).json(profile);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // Update Customer Profile
  async updateCustomerProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await this.customerService.updateCustomerProfile(
        userId,
        req.body,
      );

      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // Create Order
  async createOrder(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const order = await this.customerService.createOrder(userId, req.body);

      res.status(StatusCodes.CREATED).json({
        message: "Order created successfully",
        order
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }
  async getOrderStatus(req: Request, res: Response) {
    try {
      const customerId = req.user!.id;
      const orderId = parseInt(req.params.orderId);
      
      if (isNaN(orderId)) {
        res.status(StatusCodes.BAD_REQUEST).json({ 
          message: "Invalid order ID" 
        });
        return;
      }
      
      const orderStatus = await this.customerService.getOrderStatus(
        customerId,
        orderId
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: orderStatus
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  // View all orders with their status
  async getAllOrdersWithStatus(req: Request, res: Response) {
    try {
      const customerId = req.user!.id;
      const { status } = req.query;
      
      const orders = await this.customerService.getAllOrdersWithStatus(
        customerId,
        status as OrderStatus
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: orders
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  // Mock payment endpoint
  async processMockPayment(req: Request, res: Response) {
    try {
      const customerId = req.user!.id;
      const { orderId, amount, paymentMethod } = req.body;

      if (!orderId || !amount) {
        res.status(StatusCodes.BAD_REQUEST).json({ 
          message: "Order ID and amount are required" 
        });
        return;
      }

      const paymentResult = await this.customerService.processMockPayment(
        customerId,
        orderId,
        {
          amount,
          paymentMethod: paymentMethod || "creditcard",
        }
      );

      res.status(StatusCodes.OK).json({
        success: paymentResult.success,
        data: paymentResult
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }
  async getOrderHistory(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { page, limit, status, sortBy, sortOrder } = req.query;

      const options = {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as OrderStatus | undefined,
        sortBy: sortBy as "created_at" | "total_amount" | undefined,
        sortOrder: sortOrder as "asc" | "desc" | undefined,
      };

      const orderHistory = await this.customerService.getCustomerOrderHistory(
        userId,
        options
      );

      res.status(StatusCodes.OK).json(orderHistory);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const orderId = parseInt(req.params.orderId);

      if (isNaN(orderId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid order ID" });
        return;
      }

      const order = await this.customerService.getCustomerOrderById(
        userId,
        orderId
      );

      res.status(StatusCodes.OK).json(order);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async getOrderStatistics(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const statistics = await this.customerService.getOrderStatistics(userId);

      res.status(StatusCodes.OK).json(statistics);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async getReorderItems(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const orderId = parseInt(req.params.orderId);

      if (isNaN(orderId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid order ID" });
        return;
      }

      const items = await this.customerService.getReorderItems(
        userId,
        orderId
      );

      res.status(StatusCodes.OK).json(items);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }
}
