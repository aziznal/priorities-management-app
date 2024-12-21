import { LucideGripVertical, LucideTrash } from "lucide-react";
import { PropsWithChildren } from "react";

export const PriorityCard: React.FC<
  PropsWithChildren & { onDeleteClicked: () => void }
> = ({ children, ...props }) => {
  return (
    <div className="flex items-start justify-between rounded-lg border-2 bg-lime-100 p-4 shadow-[4px_4px]">
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
