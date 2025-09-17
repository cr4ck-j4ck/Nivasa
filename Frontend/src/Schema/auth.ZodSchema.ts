import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().min(3, "Last name is required"),
  email: z.email({
    message: "Invalid email",
  }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  birthDate: z.string().min(1, "Birth date is required"),
});

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type TloginSchema = z.infer<typeof loginSchema>;
export type TsignupSchema = z.infer<typeof signupSchema>;
