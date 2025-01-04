"use client";

import {
  EmptyText,
  PriorityCard,
  TopPriorityCard,
} from "@/lib/client/components";
import { Button } from "@/lib/client/components";
import { LoadingSpinner } from "@/lib/client/components/LoadingSpinner";
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
  return (
    <main className="container mt-6 flex flex-col">
      <h1 className="mb-8 text-balance text-center text-3xl font-black">
        PRIORITIES MANAGEMENT
      </h1>

      <TopPrioritySection />

      <OtherPrioritiesSection />
    </main>
  );
}

const TopPrioritySection: React.FC = () => {
  const { topPriority, isLoading, isError } = usePriorities();

  if (isLoading)
    return (
      <div className="mb-4 flex h-[350px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (isError) return <div>Error!</div>;

  return (
    <section className="mb-16 flex flex-col items-center">
      <h2 className="mb-4 animate-bounce text-xl font-black">Top Priority</h2>

      {topPriority && <TopPriorityCard body={topPriority.body} />}

      {!topPriority && <EmptyText>No top priority has been set</EmptyText>}
    </section>
  );
};

const OtherPrioritiesSection: React.FC = () => {
  const createPriorityMutation = useCreatePriorityMutation();
  const deletePriorityByIdMutation = useDeletePriorityByIdMutation();

  const [searchQuery, setSearchQuery] = useState("");

  const { priorities, isFiltering, movePriority } = usePriorities({
    searchQuery,
  });

  const { isLoading, isError } = usePriorities();

  if (isError) return <div>Error!</div>;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Other Priorities</h2>

          <Button
            onClick={() => createPriorityMutation.mutate({ body: "Untittied" })}
          >
            New +
          </Button>
        </div>

        <PriorityFilterInput
          className="self-end"
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
      </div>

      {isLoading && (
        <div className="flex h-[200px] items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && (
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
      )}
    </section>
  );
};
