import { Customer } from "@/generated/prisma/client";

export type ICustomer = Omit<Customer, "is_deleted">;
export type ICustomerProfile = Pick<
  Customer,
  "firstname" | "lastname" | "tel" | "image"
>;

export type UpdateCustomerProfileRequestDTO = Pick<
  ICustomer,
  "firstname" | "lastname" | "tel" | "image"
>;

export type GetCustomerResponseDTO = ICustomer;
