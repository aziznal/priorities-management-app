import { Priority } from "../core/priority-type";
import { useCallback, useRef } from "react";
import {
  Button,
  Textarea,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/lib/client/components";

export const EditPriortyTextDialog: React.FC<{
  open: boolean;
  onOpenChange: (state: boolean) => void;

  value: string;
  onChangesSubmitted: (text: Priority["body"]) => void;
}> = (props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submitChanges = useCallback(() => {
    if (!textareaRef.current) return;
    props.onChangesSubmitted(textareaRef.current.value);
  }, [props]);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Priority Descriptions</DialogTitle>

          <DialogDescription>
            Change the text describing your priority
          </DialogDescription>
        </DialogHeader>

        <Textarea defaultValue={props.value} ref={textareaRef} rows={5} />

        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>

          <DialogClose onClick={submitChanges} asChild>
            <Button variant="green">Ok</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
