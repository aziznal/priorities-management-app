import { cn } from "@/lib/client/utils";
import { PropsWithChildren } from "react";

interface IconButtonProps
  extends PropsWithChildren,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function IconButton({ className, children, ...props }: IconButtonProps) {
  return (
    <button {...props} className={cn(className)}>
      {children}
    </button>
  );
}
