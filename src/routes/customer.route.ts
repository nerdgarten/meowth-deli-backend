import { z } from "zod";

import { CustomerController } from "@/controllers/customer.controller";
import { Role } from "@/generated/prisma/browser";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { fileMiddleware } from "@/middlewares/file.middleware";
import { roleMiddleware } from "@/middlewares/role.middleware";
import { profilePictureConfig } from "@/utils/fileConfig";

import { BaseRouter } from "./baseRouter";

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
      fileMiddleware(profilePictureConfig),
      this.customerController.updateCustomerProfile.bind(
        this.customerController
      )
    );
    this.router.get(
      "/allergy",
      this.customerController.getAllergy.bind(this.customerController)
    );
    this.router.put(
      "/allergy",
      this.customerController.updateAllergy.bind(this.customerController)
    );
  }
}
