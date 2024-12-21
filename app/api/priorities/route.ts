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
  buildNotFoundResponse,
  buildOkResponse,
  buildOkResponseWithData,
  buildServerErrorResponse,
} from "@/lib/server/helpers";
import { readDb, writeDb } from "@/lib/server/data";
import { getLastOrder, removeOrderGaps } from "@/lib/common/core";
import { createUuid } from "@/lib/common/helpers";

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
    body: reqBody.body,
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

  const updatedPriorities = removeOrderGaps(
    existingData.priorities.filter((p) => !reqBody.priorityIds.includes(p.id)),
  );

  await writeDb({ priorities: updatedPriorities });

  return buildOkResponse();
}
