import { LucideGripVertical, LucideTrash } from "lucide-react";
import { PropsWithChildren } from "react";
import { cn } from "../utils";

export const PriorityCard: React.FC<
  PropsWithChildren & { onDeleteClicked: () => void; className?: string }
> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "flex items-start justify-between rounded-lg border-2 bg-lime-100 p-4 shadow-[4px_4px]",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <LucideGripVertical />

        <div>{children}</div>
      </div>

      <LucideTrash
        className="cursor-pointer"
        onClick={props.onDeleteClicked}
        size="20"
      />
    </div>
  );
};
