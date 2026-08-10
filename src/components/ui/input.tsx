import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-[#2a2a2a] bg-[#161616] px-3 py-2 text-sm text-[#ededed] shadow-xs ring-offset-[#111111] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#525252] focus-visible:outline-none focus-visible:border-[#525252] focus-visible:ring-1 focus-visible:ring-[#525252] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
