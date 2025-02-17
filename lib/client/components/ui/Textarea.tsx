import { forwardRef, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/client/utils";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  prefixElement?: ReactNode;
  suffixElement?: ReactNode;
};

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={cn(
          "mx-1 w-full rounded-xl border-2 bg-white p-4 font-mono shadow-[4px_4px] outline-none hover:outline-none active:outline-none dark:bg-emerald-950 dark:focus-within:bg-emerald-800 dark:hover:bg-emerald-800 dark:active:bg-emerald-800",
          className,
        )}
      />
    );
  },
);
Textarea.displayName = "Input";
