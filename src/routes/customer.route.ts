import { z } from "zod";

import { CustomerController } from "@/controllers/customer.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

import { BaseRouter } from "./baseRouter";
import { roleMiddleware } from "@/middlewares/role.middleware";
import { Role } from "@/generated/prisma/browser";

export class CustomerRouter extends BaseRouter {
  private customerController: CustomerController;

  constructor() {
    super({
      prefix: "/customer",
      middleware: [authMiddleware, roleMiddleware(Role.customer, Role.admin)],
    });

    this.customerController = new CustomerController();
    this.setUpRoutes();
  }

  setUpRoutes() {
    this.router.get(
      "/profile",
      this.customerController.getCustomerProfile.bind(this.customerController)
    );
    this.router.patch(
      "/profile",
      this.customerController.updateCustomerProfile.bind(
        this.customerController
      )
    );
    this.router.get(
      "/allergy",
      this.customerController.getAllergy.bind(this.customerController)
    );
    this.router.post(
      "/allergy",
      this.customerController.updateAllergy.bind(this.customerController)
    );
    this.router.post(
      "/location",
      this.customerController.createLocation.bind(this.customerController)
    );
    this.router.get(
      "/location",
      this.customerController.getLocationsByCustomerId.bind(
        this.customerController
      )
    );
    this.router.get(
      "/location/default",
      this.customerController.getDefaultLocationByCustomerId.bind(
        this.customerController
      )
    );
  }
}
