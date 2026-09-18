import z from "zod";

export const invitationSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .max(150)
    .email("Enter a valid email address"),
});

export type CreateInvitationInput = z.infer<typeof invitationSchema>;
export type CreateInvitationFormValues = z.infer<typeof invitationSchema>;
