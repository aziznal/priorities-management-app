import { Input } from "@/lib/client/components";
import { cn } from "@/lib/client/utils";
import { LucideSearch, LucideX } from "lucide-react";
import { useEffect, useRef } from "react";

export const PriorityFilterInput: React.FC<{
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
}> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const clearSearchQuery = () => props.onValueChange("");

  // shortcut trigger
  useEffect(() => {
    const inputElement = inputRef.current;

    if (!inputElement) return;

    const focusInput = (e: KeyboardEvent) => {
      // make sure we're not typing in an input
      const currentElementInFocus = document.activeElement;

      if (
        currentElementInFocus?.tagName === "INPUT" ||
        currentElementInFocus?.tagName === "TEXTAREA"
      )
        return;

      if (e.key !== "/") return;

      e.preventDefault();
      e.stopPropagation();

      inputElement.focus();
    };

    document.addEventListener("keydown", focusInput);

    return () => {
      document.removeEventListener("keydown", focusInput);
    };
  }, []);

  return (
    <Input
      value={props.value}
      onChange={(e) => props.onValueChange(e.target.value)}
      placeholder="/"
      ref={inputRef}
      className={cn("max-w-[300px]", props.className)}
      prefixElement={<LucideSearch />}
      suffixElement={
        props.value.length > 0 ? (
          <LucideX className="cursor-pointer" onClick={clearSearchQuery} />
        ) : null
      }
    />
  );
};
