import { priorityIdSchema } from "@/lib/common/schemas/priority";
import { readDb, writeDb } from "@/lib/server/data/driver";
import { parseWithSchema } from "@/lib/server/helpers/parsing";
import {
  buildBadRequestResponse,
  buildNotFoundResponse,
  buildOkResponse,
  buildServerErrorResponse,
} from "@/lib/server/helpers/responses";
import { z } from "zod";
import { updatePriorityRequestSchema } from "../schema";

const paramsSchema = z.object({
  id: priorityIdSchema,
});

type Props = {
  params: Promise<z.infer<typeof paramsSchema>>;
};

export async function PATCH(req: Request, ctx: Props) {
  const params = parseWithSchema({
    data: await ctx.params,
    schema: paramsSchema,
  });

  const reqBody = parseWithSchema({
    data: await req.json(),
    schema: updatePriorityRequestSchema,
  });

  if (!params || !reqBody) return buildBadRequestResponse();

  const existingData = await readDb();

  if (!existingData) return buildServerErrorResponse();

  const existingPriority = existingData.priorities.find(
    (p) => p.id === params.id,
  );

  if (!existingPriority) return buildNotFoundResponse();

  const updatedPriorities = existingData.priorities.map((p) => {
    if (p.id === params.id)
      return {
        ...p,
        body: reqBody.body ?? "",
      };

    return p;
  });

  await writeDb({ priorities: updatedPriorities });

  return buildOkResponse();
}

export async function DELETE(_req: Request, ctx: Props) {
  const params = parseWithSchema({
    data: await ctx.params,
    schema: paramsSchema,
  });

  if (!params) return buildBadRequestResponse();

  const existingData = await readDb();

  if (!existingData) return buildServerErrorResponse();

  const existingPriority = existingData.priorities.find(
    (p) => p.id === params.id,
  );

  if (!existingPriority) return buildNotFoundResponse();

  const updatedPriorities = existingData.priorities.filter(
    (p) => p.id !== params.id,
  );

  await writeDb({ priorities: updatedPriorities });

  return buildOkResponse();
}
