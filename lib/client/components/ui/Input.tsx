import React, { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/client/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          `m-0 h-[40px] w-full flex-1 rounded-full border-2 p-3 shadow-[3px_4px] outline-none`,
          "hover:bg-lime-400 hover:outline-none active:bg-lime-400 active:outline-none",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
