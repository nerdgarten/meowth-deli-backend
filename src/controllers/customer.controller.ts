import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ICreateOrderRequest } from "@/types/user";
import CustomerService from "@/services/customer.service";
import { AppError } from "@/types/error";

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
  async createOrder(req: Request<any, any, ICreateOrderRequest>, res: Response) {
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
}