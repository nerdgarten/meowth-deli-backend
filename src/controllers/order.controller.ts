import OrderService from "@/services/order.service";
import { handleError } from "@/utils/handleError";

export class AuthController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  // async
}
