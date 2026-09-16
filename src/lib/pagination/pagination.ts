import z from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export function getPagination(page: number, limit: number) {
  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
}

export function getPaginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
