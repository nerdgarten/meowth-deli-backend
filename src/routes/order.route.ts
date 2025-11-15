import { OrderController } from "@/controllers/order.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { BaseRouter } from "@/routes/baseRouter";
import { fileMiddleware } from "@/middlewares/file.middleware";
import {
  restaurantBannerConfig,
  certificateFileConfig,
} from "@/utils/fileConfig";
import { roleMiddleware } from "@/middlewares/role.middleware";
import { Role } from "@/generated/prisma/browser";

export class OrderRouter extends BaseRouter {
  private orderController: OrderController;

  constructor() {
    super({
      prefix: "/order",
    });

    this.orderController = new OrderController();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.router.get(
      "/customer",
      authMiddleware,
      this.orderController.getOrdersByCustomerId.bind(this.orderController)
    );
    this.router.get(
      "/restaurant",
      authMiddleware,
      this.orderController.getOrdersByRestaurantId.bind(this.orderController)
    );
    this.router.get(
      "/driver",
      authMiddleware,
      this.orderController.getOrdersByDriverId.bind(this.orderController)
    );
    this.router.get(
      "/:id",
      authMiddleware,
      this.orderController.getOrderById.bind(this.orderController)
    );
    this.router.post(
      "/",
      authMiddleware,
      roleMiddleware(Role.customer),
      this.orderController.createOrder.bind(this.orderController)
    );
  }
}
