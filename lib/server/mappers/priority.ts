import { Priority } from "@/lib/common/types";
import { Database } from "@/lib/db/supabase/database.types";

type DatabasePriority = Database["public"]["Tables"]["priorities"]["Row"];

export function mapOnePriorityToClient(priority: DatabasePriority): Priority {
  return {
    id: priority.id,
    body: priority.body,
    order: priority.order,
    createdAt: priority.created_at,
  };
}

export function mapManyPrioritiesToClient(priorities: DatabasePriority[]) {
  return priorities.map(mapOnePriorityToClient);
}

export function mapOnePriorityToServer(priority: Priority): DatabasePriority {
  return {
    id: priority.id,
    body: priority.body,
    order: priority.order,
    created_at: priority.createdAt,
  };
}

export function mapManyPrioritiesToServer(
  priorities: Priority[],
): DatabasePriority[] {
  return priorities.map(mapOnePriorityToServer);
}
