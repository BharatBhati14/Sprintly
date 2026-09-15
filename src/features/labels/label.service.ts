import { db } from "@/db";
import { Label, NewLabel } from "./label.validation";
import { labels } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { AuthorizationError } from "@/server/authorization/authorization-error";

export function generateRandomHex(): string {
  const value = Math.floor(Math.random() * 0xffffff);

  return `#${value.toString(16).padStart(6, "0")}`;
}

export function isValidHex(value: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
    value,
  );
}

// ############ get labels ################

export async function getLabels(organizationId: string) {
  return await db
    .select()
    .from(labels)
    .where(eq(labels.org_id, organizationId));
}

// ############## create label ################

export async function createLabel(organizationId: string, data: Label) {
  const [labelExists] = await db
    .select()
    .from(labels)
    .where(
      and(
        eq(labels.org_id, organizationId),
        eq(labels.name, data.name.toLowerCase()),
      ),
    )
    .limit(1);

  if (labelExists) {
    throw new Error("Label with this name already exists");
  }

  if (!data.color || data.color === null || data.color === undefined) {
    data.color = generateRandomHex();
  } else {
    if (!isValidHex(data.color)) {
      throw new Error("Invalid Color input");
    }
  }

  const [label] = await db
    .insert(labels)
    .values({
      org_id: organizationId,
      name: data.name,
      color: data.color,
    })
    .returning();

  return label;
}

// ############ get individual label ###############

export async function getLabel(labelId: string, organizationId: string) {
  const [label] = await db
    .select()
    .from(labels)
    .where(and(eq(labels.id, labelId), eq(labels.org_id, organizationId)))
    .limit(1);

  if (!label) {
    throw new AuthorizationError("Label not found", 404);
  }

  return label;
}

// ############### update a label ###############

export async function updateLabel(
  labelId: string,
  organizationId: string,
  data: NewLabel,
) {
  const [label] = await db
    .update(labels)
    .set({ ...data, updated_at: new Date() })
    .where(and(eq(labels.id, labelId), eq(labels.org_id, organizationId)))
    .returning();

  if (!label) {
    throw new AuthorizationError("Label not found", 404);
  }

  return label;
}

// ############## delete label ##################

export async function deleteLabel(labelId: string, organizationId: string) {
  const [label] = await db
    .delete(labels)
    .where(and(eq(labels.id, labelId), eq(labels.org_id, organizationId)))
    .returning();

  if (!label) {
    throw new AuthorizationError("Label Not Found", 404);
  }

  return label;
}
