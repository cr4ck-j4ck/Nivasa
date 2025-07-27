import { z } from "zod";

export const createAuthSchema = (isSignup: boolean) => {
  if (isSignup) {
    return z.object({
      fullName: z.string().min(2, "Full Name is required"),
      email: z.email({ message: "Invalid email", pattern: z.regexes.html5Email }),
      password: z.string().min(6, "Password must be at least 6 characters"),
    });
  } else {
    return z.object({
      fullName: z.string().optional(),
      email: z.email({ message: "Invalid email", pattern: z.regexes.html5Email }),
      password: z.string().min(6, "Password must be at least 6 characters"),
    });
  }
};


// Type for the form data
export type TAuthForm = {
  fullName?: string;
  email: string;
  password: string;
};
