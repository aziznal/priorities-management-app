"use server";

import { Priority } from "../core/priority-type";
import { getPriority } from "./get";
import { updatePriorityById } from "./update";

export async function completePriority(args: { priorityId: Priority["id"] }) {
  const priority = await getPriority({ priorityId: args.priorityId });

  return updatePriorityById({
    priorityId: args.priorityId,
    updatedPriority: {
      body: priority.body + " (DONE)",
    },
  });
}

export async function uncompletePriority(args: { priorityId: Priority["id"] }) {
  const priority = await getPriority({ priorityId: args.priorityId });

  return updatePriorityById({
    priorityId: args.priorityId,
    updatedPriority: {
      body: priority.body.replaceAll(" (DONE)", ""),
    },
  });
}
