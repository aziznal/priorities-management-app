"use server";

import { createClient } from "@/lib/db/supabase/server";
import { mapManyPrioritiesToClient } from "../mappers";

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
