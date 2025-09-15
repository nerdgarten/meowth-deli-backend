import { ProfileController } from "@/controllers/profile.controller";

import { BaseRouter } from "./baseRouter";

export class ProfileRouter extends BaseRouter {
  private profileController: ProfileController;

  constructor() {
    super({ prefix: "/profile" });

    this.profileController = new ProfileController();
    this.setUpRoutes();
  }

  private setUpRoutes() {
    this.router.patch(
      "/update/:id",
      this.profileController.updateCustomerProfile.bind(this.profileController),
    );
    this.router.patch(
      "/update/:id",
      this.profileController.updateRestaurantProfile.bind(
        this.profileController,
      ),
    );
    this.router.patch(
      "/update/:id",
      this.profileController.updateDriverProfile.bind(this.profileController),
    );
  }
}
