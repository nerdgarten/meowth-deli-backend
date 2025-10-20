import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import CustomerService from "@/services/customer.service";
import { AppError } from "@/types/error";

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  async getCustomerProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await this.customerService.getCustomerProfile(userId);

      res.status(StatusCodes.OK).json(profile);
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

  async updateCustomerProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await this.customerService.updateCustomerProfile(
        userId,
        req.body,
      );

      res.status(StatusCodes.OK).json(data);
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
        status: status as string | undefined,
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
