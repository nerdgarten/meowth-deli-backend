import type { ICustomer, IBaseUser, IDriver, IRestaurant } from "@/types/user";
import type { Role } from "@/types/role";

export interface SignInBody extends IBaseUser {
  role: Role;
}

export type CustomerSignUpBody = ICustomer;
export type DriverSignUpBody = IDriver;
export type RestaurantSignUpBody = IRestaurant;

export interface ResetPasswordBody {
  token: string;
  password: string;
}
