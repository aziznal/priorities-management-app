import { z } from "zod";

export const priorityIdSchema = z.string().uuid();
export const priorityBodySchema = z.string().max(1024);
export const priorityOrderSchema = z.coerce
  .number()
  .min(0)
  .max(Number.MAX_SAFE_INTEGER);
export const priorityCreatedAt = z.string();

export const prioritySchema = z.object({
  id: priorityIdSchema,
  body: priorityBodySchema,
  order: priorityOrderSchema,
  createdAt: priorityCreatedAt,
});

export const createPriorityRequestSchema = z.object({
  body: priorityBodySchema,
});

export const updatePriorityRequestSchema = z.object({
  body: priorityBodySchema,
});

export const updateManyPrioritiesRequestSchema = z.object({
  priorities: prioritySchema.array(),
});

export const deleteManyPrioritiesRequestSchema = z.object({
  priorityIds: priorityIdSchema.array(),
});

export type CreatePriorityRequest = z.infer<typeof createPriorityRequestSchema>;

export type UpdatePriorityRequest = z.infer<typeof updatePriorityRequestSchema>;

export type UpdateManyPrioritiesRequest = z.infer<
  typeof updateManyPrioritiesRequestSchema
>;

export type DeleteManyPrioritiesRequest = z.infer<
  typeof deleteManyPrioritiesRequestSchema
>;
