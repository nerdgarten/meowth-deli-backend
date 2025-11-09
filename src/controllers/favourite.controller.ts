import FavouriteService from "@/services/favourite.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "@/types/error";

export class FavouriteController {
  private favouriteService: FavouriteService;

  constructor() {
    this.favouriteService = new FavouriteService();
  }

  async createFavouriteDish(req: Request, res: Response) {
    try {
      const { id } = req.user!;
      const dish = req.body;

      const createdFavouriteDish =
        await this.favouriteService.createFavouriteDish(dish.id, id);

      res.status(StatusCodes.OK).json(createdFavouriteDish);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during get driver orders:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }

  async createFavouriteRestaurant(req: Request, res: Response) {
    try {
      const { id } = req.user!;
      const restaurant = req.body;
      console.log(id, restaurant.id);

      const createFavouriteRestaurant =
        await this.favouriteService.createFavouriteRestaurant(
          restaurant.id,
          id
        );

      res.status(StatusCodes.OK).json(createFavouriteRestaurant);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });

        return;
      }
      console.error("Unexpected error during get driver orders:", error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
      });
    }
  }
    async getFavouriteDishes(req: Request, res: Response) {
        try {
            const { id } = req.user!;
            const favouriteDishes = await this.favouriteService.getFavouriteDishes(id);
            res.status(StatusCodes.OK).json(favouriteDishes);
        } catch (error: unknown) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });

            return;
        }
        console.error("Unexpected error during get driver orders:", error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
        });
        }
    }
    async getFavouriteRestaurants(req: Request, res: Response) {
        try {
            console.log("Getting favourite restaurants");
            const { id } = req.user!;
            const favouriteRestaurants = await this.favouriteService.getFavouriteRestaurants(id);
            res.status(StatusCodes.OK).json(favouriteRestaurants);
        } catch (error: unknown) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });

            return;
        }
        console.error("Unexpected error during get driver orders:", error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
        });
        }
    }
    async deleteFavouriteDish(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { id: userId } = req.user!;
            await this.favouriteService.deleteFavouriteDish(Number(id), userId);
            res.status(StatusCodes.OK).json({ message: "Favourite dish deleted successfully" });
        } catch (error: unknown) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });

            return;
        }
        console.error("Unexpected error during get driver orders:", error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
        });
        }
    }
    async deleteFavouriteRestaurant(req: Request, res: Response) {
        try {
          const { id } = req.params;
          const { id: userId } = req.user!;
          await this.favouriteService.deleteFavouriteRestaurant(
            Number(id),
            userId
          );
          res
            .status(StatusCodes.OK)
            .json({ message: "Favourite restaurant deleted successfully" });
        } catch (error: unknown) {
          if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });

            return;
          }
          console.error("Unexpected error during get driver orders:", error);

          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
          });
        }
    }
    async checkFavouriteDish(req: Request, res: Response) {
        try {
            const { dish_id } = req.params;
            const { id: userId } = req.user!;
            const favouriteDish = await this.favouriteService.checkFavouriteDish(Number(dish_id), userId);
            res.status(StatusCodes.OK).json(favouriteDish);
        } catch (error: unknown) {
          if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });

            return;
          }
          console.error("Unexpected error during get driver orders:", error);

          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
          });
        }
    }
    async checkFavouriteRestaurant(req: Request, res: Response) {
        try {
            const { restaurant_id } = req.params;
            const { id: userId } = req.user!;
            const favouriteRestaurant = await this.favouriteService.checkFavouriteRestaurant(Number(restaurant_id), userId);
            res.status(StatusCodes.OK).json(favouriteRestaurant);
        } catch (error: unknown) {
          if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });

            return;
          }
          console.error("Unexpected error during get driver orders:", error);

          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
          });
        }
    }
    async getFavouriteDishesByRestaurant(req: Request, res: Response) {
        try {
            const { restaurant_id } = req.params;
            const { id: userId } = req.user!;
            const favouriteDishes = await this.favouriteService.getFavouriteDishesByRestaurant(Number(restaurant_id), userId);
            res.status(StatusCodes.OK).json(favouriteDishes);
        } catch (error: unknown) {
          if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });

            return;
          }
          console.error("Unexpected error during get driver orders:", error);

          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
          });
        }
    }


}