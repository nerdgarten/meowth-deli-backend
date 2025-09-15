import { z } from "zod";

export const signInSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["customer", "restaurant"]),
  }),
});

export const signUpCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const signUpRestaurantSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    restaurantName: z.string().min(1),
    restaurantAddress: z.string().min(1),
  }),
});
export const signUpDriverSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    vehicle: z.string().min(1),
    licence: z.string().min(1),
  }),
});

export type SignInBody = z.infer<typeof signInSchema>["body"];
export type CustomerSignUpBody = z.infer<typeof signUpCustomerSchema>["body"];
export type DriverSignUpBody = z.infer<typeof signUpDriverSchema>["body"];
export type RestaurantSignUpBody = z.infer<
  typeof signUpRestaurantSchema
>["body"];
