import { LucideGripVertical, LucidePencil, LucideTrash } from "lucide-react";
import { cn } from "../utils";
import { getElapsedTime } from "@/lib/common/helpers/date";
import { EditPriortyTextDialog } from "./EditPriorityTextDialog";
import { useUpdatePriorityMutation } from "../data/priorities";
import { useCallback, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const PriorityCard: React.FC<{
  id: string;
  body: string;
  createdAt: string;
  onDeleteClicked: () => void;
  className?: string;
}> = ({ className, ...props }) => {
  const sortable = useSortable({
    id: props.id,
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const updateTextMutation = useUpdatePriorityMutation();

  const updateText = useCallback(
    (text: string) => {
      return updateTextMutation.mutate({
        id: props.id,
        updatedPriority: {
          body: text,
        },
      });
    },
    [props.id, updateTextMutation],
  );

  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  return (
    <>
      <div
        style={style}
        {...sortable.attributes}
        className={cn(
          "group/priority-body flex items-start justify-between gap-3 rounded-lg border-2 bg-lime-200 p-4 shadow-[4px_4px]",
          className,
        )}
      >
        <div className="flex items-start gap-2">
          <div ref={sortable.setNodeRef} {...sortable.listeners}>
            <LucideGripVertical className="shrink-0 cursor-grab active:cursor-grabbing" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-1">
              <p className="">{props.body}</p>

              <LucidePencil
                onClick={() => setIsEditDialogOpen(true)}
                size="18"
                className="invisible shrink-0 cursor-pointer group-hover/priority-body:visible"
              />
            </div>

            <p className="text-sm text-zinc-500">
              {getElapsedTime(props.createdAt)}
            </p>
          </div>
        </div>

        <LucideTrash
          className="shrink-0 cursor-pointer"
          onClick={props.onDeleteClicked}
          size="20"
        />
      </div>

      <EditPriortyTextDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        value={props.body}
        onChangesSubmitted={updateText}
      />
    </>
  );
};
