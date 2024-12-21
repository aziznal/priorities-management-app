import { NextRequest, NextResponse } from "next/server";
import { Priority } from "@/lib/common/types/priority";
import { parseWithSchema } from "@/lib/server/helpers/parsing";
import {
  createPriorityRequestSchema,
  deleteManyPrioritiesRequestSchema,
  updateManyPrioritiesRequestSchema,
} from "./schema";
import {
  buildBadRequestResponse,
  buildNotFoundResponse,
  buildOkResponse,
  buildOkResponseWithData,
  buildServerErrorResponse,
} from "@/lib/server/helpers/responses";
import { readDb, writeDb } from "@/lib/server/data/driver";
import { getLastOrder } from "@/lib/common/core";
import { createUuid } from "@/lib/common/helpers/create-uuid";

export type GetPrioritiesResponse = {
  data: Priority[];
};

export async function GET(): Promise<NextResponse> {
  const data = await readDb();

  if (!data)
    return buildServerErrorResponse({
      message: "unknown error occurred while reading data",
    });

  return buildOkResponseWithData({
    data: data.priorities,
  } satisfies GetPrioritiesResponse);
}

export async function POST(req: Request) {
  const reqBody = parseWithSchema({
    data: await req.json(),
    schema: createPriorityRequestSchema,
  });

  if (!reqBody) return buildBadRequestResponse();

  const existingData = await readDb();

  if (!existingData)
    return buildServerErrorResponse({
      message: "Could not write new data because I lost the DB :'(",
    });

  const lastOrder = getLastOrder(existingData.priorities);

  const newPriority: Priority = {
    id: createUuid(),
    body: reqBody.body ?? "Untittied",
    order: lastOrder + 1,
  };

  await writeDb({ priorities: [...existingData.priorities, newPriority] });

  return buildOkResponse();
}

export async function PATCH(req: NextRequest) {
  const reqBody = parseWithSchema({
    data: await req.json(),
    schema: updateManyPrioritiesRequestSchema,
  });

  if (!reqBody) return buildBadRequestResponse();

  await writeDb({ priorities: reqBody.priorities });

  return buildOkResponse();
}

export async function DELETE(req: NextRequest) {
  const reqBody = parseWithSchema({
    data: await req.json(),
    schema: deleteManyPrioritiesRequestSchema,
  });

  if (!reqBody) return buildBadRequestResponse();

  const existingData = await readDb();

  if (!existingData) return buildNotFoundResponse();

  const updatedPriorities = existingData.priorities
    .filter((p) => !reqBody.priorityIds.includes(p.id))
    // filling in potential gaps between orders
    .toSorted((a, b) => a.order - b.order)
    .map((p, i) => ({
      ...p,
      order: i,
    }));

  await writeDb({ priorities: updatedPriorities });

  return buildOkResponse();
}
