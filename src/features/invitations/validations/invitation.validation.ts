import z from "zod";

export const invitationSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(150),
});

export type CreateInvitationInput = z.infer<typeof invitationSchema>;
