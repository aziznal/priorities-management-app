"use server";

import { parseWithSchema } from "@/lib/server/utils/parsing";
import {
  DeleteManyPrioritiesRequest,
  deleteManyPrioritiesRequestSchema,
} from "../core/priority-schema";
import { createClient } from "@/lib/db/supabase/server";
import {
  mapManyPrioritiesToClient,
  mapManyPrioritiesToServer,
} from "../mappers";
import { removeOrderGaps } from "../core/utils";
import { Priority } from "../core/priority-type";

export async function deletePriorityById(id: Priority["id"]) {
  const supabase = await createClient();

  const prioritiesQuery = await supabase.from("priorities").select();

  if (!prioritiesQuery.data || prioritiesQuery.error)
    throw new Error("unknown error occurred while reading data");

  const deletedPriority = prioritiesQuery.data.find((p) => p.id === id);

  if (!deletedPriority) throw new Error("Priority not found");

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
    throw new Error("Something went wrong while deleting priorities");

  const upsertQuery = await supabase
    .from("priorities")
    .upsert(mapManyPrioritiesToServer(updatedPriorities));

  if (upsertQuery.error)
    throw new Error("Something went wrong while updating priorities");
}

export async function deleteManyPriorities(args: DeleteManyPrioritiesRequest) {
  const parsedArgs = parseWithSchema({
    data: args,
    schema: deleteManyPrioritiesRequestSchema,
  });

  if (!parsedArgs) throw new Error("Invalid arguments");

  const supabase = await createClient();

  const prioritiesQuery = await supabase.from("priorities").select();

  if (!prioritiesQuery.data || prioritiesQuery.error)
    throw new Error("Something went wrong while fetching priorities");

  const existingPriorities = mapManyPrioritiesToClient(prioritiesQuery.data);

  const updatedPriorities = removeOrderGaps(
    existingPriorities.filter((p) => !parsedArgs.priorityIds.includes(p.id)),
  );

  const upsertQuery = await supabase
    .from("priorities")
    .upsert(mapManyPrioritiesToServer(updatedPriorities));

  if (upsertQuery.error)
    throw new Error("Something went wrong while updating priorities");
}
