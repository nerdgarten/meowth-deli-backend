import { CustomerController } from "@/controllers/customer.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { validateRequest } from "@/middlewares/validate.middleware";

import { BaseRouter } from "./baseRouter";
import { ICreateOrderRequest } from "@/types/user";
import { z } from "zod";

export class CustomerRouter extends BaseRouter {
  private customerController: CustomerController;

  constructor() {
    super({ prefix: "/customer"
      , middleware: [authMiddleware] 
    });

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
    /////
    this.router.get(
      "/my-orders-hist",
      this.customerController.getOrderHistory.bind(this.customerController)
    );
    this.router.get(
      "/my-orders-hist/statistics",
      this.customerController.getOrderStatistics.bind(this.customerController)
    );
    this.router.get(
      "/my-orders-hist/:orderId",
      this.customerController.getOrderById.bind(this.customerController)
    );
    this.router.get(
      "/my-orders-hist/:orderId/reorder",
      this.customerController.getReorderItems.bind(this.customerController)
    )
    //////
    const createOrderSchema = z.object({
      body: z.object({
        location: z.string().min(1, "Location is required"),
        note: z.string().optional(),
        restaurant_id: z.number().min(1, "Restaurant ID is required"),
        dishes: z.array(z.object({
          dish_id: z.number().min(1, "Dish ID is required"),
          quantity: z.number().min(1, "Quantity must be greater than 0"),
          note: z.string().optional()
        })).min(1, "At least one dish is required")
      }) satisfies z.ZodType<ICreateOrderRequest>
    });
    
    this.router.post(
      "/orders",
      validateRequest(createOrderSchema),
      this.customerController.createOrder.bind(this.customerController)
    )
    //////
    this.router.get(
      "/my-orders/:orderId/status",
      this.customerController.getOrderStatus.bind(this.customerController),
    );
    this.router.get(
      "/my-orders",
      this.customerController.getAllOrdersWithStatus.bind(this.customerController),
    );
    
    this.router.post(
      "/payment/mock",
      this.customerController.processMockPayment.bind(this.customerController),
    );

    this.router.get(
      "/allergies",
      this.customerController.getAllergies.bind(this.customerController)
    );

    this.router.post(
      "/allergies",
      this.customerController.updateAllergies.bind(this.customerController)
    );
  }
}
