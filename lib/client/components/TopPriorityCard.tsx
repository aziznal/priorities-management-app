import { cn } from "@/lib/client/utils";
import { AnimatedBorderWrapper } from "./AnimatedBorderWrapper";

export const TopPriorityCard: React.FC<{
  className?: string;
  body: string;
}> = (props) => {
  return (
    <AnimatedBorderWrapper
      className={cn(
        "flex items-center justify-center overflow-clip rounded-xl shadow-[4px_4px]",
        props.className,
      )}
    >
      <div className="flex h-full min-h-[250px] w-full max-w-[450px] items-center justify-center text-balance bg-white p-4 text-center">
        <h1 className="text-2xl font-bold">{props.body}</h1>
      </div>
    </AnimatedBorderWrapper>
  );
};
