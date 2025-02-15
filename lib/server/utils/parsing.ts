import { type ZodSchema } from "zod";

type Params<TSchema> = {
  data: unknown;
  schema: ZodSchema<TSchema>;
};

export function parseWithSchema<TSchema>(params: Params<TSchema>) {
  const {
    data: parsedData,
    error,
    success,
  } = params.schema.safeParse(params.data);

  if (success) return parsedData;

  if (error) return undefined;
}
