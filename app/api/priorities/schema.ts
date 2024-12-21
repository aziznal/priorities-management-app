import {
  priorityBodySchema,
  priorityIdSchema,
  prioritySchema,
} from "@/lib/common/schemas";
import { z } from "zod";

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
