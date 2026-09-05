import z from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be atleast 3 characters")
    .max(100, "Name is too long"),
});

export const updateOrganizationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name is too long")
      .optional(),

    slug: z
      .string()
      .trim()
      .min(3, "Slug is required")
      .max(250, "Slug is too long")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      )
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.slug !== undefined, {
    message: "At least one field must be provided",
  });

export type OrganizationInput = z.infer<typeof organizationSchema>;

export type OrganizationUpdateInput = z.infer<typeof updateOrganizationSchema>;
