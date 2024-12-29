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
import { useFuzzyFilterPriorities } from "@/lib/client/hooks";
import { Priority } from "@/lib/common/types";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { LucideSearch, LucideX } from "lucide-react";
import { useMemo, useState } from "react";

export default function Home() {
  const prioritiesQuery = useGetPrioritiesQuery();

  const createPriorityMutation = useCreatePriorityMutation();
  const deletePriorityByIdMutation = useDeletePriorityByIdMutation();

  const topPriority = useMemo(() => {
    if (!prioritiesQuery.isSuccess) return undefined;
    return prioritiesQuery.data.find((p) => p.order === 1);
  }, [prioritiesQuery.data, prioritiesQuery.isSuccess]);

  const unfilteredPriorities: Priority[] = useMemo(() => {
    if (!prioritiesQuery.isSuccess) return [];
    return prioritiesQuery.data;
  }, [prioritiesQuery.data, prioritiesQuery.isSuccess]);

  const [searchQuery, setSearchQuery] = useState("");

  const clearSearchQuery = () => setSearchQuery("");

  const { filteredPriorities } = useFuzzyFilterPriorities({
    query: searchQuery,
    priorities: unfilteredPriorities,
  });

  const isFiltering = useMemo(
    () => !!searchQuery && searchQuery.length > 0,
    [searchQuery],
  );

  return (
    <main className="container mt-6 flex flex-col">
      <h1 className="mb-8 text-balance text-center text-3xl font-black">
        LIFE PRIORITIES MANAGEMENT
      </h1>

      <section className="mb-16 flex flex-col items-center">
        <h2 className="mb-4 text-xl font-semibold">Top Priority</h2>

        {topPriority && <TopPriorityCard body={topPriority.body} />}

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

          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-[300px]"
            prefixElement={<LucideSearch />}
            suffixElement={
              searchQuery.length > 0 ? (
                <LucideX
                  className="cursor-pointer"
                  onClick={clearSearchQuery}
                />
              ) : null
            }
          />
        </div>

        <div className="flex flex-wrap gap-4 overflow-y-auto pb-4 pr-1">
          <DndContext>
            <SortableContext
              items={unfilteredPriorities}
              disabled={isFiltering}
            >
              {filteredPriorities.map((p) => (
                <PriorityCard
                  key={p.id}
                  className="min-w-[350px]"
                  id={p.id}
                  body={p.body}
                  createdAt={p.createdAt}
                  onDeleteClicked={() =>
                    deletePriorityByIdMutation.mutate(p.id)
                  }
                />
              ))}
            </SortableContext>
          </DndContext>

          {unfilteredPriorities.length === 0 && (
            <EmptyText>No other priorities</EmptyText>
          )}
        </div>
      </section>
    </main>
  );
}
