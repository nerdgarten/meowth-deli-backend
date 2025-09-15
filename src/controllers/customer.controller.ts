import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { AppError } from "@/types/error";
import CustomerService from "@/services/customer.service";

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
    } catch(error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
  }

  async updateCustomerProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const data = await this.customerService.updateCustomerProfile(userId, req.body);

      res.status(StatusCodes.OK).json(data);
    } catch(error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
  }
}
