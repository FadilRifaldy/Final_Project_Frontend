import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().regex(
    /^[^\s@]+@[^\s@]+\.com$/,
    "Email must contain @ and end with .com"
  ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password too long")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/\d/, "Password must contain at least 1 number")
    .regex(/[^A-za-z0-9]/, "Password must contain at least 1 symbol"),
  remember: z.boolean().optional(),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must contain at least 2 letter"),
  email: z.string().regex(
    /^[^\s@]+@[^\s@]+\.com$/,
    "Email must contain @ and end with .com"
  ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password too long")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/\d/, "Password must contain at least 1 number")
    .regex(/[^A-za-z0-9]/, "Password must contain at least 1 symbol"),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signupSchema>;
