"use client";

import { IconButton } from "@/lib/client/components";
import { cn } from "@/lib/client/utils";
import { LucideMoon } from "lucide-react";
import { toggleDarkmode_client } from "./client";

interface DarkmodeToggleProps {
  className?: string;
}

export function DarkmodeToggle(props: DarkmodeToggleProps) {
  return (
    <IconButton
      className={cn("z-10 dark:text-slate-200", props.className)}
      onClick={toggleDarkmode_client}
    >
      <LucideMoon />
    </IconButton>
  );
}
