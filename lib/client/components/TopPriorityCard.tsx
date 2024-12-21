import { cn } from "@/lib/client/utils";
import { LucideGripVertical } from "lucide-react";
import { PropsWithChildren } from "react";

export const TopPriorityCard: React.FC<
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
