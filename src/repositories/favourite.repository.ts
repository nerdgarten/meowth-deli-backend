import { prisma } from "@/libs/prisma";
import { IFavouriteDish, IFavouriteRestaurant } from "@/types/favourite";
export default class FavouriteRepository {
  createFavouriteDish(data: {
    user_id: number;
    dish_id: number;
  }): Promise<IFavouriteDish> {
    return prisma.favoriteDish.create({
      data: {
        customer_id: data.user_id,
        dish_id: data.dish_id,
      },
    });
  }

  createFavouriteRestaurant(data: {
    user_id: number;
    restaurant_id: number;
  }): Promise<IFavouriteRestaurant> {
    return prisma.favoriteRestaurant.create({
      data: {
        customer_id: data.user_id,
        restaurant_id: data.restaurant_id,
      },
    });
  }
  getFavouriteDishesByUserId(user_id: number): Promise<IFavouriteDish[]> {
    return prisma.favoriteDish.findMany({
      where: {
        customer_id: user_id,
      },
      include: {
        dish: true,
      },
    });
  }
  getFavouriteRestaurantsByUserId(
    user_id: number
  ): Promise<IFavouriteRestaurant[]> {
    return prisma.favoriteRestaurant.findMany({
      where: {
        customer_id: user_id,
      },
      include: {
        restaurant: true,
      },
    });
  }
  findFavouriteDishByDishAndUserId(
    dish_id: number,
    customer_id: number
  ): Promise<IFavouriteDish | null> {
    return prisma.favoriteDish.findFirst({
      where: {
        dish_id,
        customer_id,
      },
    });
  }
  findFavouriteRestaurantByRestaurantAndUserId(
    restaurant_id: number,
    customer_id: number
  ): Promise<IFavouriteRestaurant | null> {
    return prisma.favoriteRestaurant.findFirst({
      where: {
        restaurant_id,
        customer_id,
      },
    });
  }
  deleteFavouriteDish(fav: IFavouriteDish): Promise<void> {
    return prisma.favoriteDish
      .delete({
        where: {
          customer_id_dish_id: {
            customer_id: fav.customer_id,
            dish_id: fav.dish_id,
          },
        },
      })
      .then(() => {});
  }
  deleteFavouriteRestaurant(fav: IFavouriteRestaurant): Promise<void> {
    return prisma.favoriteRestaurant
      .delete({
        where: {
          customer_id_restaurant_id: {
            customer_id: fav.customer_id,
            restaurant_id: fav.restaurant_id,
          },
        },
      })
      .then(() => {});
    }
}
