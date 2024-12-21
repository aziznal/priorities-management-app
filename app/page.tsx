"use client";

import { useGetPrioritiesQuery } from "@/lib/client/data/priorities/queries";
import { cn } from "@/lib/client/utils";
import { LucideGripVertical } from "lucide-react";
import { PropsWithChildren } from "react";

export default function Home() {
  const prioritiesQuery = useGetPrioritiesQuery();

  const topPriority = prioritiesQuery.data?.find((p) => p.order === 1);

  return (
    <main className="flex flex-col items-center mt-12">
      <h1 className="text-2xl font-bold mb-8">Prioritize yo shit</h1>

      <section className="flex flex-col lg:flex-row gap-8 mb-24">
        <TopPriorityCard className="border-2 bg-lime-400">
          <h1 className="text-xl font-bold">{topPriority?.body}</h1>
        </TopPriorityCard>
      </section>

      <section className="">
        <h2 className="text-2xl font-bold">Others</h2>
      </section>
    </main>
  );
}

const TopPriorityCard: React.FC<
  {
    className?: string;
  } & PropsWithChildren
> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "p-4 border lg:order-none shadow-[4px_4px] rounded-xl bg-zinc-100 h-fit w-[300px] hover:border-2 cursor-grab select-none",
        className,
      )}
    >
      <div className="flex gap-2 items-center">
        <LucideGripVertical />
        {children}
      </div>
    </div>
  );
};
