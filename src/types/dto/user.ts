import { User } from "@/generated/prisma/client";

export type BaseSignUpBody = Omit<User, "id" | "created_at" | "updated_at">;

export type CreateCustomerRequestDTO = {
  firstname: string;
  lastname: string;
  tel: string;
} & BaseSignUpBody;

export type CreateDriverRequestDTO = {
  firstname: string;
  lastname: string;
  tel: string;
} & BaseSignUpBody;

export type CreateRestaurantRequestDTO = {
  name: string;
  detail?: string;
  tel: string;
} & BaseSignUpBody;

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
  CreateCustomerRequestDTO,
  "password" | "accepted_term_of_service" | "accepted_pdpa"
>;

export type CreateDriverResponseDTO = { id: number } & Omit<
  CreateDriverRequestDTO,
  "password" | "accepted_term_of_service" | "accepted_pdpa"
>;

export type CreateRestaurantResponseDTO = { id: number } & Omit<
  CreateRestaurantRequestDTO,
  "password" | "accepted_term_of_service" | "accepted_pdpa"
>;
