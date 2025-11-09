import { TestController } from "@/controllers/test.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { BaseRouter } from "@/routes/baseRouter";

export class TestRouter extends BaseRouter {
  private testController: TestController;

  constructor() {
    super({
      prefix: "/test",
      middleware: [authMiddleware],
    });

    this.testController = new TestController();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.router.post(
      "/middleware",
      this.testController.testMiddleware.bind(this.testController),
    );
    this.router.post(
      "/seed",
      this.testController.seedDatabase.bind(this.testController),
    );
  }
}
