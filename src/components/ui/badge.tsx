import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-1 focus:ring-[#525252]",
  {
    variants: {
      variant: {
        default:
          "bg-[#2a2a2a] text-[#a3a3a3] border border-[#3a3a3a]",
        secondary:
          "bg-[#1f1f1f] text-[#737373] border border-[#2a2a2a]",
        destructive:
          "bg-red-950/50 text-red-400 border border-red-900/50",
        outline:
          "border border-[#2a2a2a] text-[#737373]",
        success:
          "bg-emerald-950/50 text-emerald-400 border border-emerald-900/50",
        warning:
          "bg-amber-950/40 text-amber-400 border border-amber-900/40",
        brand:
          "bg-[#FDB813] text-[#111111] border-transparent",
        positive:
          "bg-emerald-950/50 text-emerald-400 border border-emerald-900/50",
        negative:
          "bg-red-950/50 text-red-400 border border-red-900/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
