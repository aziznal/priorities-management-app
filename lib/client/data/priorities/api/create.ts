import { CreatePriorityRequest } from "@/app/api/priorities/schema";

export async function sendCreateNewPriorityRequest(
  body: CreatePriorityRequest,
): Promise<void> {
  await fetch("/api/priorities", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
