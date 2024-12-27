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
