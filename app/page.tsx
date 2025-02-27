"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/client/utils";
import { Button, LoadingSpinner, EmptyText } from "@/lib/client/components";

import { PriorityCard } from "@/lib/priorities/components/PriorityCard";
import { PriorityFilterInput } from "@/lib/priorities/components/PriorityFilterInput";
import { TopPriorityCard } from "@/lib/priorities/components/TopPriorityCard";
import { usePriorities } from "@/lib/priorities/hooks/usePriorities";
import {
  useCreatePriorityMutation,
  useDeletePriorityByIdMutation,
} from "@/lib/priorities/queries";

import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DarkmodeToggle } from "@/lib/common/darkmode/DarkmodeToggle";
import { AnimatePresence } from "motion/react";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="mt-6 flex flex-col">
      <DarkmodeToggle className="mx-4 mb-4 self-end sm:mb-0" />

      <main className="container">
        <h1 className="mb-8 text-balance text-center text-3xl font-black">
          PRIORITIES MANAGEMENT
        </h1>

        <TopPrioritySection />

        <OtherPrioritiesSection />
      </main>
    </div>
  );
}

const TopPrioritySection: React.FC = () => {
  const { topPriority, isLoading, isError } = usePriorities();

  const [isFullscreen, setIsFullscreen] = useState(false);

  const enableFullscreen = () => {
    document.documentElement.requestFullscreen();
    setIsFullscreen(true);
  };

  const disableFullscreen = () => {
    document.exitFullscreen();
    setIsFullscreen(false);
  };

  // shortcut to cancel fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    const handleCancelFullscreenEvent = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsFullscreen(false);
    };

    window.addEventListener("keydown", handleCancelFullscreenEvent);

    return () =>
      window.removeEventListener("keydown", handleCancelFullscreenEvent);
  }, [isFullscreen]);

  if (isLoading)
    return (
      <div className={cn("mb-4 flex h-[350px] items-center justify-center")}>
        <LoadingSpinner />
      </div>
    );

  if (isError) return <div>Error!</div>;

  return (
    <section
      className={cn(
        "mb-16 flex flex-col items-center",
        isFullscreen &&
          "fixed left-0 top-0 z-50 h-[100dvh] w-[99dvw] justify-center",
      )}
    >
      <h2
        className={cn(
          "mb-4 animate-bounce text-xl font-black",
          isFullscreen && "hidden",
        )}
      >
        Top Priority
      </h2>

      {topPriority && (
        <TopPriorityCard
          body={topPriority.body}
          isFullscreen={isFullscreen}
          onFullscreenToggled={
            isFullscreen ? disableFullscreen : enableFullscreen
          }
        />
      )}

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
            onClick={() => createPriorityMutation.mutate({ body: "Untitled" })}
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
              <AnimatePresence>
                {priorities.map((p, i) => (
                  <PriorityCard
                    key={p.id}
                    index={i}
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
              </AnimatePresence>
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
