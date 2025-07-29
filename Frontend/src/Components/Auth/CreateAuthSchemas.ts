import { z } from "zod";

export const createAuthSchema = (isSignup: boolean) => {
  if (isSignup) {
    return z.object({
      firstName: z.string().min(3, "First name is required"),
      lastName: z.string().min(3, "Last name is required"),
      email: z.email({
        message: "Invalid email",
        pattern: z.regexes.html5Email,
      }),
      password: z
        .string()
        .min(6, "Password must be at least 6 character.. Samjha!!"),
      phone: z.string().min(1, "Phone number is required"),
      birthDate: z.string().min(1, "Birth date is required"),
    });
  } else {
    return z.object({
      email: z.email({
        message: "Invalid email",
        pattern: z.regexes.html5Email,
      }),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters.. Samjha!!"),
    });
  }
};

// Type for the form data
export type TAuthForm = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate: string;
  email: string;
  password: string;
};
