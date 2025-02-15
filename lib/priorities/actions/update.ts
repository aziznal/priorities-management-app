"use server";

import { parseWithSchema } from "@/lib/server/utils/parsing";
import {
  UpdateManyPrioritiesRequest,
  updateManyPrioritiesRequestSchema,
  UpdatePriorityRequest,
  updatePriorityRequestSchema,
} from "../core/priority-schema";
import { createClient } from "@/lib/db/supabase/server";
import { mapManyPrioritiesToServer } from "../mappers";
import { Priority } from "../core/priority-type";

export async function updatePriorityById(args: {
  updatedPriority: UpdatePriorityRequest;
  priorityId: Priority["id"];
}) {
  const parsedUpdatedPriority = parseWithSchema({
    data: args.updatedPriority,
    schema: updatePriorityRequestSchema,
  });

  if (!parsedUpdatedPriority) throw new Error("Invalid updated priority");

  const supabase = await createClient();

  const prioritiesQuery = await supabase.from("priorities").select();

  if (!prioritiesQuery.data || prioritiesQuery.error)
    throw new Error("unknown error occurred while reading data");

  const existingPriority = prioritiesQuery.data.find(
    (p) => p.id === args.priorityId,
  );

  if (!existingPriority) throw new Error("Priority not found");

  const updatedPriority = {
    ...existingPriority,
    body: parsedUpdatedPriority.body,
  };

  const updateQuery = await supabase
    .from("priorities")
    .update(updatedPriority)
    .eq("id", existingPriority.id);

  if (updateQuery.error)
    throw new Error("Something went wrong while updating priority");
}

export async function updateManyPriorities(
  updatedPriorities: UpdateManyPrioritiesRequest,
) {
  const reqBody = parseWithSchema({
    data: updatedPriorities,
    schema: updateManyPrioritiesRequestSchema,
  });

  if (!reqBody) throw new Error("Invalid updated priority");

  const supabase = await createClient();

  const upsertQuery = await supabase
    .from("priorities")
    .upsert(mapManyPrioritiesToServer(reqBody.priorities));

  if (upsertQuery.error)
    throw new Error("Something went wrong while updating priorities");
}
