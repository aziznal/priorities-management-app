import { priorityIdSchema } from "@/lib/common/schemas";
import { parseWithSchema } from "@/lib/server/helpers";
import {
  buildBadRequestResponse,
  buildNotFoundResponse,
  buildOkResponse,
  buildServerErrorResponse,
} from "@/lib/server/helpers";
import { z } from "zod";
import { updatePriorityRequestSchema } from "../schema";
import { removeOrderGaps } from "@/lib/common/core";
import { createClient } from "@/lib/db/supabase/server";
import {
  mapManyPrioritiesToClient,
  mapManyPrioritiesToServer,
} from "@/lib/server/mappers/priority";

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

  const supabase = await createClient();

  const prioritiesQuery = await supabase.from("priorities").select();

  if (!prioritiesQuery.data || prioritiesQuery.error)
    return buildServerErrorResponse({
      message: "unknown error occurred while reading data",
    });

  const existingPriority = prioritiesQuery.data.find((p) => p.id === params.id);

  if (!existingPriority) return buildNotFoundResponse();

  const updatedPriority = {
    ...existingPriority,
    body: reqBody.body,
  };

  const updateQuery = await supabase
    .from("priorities")
    .update(updatedPriority)
    .eq("id", existingPriority.id);

  if (updateQuery.error)
    return buildServerErrorResponse({
      message: "Something went wrong while updating priority",
    });

  return buildOkResponse();
}

export async function DELETE(_req: Request, ctx: Props) {
  const params = parseWithSchema({
    data: await ctx.params,
    schema: paramsSchema,
  });

  if (!params) return buildBadRequestResponse();

  const supabase = await createClient();

  const prioritiesQuery = await supabase.from("priorities").select();

  if (!prioritiesQuery.data || prioritiesQuery.error)
    return buildServerErrorResponse({
      message: "unknown error occurred while reading data",
    });

  const deletedPriority = prioritiesQuery.data.find((p) => p.id === params.id);

  if (!deletedPriority) return buildNotFoundResponse();

  const updatedPriorities = removeOrderGaps(
    mapManyPrioritiesToClient(prioritiesQuery.data).filter(
      (p) => p.id !== deletedPriority.id,
    ),
  );

  const deleteQuery = await supabase
    .from("priorities")
    .delete()
    .eq("id", deletedPriority.id);

  if (deleteQuery.error)
    return buildServerErrorResponse({
      message: "Something went wrong while deleting priorities",
    });

  const upsertQuery = await supabase
    .from("priorities")
    .upsert(mapManyPrioritiesToServer(updatedPriorities));

  if (upsertQuery.error)
    return buildServerErrorResponse({
      message: "Something went wrong while updating priorities",
    });

  return buildOkResponse();
}
