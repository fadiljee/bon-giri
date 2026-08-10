import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#525252] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#ededed] text-[#111111] shadow-xs hover:bg-white active:scale-[0.98]",
        destructive:
          "bg-red-600/90 text-white shadow-xs hover:bg-red-600 active:scale-[0.98]",
        outline:
          "border border-[#2a2a2a] bg-transparent text-[#a3a3a3] shadow-xs hover:bg-[#1f1f1f] hover:text-[#ededed] hover:border-[#3a3a3a] active:scale-[0.98]",
        secondary:
          "bg-[#1f1f1f] text-[#a3a3a3] shadow-xs hover:bg-[#2a2a2a] hover:text-[#ededed] active:scale-[0.98]",
        ghost:
          "text-[#737373] hover:bg-[#1f1f1f] hover:text-[#ededed]",
        link:
          "text-[#a3a3a3] underline-offset-4 hover:underline hover:text-[#ededed] p-0 h-auto font-medium",
        success:
          "bg-emerald-900/50 text-emerald-400 border border-emerald-800 shadow-xs hover:bg-emerald-900/80 active:scale-[0.98]",
        brand:
          "bg-[#FDB813] text-[#111111] font-bold shadow-xs hover:bg-[#e0a210] active:scale-[0.98]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
