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
import { getLastOrder, removeOrderGaps } from "@/lib/common/core";
import { createUuid } from "@/lib/common/helpers";
import { createClient } from "@/lib/db/supabase/server";
import {
  mapManyPrioritiesToClient,
  mapManyPrioritiesToServer,
} from "@/lib/server/mappers/priority";

export type GetPrioritiesResponse = {
  data: Priority[];
};

export async function GET(): Promise<NextResponse> {
  const supabase = await createClient();

  const prioritiesQuery = await supabase.from("priorities").select();

  if (!prioritiesQuery.data || prioritiesQuery.error)
    return buildServerErrorResponse({
      message: "unknown error occurred while reading data",
    });

  const sortedPriorities = mapManyPrioritiesToClient(
    prioritiesQuery.data.toSorted((a, b) => a.order - b.order),
  );

  return buildOkResponseWithData({
    data: sortedPriorities,
  } satisfies GetPrioritiesResponse);
}

export async function POST(req: Request) {
  const reqBody = parseWithSchema({
    data: await req.json(),
    schema: createPriorityRequestSchema,
  });

  if (!reqBody) return buildBadRequestResponse();

  const supabase = await createClient();

  const existingPrioritiesQuery = await supabase.from("priorities").select();

  if (!existingPrioritiesQuery.data || existingPrioritiesQuery.error)
    return buildServerErrorResponse({
      message: "unknown error occurred while reading data",
    });

  if (!existingPrioritiesQuery.data || existingPrioritiesQuery.error)
    return buildServerErrorResponse({
      message: "Could not write new data because I lost the DB :'(",
    });

  const existingPriorities = mapManyPrioritiesToClient(
    existingPrioritiesQuery.data,
  );

  const lastOrder = getLastOrder(existingPriorities);

  const newPriority: Priority = {
    id: createUuid(),
    body: reqBody.body,
    order: lastOrder + 1,
    createdAt: new Date().toISOString(),
  };

  const upsertQuery = await supabase
    .from("priorities")
    .upsert(mapManyPrioritiesToServer([...existingPriorities, newPriority]));

  if (upsertQuery.error)
    return buildServerErrorResponse({
      message: "Something went wrong while updating priorities",
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
