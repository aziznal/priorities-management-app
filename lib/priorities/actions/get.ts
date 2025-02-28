"use server";

import { createClient } from "@/lib/db/supabase/server";
import { mapManyPrioritiesToClient, mapOnePriorityToClient } from "../mappers";
import { Priority } from "../core/priority-type";

/** Returns a list of all available priorities */
export async function getPriorities() {
  const supabase = await createClient();

  const prioritiesQuery = await supabase
    .from("priorities")
    .select()
    .order("order");

  if (!prioritiesQuery.data || prioritiesQuery.error)
    throw new Error("unknown error occurred while reading data");

  return mapManyPrioritiesToClient(prioritiesQuery.data);
}

export async function getPriority(args: {
  priorityId: Priority["id"];
}): Promise<Priority> {
  const supabase = await createClient();

  const priorityQuery = await supabase
    .from("priorities")
    .select()
    .eq("id", args.priorityId)
    .single();

  if (!priorityQuery.data || priorityQuery.error)
    throw new Error("unknown error occurred while reading data");

  return mapOnePriorityToClient(priorityQuery.data);
}
