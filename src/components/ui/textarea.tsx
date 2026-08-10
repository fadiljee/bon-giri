import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-[#2a2a2a] bg-[#161616] px-3 py-2 text-sm text-[#ededed] shadow-xs ring-offset-[#111111] placeholder:text-[#525252] focus-visible:outline-none focus-visible:border-[#525252] focus-visible:ring-1 focus-visible:ring-[#525252] disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
