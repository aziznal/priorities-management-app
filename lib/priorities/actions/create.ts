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
  // this is done to make room for the new priority as the first one
  await incrementAllOrdersByOne();

  const createdPriority = parseWithSchema({
    data: createdPriorityRequest,
    schema: createPriorityRequestSchema,
  });

  if (!createdPriority) throw new Error("Invalid priority body provided");

  const supabase = await createClient();
  const newPriority: Priority = {
    id: createUuid(),
    body: createdPriority.body,
    order: 1, // new priorities are added first
    createdAt: new Date().toISOString(),
  };

  const insertQuery = await supabase
    .from("priorities")
    .insert(mapOnePriorityToServer(newPriority));

  if (insertQuery.error)
    throw new Error("Something went wrong while inserting priority");
}

async function incrementAllOrdersByOne() {
  const supabase = await createClient();

  const existingPrioritiesQuery = await supabase
    .from("priorities")
    .select("id, order");

  if (existingPrioritiesQuery.error)
    throw new Error("Could not re-order priorities");

  const updatedPriorities = existingPrioritiesQuery.data.map((p) => ({
    ...p,
    order: p.order + 1,
  }));

  const updateQuery = await supabase
    .from("priorities")
    .upsert(updatedPriorities);

  if (updateQuery.error) throw new Error("Could not re-order priorities");
}
