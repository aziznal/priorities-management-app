import { LucideGripVertical, LucidePencil, LucideTrash } from "lucide-react";
import { cn } from "../utils";
import { getElapsedTime } from "@/lib/common/helpers/date";
import { EditPriortyTextDialog } from "./EditPriorityTextDialog";
import { useUpdatePriorityMutation } from "../data/priorities";
import { useCallback, useState } from "react";

export const PriorityCard: React.FC<{
  id: string;
  body: string;
  createdAt: string;
  onDeleteClicked: () => void;
  className?: string;
}> = ({ className, ...props }) => {
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

  return (
    <>
      <div
        className={cn(
          "flex items-start justify-between rounded-lg border-2 bg-lime-100 p-4 shadow-[4px_4px]",
          className,
        )}
      >
        <div className="flex items-start gap-2">
          <LucideGripVertical />

          <div className="flex flex-col gap-2">
            <div className="group/priority-body flex items-center gap-1">
              <p className="">{props.body}</p>

              <LucidePencil
                onClick={() => setIsEditDialogOpen(true)}
                size="18"
                className="invisible cursor-pointer group-hover/priority-body:visible"
              />
            </div>

            <p className="text-sm text-zinc-500">
              {getElapsedTime(props.createdAt)}
            </p>
          </div>
        </div>

        <LucideTrash
          className="cursor-pointer"
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
