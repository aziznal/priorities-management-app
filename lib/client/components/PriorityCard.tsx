import { LucideGripVertical, LucideTrash } from "lucide-react";
import { cn } from "../utils";
import { formatDate } from "@/lib/common/helpers/date";

export const PriorityCard: React.FC<{
  body: string;
  createdAt: string;
  onDeleteClicked: () => void;
  className?: string;
}> = ({ body, createdAt, className, ...props }) => {
  return (
    <div
      className={cn(
        "flex items-start justify-between rounded-lg border-2 bg-lime-100 p-4 shadow-[4px_4px]",
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <LucideGripVertical />

        <div className="flex flex-col gap-2">
          <p>{body}</p>

          <p className="text-sm text-zinc-500">{formatDate(createdAt)}</p>
        </div>
      </div>

      <LucideTrash
        className="cursor-pointer"
        onClick={props.onDeleteClicked}
        size="20"
      />
    </div>
  );
};
