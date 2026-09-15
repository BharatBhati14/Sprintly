import { db } from "@/db";
import { Label } from "./label.validation";
import { labels } from "@/db/schemas";
import { and, eq } from "drizzle-orm";

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
