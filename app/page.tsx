"use client";

import {
  EmptyText,
  Input,
  PriorityCard,
  TopPriorityCard,
} from "@/lib/client/components";
import { Button } from "@/lib/client/components";
import {
  useCreatePriorityMutation,
  useDeletePriorityByIdMutation,
  useGetPrioritiesQuery,
} from "@/lib/client/data/priorities";
import { Priority } from "@/lib/common/types";
import { LucideSearch } from "lucide-react";
import { useMemo } from "react";

export default function Home() {
  const prioritiesQuery = useGetPrioritiesQuery();

  const createPriorityMutation = useCreatePriorityMutation();
  const deletePriorityByIdMutation = useDeletePriorityByIdMutation();

  const topPriority = useMemo(() => {
    if (!prioritiesQuery.isSuccess) return undefined;

    return prioritiesQuery.data.find((p) => p.order === 1);
  }, [prioritiesQuery.data, prioritiesQuery.isSuccess]);

  const otherPriorities: Priority[] = useMemo(() => {
    if (!prioritiesQuery.isSuccess) return [];

    return prioritiesQuery.data.slice(1);
  }, [prioritiesQuery.data, prioritiesQuery.isSuccess]);

  return (
    <main className="container mt-6 flex flex-col">
      <h1 className="mb-8 text-balance text-center text-3xl font-black">
        LIFE PRIORITIES MANAGEMENT
      </h1>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Top Priority</h2>

        {topPriority && (
          <TopPriorityCard>
            <h1 className="text-xl font-bold">{topPriority.body}</h1>
          </TopPriorityCard>
        )}

        {!topPriority && <EmptyText>No top priority has been set</EmptyText>}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Others</h2>

            <Button
              onClick={() =>
                createPriorityMutation.mutate({ body: "Untittied" })
              }
            >
              New +
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <Input className="max-w-[300px]" prefixElement={<LucideSearch />} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 overflow-y-auto pb-4 pr-1">
          {otherPriorities.map((p) => (
            <PriorityCard
              key={p.id}
              className="min-w-[350px]"
              body={p.body}
              createdAt={p.createdAt}
              onDeleteClicked={() => deletePriorityByIdMutation.mutate(p.id)}
            ></PriorityCard>
          ))}

          {otherPriorities.length === 0 && (
            <EmptyText>No other priorities</EmptyText>
          )}
        </div>
      </section>
    </main>
  );
}
