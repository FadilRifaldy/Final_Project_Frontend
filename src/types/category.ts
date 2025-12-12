import { z } from "zod";

export interface ICategory {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

// Schema untuk validasi form Create/Edit
export const categoryFormSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(50, "Name must be less than 50 characters"),
    description: z.string()
        .max(200, "Description must be less than 200 characters")
        .optional()
});

// Type untuk form input
export type CategoryFormInput = z.infer<typeof categoryFormSchema>;