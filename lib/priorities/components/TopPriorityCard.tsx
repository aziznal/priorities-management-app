import { cn } from "@/lib/client/utils";
import { IconButton } from "@/lib/client/components";
import { LucideFullscreen } from "lucide-react";
import { AnimatedBorderWrapper } from "@/lib/client/components/AnimatedBorderWrapper";

export const TopPriorityCard: React.FC<{
  className?: string;
  body: string;

  isFullscreen: boolean;
  onFullscreenToggled: () => void;
}> = (props) => {
  return (
    <AnimatedBorderWrapper
      className={cn(
        "flex items-center justify-center overflow-clip",
        !props.isFullscreen && "rounded-3xl shadow-[4px_4px] md:border-[12px]",
        props.isFullscreen && "h-full w-full rounded-none border-[12px]",
        props.className,
      )}
    >
      <div
        className={cn(
          "relative flex h-full min-h-[250px] w-full items-center justify-center bg-white p-4",
        )}
      >
        <IconButton
          onClick={props.onFullscreenToggled}
          className="absolute right-4 top-4"
        >
          <LucideFullscreen />
        </IconButton>

        <h1
          className={cn(
            "text-balance text-center font-black",
            !props.isFullscreen && "max-w-[60vw] text-xl md:text-3xl",
            props.isFullscreen && "max-w-[80vw] text-3xl md:text-5xl",
          )}
        >
          {props.body}
        </h1>
      </div>
    </AnimatedBorderWrapper>
  );
};
