import z from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name is too long"),

  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .optional(),

  key: z
    .string()
    .trim()
    .toUpperCase()
    .min(3, "Project key must be at least 3 characters")
    .max(10, "Project key is too long")
    .regex(
      /^[A-Z][A-Z0-9]{1,9}$/,
      "Project key must start with a letter and contain only uppercase letters and numbers",
    ),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
