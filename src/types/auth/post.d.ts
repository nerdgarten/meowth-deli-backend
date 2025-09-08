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

export type CustomerSignUpBody = ICustomer;
export type DriverSignUpBody = IDriver;
export type RestaurantSignUpBody = IRestaurant;
