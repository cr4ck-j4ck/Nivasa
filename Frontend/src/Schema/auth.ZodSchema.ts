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

// Password reset schema with strong password requirements
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type TloginSchema = z.infer<typeof loginSchema>;
export type TsignupSchema = z.infer<typeof signupSchema>;
export type TresetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type TforgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
