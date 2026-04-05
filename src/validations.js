import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Need one lowercase letter")
        .regex(/[A-Z]/, "Need one uppercase letter")
        .regex(/\d/, "Need one digit")
        .regex(/[^a-zA-Z0-9]/, "Need one special character")
});

export const recordSchema = z.object({
    amount: z.number().nonnegative("Amount must be 0 or greater"),
    type: z.enum(['INCOME', 'EXPENSE'], "Must be INCOME or EXPENSE"),
    category: z.string().min(1, "Category ID is required"),
    date: z.string().optional(),
    description: z.string().optional(),
    user: z.string().optional()
});