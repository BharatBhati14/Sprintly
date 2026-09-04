import z from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be atleast 3 characters")
    .max(100, "Name is too long"),
});

export type CreateOrganizationInput = z.infer<typeof organizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof organizationSchema>;
