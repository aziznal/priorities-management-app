import { LucideGripVertical, LucidePencil, LucideTrash } from "lucide-react";
import { getElapsedTime } from "@/lib/common/helpers/date";
import { EditPriortyTextDialog } from "./EditPriorityTextDialog";
import { useCallback, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconButton } from "@/lib/client/components";
import { ConfirmDeleteDialog } from "@/lib/client/components/ConfirmDeleteDialog";
import { cn } from "@/lib/client/utils";
import { useUpdatePriorityMutation } from "../queries";
import { motion } from "motion/react";
import { MotionSystem } from "@/lib/motion-system";

export const PriorityCard: React.FC<{
  id: string;
  body: string;
  createdAt: string;
  onDeleteClicked: () => void;
  className?: string;

  isDraggingDisabled: boolean;
  index: number;
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
        priorityId: props.id,
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
    transform: CSS.Translate.toString(sortable.transform),
    transition: sortable.transition,
  };

  return (
    <>
      <motion.div
        initial={{
          scale: 0,
        }}
        whileInView={{
          scale: 1,
        }}
        transition={{
          type: "spring",
          bounce: 0,
          duration: MotionSystem.duration.verySlow,
        }}
        exit={{
          scale: 0,
        }}
        viewport={{
          once: true,
        }}
        layout
      >
        <div
          style={style}
          ref={sortable.setNodeRef}
          className={cn(
            "group/priority-body flex items-start justify-between gap-3 rounded-lg border-2 bg-lime-300 p-4 text-black shadow-[4px_4px] dark:bg-blue-400",
            isDone && "bg-lime-100 dark:bg-blue-200",
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
                  props.isDraggingDisabled && "cursor-not-allowed opacity-30",
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-start">
                <p className="mr-4 flex flex-wrap gap-1">
                  <span className={cn(isDone && "line-through opacity-50")}>
                    {props.body}
                  </span>

                  {isDone && <span> ✅</span>}
                </p>

                <div className="flex items-center gap-2">
                  <IconButton
                    className="invisible group-hover/priority-body:visible"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <LucidePencil size="18" />
                  </IconButton>

                  <IconButton
                    onClick={confirmDelete}
                    className="invisible group-hover/priority-body:visible"
                  >
                    <LucideTrash size="20" />
                  </IconButton>
                </div>
              </div>

              <p className="text-sm opacity-55">
                {getElapsedTime(props.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

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
