import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  email: z.email({ message: "Invalid email", pattern: z.regexes.html5Email }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email", pattern: z.regexes.html5Email }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type TloginSchema = z.infer<typeof loginSchema>;
export type TsignupSchema = z.infer<typeof signupSchema>;