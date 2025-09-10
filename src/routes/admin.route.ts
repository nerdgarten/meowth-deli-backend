import { Router } from "express";

import { AdminController } from "@/controllers/admin.controller";

export class AdminRouter {
  private router: Router;
  private controller: AdminController;

  constructor() {
    this.router = Router();
    this.controller = new AdminController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Restaurant verification routes
    this.router.get("/restaurants", this.controller.listRestaurants.bind(this.controller));
    this.router.patch("/restaurants/:id/verify", this.controller.verifyRestaurant.bind(this.controller));
    
    // Driver verification routes
    this.router.get("/drivers", this.controller.listDrivers.bind(this.controller));
    this.router.patch("/drivers/:id/verify", this.controller.verifyDriver.bind(this.controller));
    
  }

  public getRouter(): Router {
    return this.router;
  }
}


