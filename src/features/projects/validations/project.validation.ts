import z from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be atleast 3 characters")
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
    .min(3, "Project key must be atleast 3 characters long")
    .max(20, "Project key is too long")
    .regex(
      /^[A-Z][A-Z0-9]{1,9}$/,
      "Project key must contain only uppercase letters and numbers and start with a letter",
    ),
});

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(200, "Name is too long")
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000, "Description is too long")
      .optional(),

    key: z
      .string()
      .trim()
      .toUpperCase()
      .min(3, "Project key must be atleast 3 characters long")
      .max(20, "Project key is too long")
      .regex(
        /^[A-Z][A-Z0-9]{1,9}$/,
        "Project key must contain only uppercase letters and numbers and start with a letter",
      )
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.description !== undefined ||
      data.key !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export type ProjectInput = z.infer<typeof projectSchema>;

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
