import type {
  UserRole,
  ICustomer,
  IBaseUser,
  IDriver,
  IRestaurant,
} from "@/types/user";

export interface SignInBody extends IBaseUser {
  role: UserRole;
}

export interface CustomerSignUpBody extends ICustomer {}
export interface DriverSignUpBody extends IDriver {}
export interface RestaurantSignUpBody extends IRestaurant {}
