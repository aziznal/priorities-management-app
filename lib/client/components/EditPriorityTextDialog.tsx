import { Priority } from "@/lib/common/types";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/Dialog";

export const EditPriortyTextDialog: React.FC<{
  onChangesSubmitted: (text: Priority["body"]) => void;
}> = () => {
  return (
    <Dialog>
      <DialogHeader>
        <DialogTitle>Edit Priority Descriptions</DialogTitle>

        <DialogDescription>
          Change the text describing your priority
        </DialogDescription>
      </DialogHeader>

      <DialogContent>
        <textarea rows={5} />
      </DialogContent>

      <DialogFooter>
        <DialogClose>Ok</DialogClose>
        <DialogClose>Cancel</DialogClose>
      </DialogFooter>
    </Dialog>
  );
};
