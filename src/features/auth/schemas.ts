import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const sponsorIdSchema = z.object({
  sponsorId: z
    .string()
    .min(1, "Sponsor ID is required")
    .regex(/^\d+$/, "Must be numeric"),
});
export type SponsorIdSchema = z.infer<typeof sponsorIdSchema>;

export const accountDetailsSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscores"),
    sponsorId: z.string().min(1),
    countryCode: z.string().min(1),
    phone: z.string().min(7, "Invalid phone number"),
    country: z.string().min(1),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "At least 6 characters")
      .regex(/[A-Z]/, "Must include uppercase")
      .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string(),
    avatar: z.any().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type AccountDetailsSchema = z.infer<typeof accountDetailsSchema>;

export type SignUpData = Partial<AccountDetailsSchema> & {
  pin?: string;
};
