import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Supabase-style badges: pill shape, low-opacity bg tint + matching text color.
 * No border-radius square corners. Small text, compact padding.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary border border-primary/20",
        secondary: "bg-muted text-muted-foreground border border-border",
        destructive: "bg-destructive/15 text-destructive border border-destructive/20",
        outline: "border border-border text-muted-foreground bg-transparent",
        success: "bg-primary/15 text-primary border border-primary/20" /* reuse brand green */,
        warning: "bg-amber-500/15 text-amber-500 border border-amber-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
