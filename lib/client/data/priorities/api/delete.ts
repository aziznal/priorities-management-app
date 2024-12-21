import { DeleteManyPrioritiesRequest } from "@/app/api/priorities/schema";

export async function sendDeletePriorityByIdRequest(id: string): Promise<void> {
  await fetch(`/api/priorities/${id}`, {
    method: "DELETE",
  });
}

export async function sendDeleteManyPrioritiesRequest(
  body: DeleteManyPrioritiesRequest,
): Promise<void> {
  await fetch(`/api/priorities`, {
    method: "DELETE",
    body: JSON.stringify(body),
  });
}
