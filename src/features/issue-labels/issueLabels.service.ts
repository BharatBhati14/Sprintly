import { db } from "@/db";
import { issueLabels, issues, labels } from "@/db/schemas";
import { AuthorizationError } from "@/server/authorization/authorization-error";
import { and, eq } from "drizzle-orm";

// fetch all issue-labels

export async function getIssuesLabels(issueId: string) {
  return await db
    .select()
    .from(issueLabels)
    .where(eq(issueLabels.issue_id, issueId));
}

// ######## POST attach labels to issues ####################

export async function attachLabelToIssues(
  organizationId: string,
  projectId: string,
  issueId: string,
  labelId: string,
) {
  const [issueBelongsToProject] = await db
    .select()
    .from(issues)
    .where(eq(issues.project_id, projectId))
    .limit(1);

  if (!issueBelongsToProject) {
    throw new AuthorizationError("Issue does not belongs to the project", 404);
  }

  const [labelBelongsToOrganization] = await db
    .select()
    .from(labels)
    .where(eq(labels.org_id, organizationId))
    .limit(1);

  if (!labelBelongsToOrganization) {
    throw new AuthorizationError(
      "Label does not belongs to the Organization",
      404,
    );
  }

  const [issueLabelExists] = await db
    .select()
    .from(issueLabels)
    .where(
      and(eq(issueLabels.issue_id, issueId), eq(issueLabels.label_id, labelId)),
    )
    .limit(1);

  if (issueLabelExists) {
    throw new Error("Issue-label already exists");
  }

  const [issueLabel] = await db
    .insert(issueLabels)
    .values({
      issue_id: issueId,
      label_id: labelId,
    })
    .returning();

  return issueLabel;
}
