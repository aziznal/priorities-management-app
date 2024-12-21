import { type ZodSchema } from "zod";

export function parseWithSchema<TSchema>({
  data,
  schema,
}: {
  data: unknown;
  schema: ZodSchema<TSchema>;
}) {
  const { data: parsedData, error, success } = schema.safeParse(data);

  if (success) return parsedData;

  if (error) return undefined;
}
