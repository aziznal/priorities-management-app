"use server";

import { createClient } from "@/lib/db/supabase/server";
import { parseWithSchema } from "@/lib/server/utils/parsing";
import { createUuid } from "@/lib/common/helpers";

import { mapOnePriorityToServer } from "../mappers";
import {
  CreatePriorityRequest,
  createPriorityRequestSchema,
} from "../core/priority-schema";
import { Priority } from "../core/priority-type";

export async function createNewPriority(
  createdPriorityRequest: CreatePriorityRequest,
) {
  const createdPriority = parseWithSchema({
    data: createdPriorityRequest,
    schema: createPriorityRequestSchema,
  });

  if (!createdPriority) throw new Error("Invalid priority body provided");

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
    throw new Error("unknown error occurred while reading data");

  // if no data, then must be adding first element
  const lastOrder = biggestOrderQuery.data?.order ?? 0;

  const newPriority: Priority = {
    id: createUuid(),
    body: createdPriority.body,
    order: lastOrder + 1,
    createdAt: new Date().toISOString(),
  };

  const insertQuery = await supabase
    .from("priorities")
    .insert(mapOnePriorityToServer(newPriority));

  if (insertQuery.error)
    throw new Error("Something went wrong while inserting priority");
}
