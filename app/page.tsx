"use client";

import {
  EmptyText,
  PriorityCard,
  TopPriorityCard,
} from "@/lib/client/components";
import { Button } from "@/lib/client/components";
import { PriorityFilterInput } from "@/lib/client/components/PriorityFilterInput";
import {
  useCreatePriorityMutation,
  useDeletePriorityByIdMutation,
} from "@/lib/client/data/priorities";
import { usePriorities } from "@/lib/client/hooks/usePriorities";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

export default function Home() {
  const createPriorityMutation = useCreatePriorityMutation();
  const deletePriorityByIdMutation = useDeletePriorityByIdMutation();

  const [searchQuery, setSearchQuery] = useState("");

  const { priorities, topPriority, isFiltering, movePriority } = usePriorities({
    searchQuery,
  });

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

          <PriorityFilterInput
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto overflow-x-visible pb-4 pr-1">
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={(event) => {
              if (!event.over) return;

              movePriority({
                fromId: event.active.id.toString(),
                toId: event.over.id.toString(),
              });
            }}
          >
            <SortableContext
              items={priorities}
              disabled={isFiltering}
              strategy={verticalListSortingStrategy}
            >
              {priorities.map((p) => (
                <PriorityCard
                  key={p.id}
                  className="min-w-[350px]"
                  id={p.id}
                  body={p.body}
                  createdAt={p.createdAt}
                  onDeleteClicked={() =>
                    deletePriorityByIdMutation.mutate(p.id)
                  }
                  isDraggingDisabled={isFiltering}
                />
              ))}
            </SortableContext>
          </DndContext>

          {priorities.length === 0 && (
            <EmptyText>No other priorities</EmptyText>
          )}
        </div>
      </section>
    </main>
  );
}
