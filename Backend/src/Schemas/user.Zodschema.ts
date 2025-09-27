import { z } from "zod";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must contain at least one special character");

export const signupSchema = z.object({
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().min(3, "Last name is required"),
  email: z.string().email({
    message: "Invalid email",
  }),
  password: passwordSchema,
  phoneNumber: z.string().min(1, "Phone number is required"),
  birthDate: z.string().min(1, "Birth date is required"),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid user ID format' }),
});

export const verificationTokenSchema = z.object({
  Vtoken: z.string().min(1, 'Verification token is required'),
});

export const wishlistBodySchema = z.object({
  listingId: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: 'Invalid listing ID format',
  }),
});

export const wishlistParamsSchema = z.object({
  id: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: 'Invalid listing ID format',
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

export const verifyResetTokenSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: passwordSchema,
});

export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1).trim().optional(),
  lastName: z.string().min(1).trim().optional(),
  email: z.string().email({ message: "Invalid email" }).trim().toLowerCase().optional(),
  bio: z.string().max(300).trim().optional(),
});

export type TloginSchema = z.infer<typeof loginSchema>;
export type TsignupSchema = z.infer<typeof signupSchema>;
