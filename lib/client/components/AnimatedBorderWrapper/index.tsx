import { ReactNode } from "react";
import "./index.css";
import { cn } from "../../utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function AnimatedBorderWrapper({ children, className }: Props) {
  return (
    <div className={cn("animated-border rounded-2xl border-[6px]", className)}>
      {children}
    </div>
  );
}
