import {
  CustomerSignUpBody,
  DriverSignUpBody,
  RestaurantSignUpBody,
} from "@/types/auth/post";

export type CreateCustomerRequestDTO = CustomerSignUpBody;
export type CreateDriverRequestDTO = DriverSignUpBody;
export type CreateRestaurantRequestDTO = RestaurantSignUpBody;
export type ResetPasswordRequestDTO = {
  token: string;
  password: string;
};
export type SignInRequestDTO = {
  email: string;
  password: string;
};

export type GetUserResponseDTO = {
  id: number;
  email: string;
  role: string;
};

export type CreateCustomerResponseDTO = { id: number } & Omit<
  CustomerSignUpBody,
  "password"
>;
export type CreateDriverResponseDTO = { id: number } & Omit<
  DriverSignUpBody,
  "password"
>;
export type CreateRestaurantResponseDTO = { id: number } & Omit<
  RestaurantSignUpBody,
  "password"
>;
