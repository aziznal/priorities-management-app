import { NextRequest, NextResponse } from "next/server";
import { Priority } from "@/lib/common/types";
import { parseWithSchema } from "@/lib/server/helpers";
import {
  createPriorityRequestSchema,
  deleteManyPrioritiesRequestSchema,
  updateManyPrioritiesRequestSchema,
} from "./schema";
import {
  buildBadRequestResponse,
  buildOkResponse,
  buildOkResponseWithData,
  buildServerErrorResponse,
} from "@/lib/server/helpers";
import { removeOrderGaps } from "@/lib/common/core";
import { createUuid } from "@/lib/common/helpers";
import { createClient } from "@/lib/db/supabase/server";
import {
  mapManyPrioritiesToClient,
  mapManyPrioritiesToServer,
  mapOnePriorityToServer,
} from "@/lib/server/mappers/priority";

export const runtime = "edge";

export type GetPrioritiesResponse = {
  data: Priority[];
};

export async function GET(): Promise<NextResponse> {
  const supabase = await createClient();

  const prioritiesQuery = await supabase
    .from("priorities")
    .select()
    .order("order");

  if (!prioritiesQuery.data || prioritiesQuery.error)
    return buildServerErrorResponse({
      message: "unknown error occurred while reading data",
    });

  return buildOkResponseWithData({
    data: mapManyPrioritiesToClient(prioritiesQuery.data),
  } satisfies GetPrioritiesResponse);
}

export async function POST(req: Request) {
  const reqBody = parseWithSchema({
    data: await req.json(),
    schema: createPriorityRequestSchema,
  });

  if (!reqBody) return buildBadRequestResponse();

  const supabase = await createClient();

  const biggestOrderQuery = await supabase
    .from("priorities")
    .select()
    .order("order", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (biggestOrderQuery.error)
    return buildServerErrorResponse({
      message: "unknown error occurred while reading data",
    });

  // if no data, then must be adding first element
  const lastOrder = biggestOrderQuery.data?.order ?? 0;

  const newPriority: Priority = {
    id: createUuid(),
    body: reqBody.body,
    order: lastOrder + 1,
    createdAt: new Date().toISOString(),
  };

  const insertQuery = await supabase
    .from("priorities")
    .insert(mapOnePriorityToServer(newPriority));

  if (insertQuery.error)
    return buildServerErrorResponse({
      message: "Something went wrong while inserting priority",
    });

  return buildOkResponse();
}

export async function PATCH(req: NextRequest) {
  const reqBody = parseWithSchema({
    data: await req.json(),
    schema: updateManyPrioritiesRequestSchema,
  });

  if (!reqBody) return buildBadRequestResponse();

  const supabase = await createClient();

  const upsertQuery = await supabase
    .from("priorities")
    .upsert(mapManyPrioritiesToServer(reqBody.priorities));

  if (upsertQuery.error)
    return buildServerErrorResponse({
      message: "Something went wrong while updating priorities",
    });

  return buildOkResponse();
}

export async function DELETE(req: NextRequest) {
  const reqBody = parseWithSchema({
    data: await req.json(),
    schema: deleteManyPrioritiesRequestSchema,
  });

  if (!reqBody) return buildBadRequestResponse();

  const supabase = await createClient();

  const prioritiesQuery = await supabase.from("priorities").select();

  if (!prioritiesQuery.data || prioritiesQuery.error)
    return buildServerErrorResponse({
      message: "Something went wrong while fetching priorities",
    });

  const existingPriorities = mapManyPrioritiesToClient(prioritiesQuery.data);

  const updatedPriorities = removeOrderGaps(
    existingPriorities.filter((p) => !reqBody.priorityIds.includes(p.id)),
  );

  const upsertQuery = await supabase
    .from("priorities")
    .upsert(mapManyPrioritiesToServer(updatedPriorities));

  if (upsertQuery.error)
    return buildServerErrorResponse({
      message: "Something went wrong while updating priorities",
    });

  return buildOkResponse();
}
