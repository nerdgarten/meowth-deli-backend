import OrderService from "@/services/order.service";
import { handleError } from "@/utils/handleError";

import type { Request, Response } from "express";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(Number(id));
      res.status(200).json(order);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getOrdersByCustomerId(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const orders = await this.orderService.getOrdersByCustomerId(
        Number(userId)
      );
      res.status(200).json(orders);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getOrdersByRestaurantId(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const orders = await this.orderService.getOrdersByRestaurantId(
        Number(userId)
      );
      res.status(200).json(orders);
    } catch (error) {
      handleError(error, res);
    }
  }

  async getOrdersByDriverId(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const orders = await this.orderService.getOrdersByDriverId(
        Number(userId)
      );
      res.status(200).json(orders);
    } catch (error) {
      handleError(error, res);
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const newOrder = await this.orderService.createOrder({
        ...req.body,
        customer_id: Number(userId),
      });
      res.status(201).json(newOrder);
    } catch (error) {
      handleError(error, res);
    }
  }
}
