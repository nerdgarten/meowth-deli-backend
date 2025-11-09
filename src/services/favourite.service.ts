import FavouriteRepository from "@/repositories/favourite.repository";
import CustomerRepository from "@/repositories/customer.repository";
import DishRepository from "@/repositories/dish.repository";
import RestaurantRepository from "@/repositories/restaurant.repository";
import { AppError } from "@/types/error";
import { StatusCodes } from "http-status-codes";
export default class FavouriteService {
  private favouriteRepository: FavouriteRepository;
  private customerRepository: CustomerRepository;
  private dishRepository: DishRepository;
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.favouriteRepository = new FavouriteRepository();
    this.customerRepository = new CustomerRepository();
    this.dishRepository = new DishRepository();
    this.restaurantRepository = new RestaurantRepository();
  }

  async createFavouriteDish(dish_id: number, user_id: number) {
    const user = await this.customerRepository.getCustomerProfile(user_id);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    const dish = await this.dishRepository.findDishById(dish_id);
    if (!dish) {
      throw new AppError("Dish not found", StatusCodes.NOT_FOUND);
    }
    const createdFavouriteDish = await this.favouriteRepository.createFavouriteDish({ user_id, dish_id });
    return createdFavouriteDish;
  }

  async createFavouriteRestaurant(restaurant_id: number, user_id: number) {
    const user = await this.customerRepository.getCustomerProfile(user_id);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    const restaurant = await this.restaurantRepository.findRestaurantById(restaurant_id);
    if (!restaurant) {
      throw new AppError("Restaurant not found", StatusCodes.NOT_FOUND);
    }
    const createFavouriteRestaurant = await this.favouriteRepository.createFavouriteRestaurant({ user_id, restaurant_id });
    return createFavouriteRestaurant;
  }
  async getFavouriteDishes(user_id: number) {
    const user = await this.customerRepository.getCustomerProfile(user_id);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    const favouriteDishes = await this.favouriteRepository.getFavouriteDishesByUserId(user_id);
    const dishes = await Promise.all(
      favouriteDishes.map((fr) =>
        this.dishRepository.findDishById(fr.dish_id)
      )
    );
    return dishes;
  }
  async getFavouriteRestaurants(user_id: number) {
    const user = await this.customerRepository.getCustomerProfile(user_id);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    const favouriteRestaurants = await this.favouriteRepository.getFavouriteRestaurantsByUserId(user_id);
    const restaurants = await Promise.all(
      favouriteRestaurants.map(fr => this.restaurantRepository.findRestaurantById(fr.restaurant_id))
    );
      return restaurants;
  }
  async deleteFavouriteDish(favouriteDishId: number, user_id: number) {
    const favouriteDish = await this.favouriteRepository.findFavouriteDishByDishAndUserId(favouriteDishId, user_id);
    if (!favouriteDish || favouriteDish.customer_id !== user_id) {
      throw new AppError("Favourite dish not found", StatusCodes.NOT_FOUND);
    }
    await this.favouriteRepository.deleteFavouriteDish(favouriteDish);
    return { message: "Favourite dish deleted successfully" };
  }
  async deleteFavouriteRestaurant(favouriteRestaurantId: number, user_id: number) {
    const favouriteRestaurant = await this.favouriteRepository.findFavouriteRestaurantByRestaurantAndUserId(favouriteRestaurantId, user_id);
    if (!favouriteRestaurant || favouriteRestaurant.customer_id !== user_id) {
      throw new AppError("Favourite restaurant not found", StatusCodes.NOT_FOUND);
    }
    await this.favouriteRepository.deleteFavouriteRestaurant(favouriteRestaurant);
    return { message: "Favourite restaurant deleted successfully" };
  }
  async checkFavouriteDish(dish_id: number, user_id: number) {
    const favouriteDish = await this.favouriteRepository.findFavouriteDishByDishAndUserId(dish_id, user_id);
    return favouriteDish !== null;
  }
  async checkFavouriteRestaurant(restaurant_id: number, user_id: number) {
    const favouriteRestaurant = await this.favouriteRepository.findFavouriteRestaurantByRestaurantAndUserId(restaurant_id, user_id);
    return favouriteRestaurant !== null;
  }
  async getFavouriteDishesByRestaurant(restaurant_id: number, user_id: number) {
    const user = await this.customerRepository.getCustomerProfile(user_id);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    const favouriteDishes = await this.favouriteRepository.getFavouriteDishesByUserId(user_id);
    const dishes = await Promise.all(
      favouriteDishes.map(async (fr) => {
        const dish = await this.dishRepository.findDishById(fr.dish_id);
        if (dish && dish.restaurant_id === restaurant_id) {
          return dish;
        }
        return null;
      })
    );
    return dishes;
  }
}