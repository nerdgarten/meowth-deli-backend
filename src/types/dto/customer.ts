import { ICustomer } from "@/types/users/user";

export type UpdateCustomerProfileRequestDTO = Pick<
  ICustomer,
  "firstname" | "lastname" | "tel" | "image"
>;

export type GetCustomerResponseDTO = ICustomer;
