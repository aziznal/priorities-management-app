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
        "h-fit w-[300px] cursor-grab select-none rounded-xl border-2 bg-amber-500 p-4 shadow-[4px_4px] hover:border-2 lg:order-none",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <LucideGripVertical />
        {children}
      </div>
    </div>
  );
};
