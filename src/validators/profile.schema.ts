import { z } from "zod";

import { Allergy } from "@/types/allergy";

export const customerUpdateProfileSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  tel: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Invalid phone number format",
    })
    .optional(),
  image: z.string().url({ message: "Invalid URL format" }).optional(),
});

export const allergyUpdateSchema = z.object({
  allergies: z.array(z.enum(Allergy)),
});

export const restaurantUpdateProfileSchema = z.object({
  name: z.string().optional(),
  tel: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Invalid phone number format",
    })
    .optional(),
  banner: z.string().url({ message: "Invalid URL format" }).optional(),
  detail: z.string().optional(),
});

export const driverUpdateProfileSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  tel: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Invalid phone number format",
    })
    .optional(),
  image: z.string().url({ message: "Invalid URL format" }).optional(),
  vechicle: z.string().optional(),
  license: z.string().optional(),
});
