import { Priority } from "./types/priority";

export function getLastOrder(data: Priority[]): number {
  if (data.length === 0) return 0;
  return Math.max(...data.map((p) => p.order));
}
