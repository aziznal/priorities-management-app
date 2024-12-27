import React, { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/client/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  prefixElement?: ReactNode;
  suffixElement?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, suffixElement, prefixElement, ...props }, ref) => {
    return (
      <div
        className={cn(
          `box-border flex h-[40px] w-full items-center rounded-full border-2 bg-white px-2 shadow-[3px_4px]`,
          "focus-within:bg-lime-400 hover:bg-lime-400 hover:outline-none active:bg-lime-400 active:outline-none",
          className,
        )}
      >
        {!!prefixElement && <div>{prefixElement}</div>}

        <input
          ref={ref}
          {...props}
          className="mx-1 w-full border-none bg-transparent p-0 outline-none hover:outline-none active:outline-none"
        />

        {!!suffixElement && <div>{suffixElement}</div>}
      </div>
    );
  },
);
Input.displayName = "Input";
