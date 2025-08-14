import { z } from "zod";

export const addressSchema = z.object({
  country: z.string().min(1, "Country is required"),
  flatHouse: z.string().optional(),
  streetAddress: z.string().min(1, "Street address is required"),
  landmark: z.string().optional(),
  district: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits"),
});

export type TAddressFormValues = z.infer<typeof addressSchema>;
