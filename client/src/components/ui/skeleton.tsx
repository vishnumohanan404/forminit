import { cn } from "@/lib/utils";

/* Supabase-style skeleton: muted neutral pulse, no green tint */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
