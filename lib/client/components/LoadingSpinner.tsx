import { LucideLoader2 } from "lucide-react";
import { cn } from "../utils";

export const LoadingSpinner: React.FC<{ className?: string }> = (props) => {
  return (
    <div className={cn(props.className)}>
      <LucideLoader2 size="42" className="animate-spin" />
    </div>
  );
};
