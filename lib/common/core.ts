import { Priority } from "./types/priority";

export function getLastOrder(data: Priority[]): number {
  if (data.length === 0) return 0;
  return Math.max(...data.map((p) => p.order));
}

/**
 * makes sure all orders are sequential with no gaps e.g. from deleting a priority
 */
export function removeOrderGaps(data: Priority[]): Priority[] {
  return data
    .toSorted((a, b) => a.order - b.order)
    .map((p, i) => ({
      ...p,
      order: i + 1,
    }));
}
