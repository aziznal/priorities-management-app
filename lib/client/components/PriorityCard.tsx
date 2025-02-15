import { LucideGripVertical, LucidePencil, LucideTrash } from "lucide-react";
import { cn } from "../utils";
import { getElapsedTime } from "@/lib/common/helpers/date";
import { EditPriortyTextDialog } from "./EditPriorityTextDialog";
import { useUpdatePriorityMutation } from "../data/priorities";
import { useCallback, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { IconButton } from "./ui/buttons/IconButton";

export const PriorityCard: React.FC<{
  id: string;
  body: string;
  createdAt: string;
  onDeleteClicked: () => void;
  className?: string;

  isDraggingDisabled: boolean;
}> = ({ className, ...props }) => {
  const sortable = useSortable({
    id: props.id,
  });

  const isDone = props.body.includes("(DONE)");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);

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

  const confirmDelete = () => {
    setIsConfirmDeleteDialogOpen(true);
  };

  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  return (
    <>
      <div
        style={style}
        ref={sortable.setNodeRef}
        className={cn(
          "group/priority-body flex items-start justify-between gap-3 rounded-lg border-2 bg-lime-300 p-4 shadow-[4px_4px]",
          isDone && "bg-lime-100",
          className,
        )}
      >
        <div className="flex items-start gap-2">
          <div>
            <LucideGripVertical
              {...sortable.attributes}
              {...sortable.listeners}
              className={cn(
                "shrink-0 cursor-grab touch-none focus:outline-none active:cursor-grabbing active:outline-none",
                props.isDraggingDisabled && "cursor-not-allowed text-lime-600",
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-1">
              <p className="flex flex-wrap gap-1">
                <span className={cn(isDone && "text-zinc-500 line-through")}>
                  {props.body}
                </span>

                {isDone && <span> ✅</span>}
              </p>

              <IconButton
                className="hidden group-hover/priority-body:block"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <LucidePencil size="18" />
              </IconButton>
            </div>

            <p className="text-sm opacity-55">
              {getElapsedTime(props.createdAt)}
            </p>
          </div>
        </div>

        <IconButton onClick={confirmDelete}>
          <LucideTrash size="20" />
        </IconButton>
      </div>

      <EditPriortyTextDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        value={props.body}
        onChangesSubmitted={updateText}
      />

      <ConfirmDeleteDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
        onConfirm={props.onDeleteClicked}
      />
    </>
  );
};
