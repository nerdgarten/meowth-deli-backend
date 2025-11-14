import type {
  IBaseUser,
  ICustomer,
  IDriver,
  IRestaurant,
} from "@/types/users/user";

export type BaseSignUpBody = {
  email: string;
  password: string;
  tel: string;
  accepted_term_of_service?: boolean;
  accepted_pdpa?: boolean;
};

export type CustomerSignUpBody = {
  firstname: string;
  lastname: string;
} & BaseSignUpBody;

export type DriverSignUpBody = {
  firstname: string;
  lastname: string;
} & BaseSignUpBody;

export type RestaurantSignUpBody = {
  name: string;
  detail?: string;
} & BaseSignUpBody;
