import { z } from "zod";

export const emailVerificationSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
});

export const phoneVerificationSchema = z.object({
  tel: z
    .string()
    .regex(/^\+?[1-9]\d{10,14}$/, { message: "Invalid phone number format" }),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character",
    }),
});
