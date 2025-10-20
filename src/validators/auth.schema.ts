import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  role: z.enum(["customer", "restaurant", "driver"]),
});

export const signUpCustomerSchema = z.object({
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  tel: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Invalid phone number format",
  }),
});

export const signUpRestaurantSchema = z.object({
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  location: z.string().min(1, { message: "Location is required" }),
  tel: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Invalid phone number format",
  }),
});

export const signUpDriverSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  vehicle: z.string().min(1, { message: "Vehicle is required" }),
  licence: z.string().min(1, { message: "Licence is required" }),
  tel: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Invalid phone number format",
  }),
});
