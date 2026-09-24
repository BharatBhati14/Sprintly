import z from "zod";

export const labelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Label name must be at least 3 characters")
    .max(100, "Name is too long"),

  color: z.string().trim().max(20, "Color is too long").nullable().optional(),
});

export const updateLabelSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Label name must be at least 3 characters")
      .max(100, "Name is too long")
      .optional(),

    color: z.string().trim().max(20, "Color is too long").nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type Label = z.infer<typeof labelSchema>;
export type NewLabel = z.infer<typeof updateLabelSchema>;
export type CreateLabelInput = z.infer<typeof labelSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;
