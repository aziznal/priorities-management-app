import { Input } from "@/lib/client/components";
import { LucideSearch, LucideX } from "lucide-react";
import { useEffect, useRef } from "react";

export const PriorityFilterInput: React.FC<{
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
      className="max-w-[300px]"
      prefixElement={<LucideSearch />}
      suffixElement={
        props.value.length > 0 ? (
          <LucideX className="cursor-pointer" onClick={clearSearchQuery} />
        ) : null
      }
    />
  );
};
