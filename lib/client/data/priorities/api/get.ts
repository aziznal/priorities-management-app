import { GetPrioritiesResponse } from "@/app/api/priorities/route";
import { Priority } from "@/lib/common/types/priority";

export async function sendGetPrioritiesRequest(): Promise<Priority[]> {
  const res = await fetch("/api/priorities", {
    method: "GET",
  }).then(async (res) => (await res.json()) as GetPrioritiesResponse);

  return res.data;
}
