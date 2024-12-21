import {
  UpdateManyPrioritiesRequest,
  UpdatePriorityRequest,
} from "@/app/api/priorities/schema";
import { Priority } from "@/lib/common/types/priority";

export async function sendUpdatePriorityByIdRequest({
  id,
  updatedPriority,
}: {
  id: Priority["id"];
  updatedPriority: UpdatePriorityRequest;
}): Promise<void> {
  await fetch(`/api/priorities/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      body: updatedPriority.body,
    } satisfies UpdatePriorityRequest),
  });
}

export async function sendUpdateManyPrioritiesRequest(
  body: UpdateManyPrioritiesRequest,
): Promise<void> {
  await fetch("/api/priorities", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
