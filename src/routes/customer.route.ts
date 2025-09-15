import { CustomerController } from "@/controllers/customer.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

import { BaseRouter } from "./baseRouter";

export class CustomerRouter extends BaseRouter {
  private customerController: CustomerController;

  constructor() {
    super({ prefix: "/customer", middleware: [authMiddleware] });

    this.customerController = new CustomerController();
    this.setUpRoutes();
  }

  setUpRoutes() {
    this.router.get(
      "/profile",
      this.customerController.getCustomerProfile.bind(this.customerController),
    );
    this.router.patch(
      "/profile",
      this.customerController.updateCustomerProfile.bind(
        this.customerController,
      ),
    );
  }
}
