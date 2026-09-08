import z from "zod";
import { organizationMemberRoleEnum } from "@/db/schemas";

export const updateMemberRoleSchema = z.object({
  role: z.enum(organizationMemberRoleEnum.enumValues),
});

export type updateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
