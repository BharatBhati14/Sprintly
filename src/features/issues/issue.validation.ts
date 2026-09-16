import z from "zod";

const issueStatusValues = [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
] as const;

const issuePriorityValues = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const issueStatusSchema = z.enum(issueStatusValues);

export const issuePrioritySchema = z.enum(issuePriorityValues);

export const createIssueSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title is too long"),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long")
    .nullable()
    .optional(),

  status: issueStatusSchema.optional(),

  priority: issuePrioritySchema.optional(),

  assigneeId: z.uuid("Invalid assignee ID").nullable().optional(),

  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format")
    .nullable()
    .optional(),
});

export const updateIssueSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(150, "Title is too long")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description is too long")
      .nullable()
      .optional(),

    status: issueStatusSchema.optional(),

    priority: issuePrioritySchema.optional(),

    assigneeId: z.uuid("Invalid assignee ID").nullable().optional(),

    dueDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format")
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

/**
 * Used specifically for status transitions.
 */
export const changeIssueStatusSchema = z.object({
  status: issueStatusSchema,
});

/**
 * Used for filtering the issue list.
 *
 * All filters are optional.
 */
export const issueListQuerySchema = z
  .object({
    status: issueStatusSchema.optional(),

    priority: issuePrioritySchema.optional(),

    assigneeId: z.uuid("Invalid assignee ID").optional(),

    labelId: z.uuid("Invalid label ID").optional(),
  })
  .strict();

export const replaceIssueLabelsSchema = z.object({
  labelIds: z
    .array(z.uuid("Invalid label ID"))
    .refine((labelIds) => new Set(labelIds).size === labelIds.length, {
      message: "Duplicate label IDs are not allowed",
    }),
});

export type IssueStatus = z.infer<typeof issueStatusSchema>;

export type IssuePriority = z.infer<typeof issuePrioritySchema>;

export type CreateIssueInput = z.infer<typeof createIssueSchema>;

export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;

export type ChangeIssueStatusInput = z.infer<typeof changeIssueStatusSchema>;

export type IssueListQuery = z.infer<typeof issueListQuerySchema>;

export type ReplaceIssueLabelsInput = z.infer<typeof replaceIssueLabelsSchema>;
