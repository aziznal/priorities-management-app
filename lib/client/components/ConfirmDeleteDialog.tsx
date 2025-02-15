import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/lib/client/components";
import { Button } from "@/lib/client/components";

export const ConfirmDeleteDialog: React.FC<{
  title?: string;
  description?: string;

  confirmButtonText?: string;

  open: boolean;
  onOpenChange: (state: boolean) => void;

  onConfirm: () => void;
}> = (props) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:w-fit">
        <DialogHeader className="sm:items-center">
          <DialogTitle>{props.title ?? "Are you sure?"}</DialogTitle>

          <DialogDescription>
            {props.description ?? "This action probably cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>

          <DialogClose onClick={props.onConfirm} asChild>
            <Button variant="red">
              {props.confirmButtonText ?? "Confirm"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
