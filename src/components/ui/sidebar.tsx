"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue>({
  open: true,
  setOpen: () => {},
  toggleSidebar: () => {},
});

export function useSidebar() {
  return React.useContext(SidebarContext);
}

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  const toggleSidebar = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
      <div className="min-h-screen bg-[#0f0f0f] flex w-full font-sans antialiased text-[#ededed]">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => useSidebar().setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#1f1f1f] bg-[#111111] transition-all duration-300 ease-in-out md:static md:z-30",
          open ? "w-56 translate-x-0" : "w-0 -translate-x-full md:w-0 md:translate-x-0 md:hidden",
          className
        )}
      >
        {children}
      </aside>
    </>
  );
}

export function SidebarHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex h-12 items-center px-4 border-b border-[#1f1f1f]", className)}>
      {children}
    </div>
  );
}

export function SidebarContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex-1 overflow-y-auto px-2 py-2 space-y-1", className)}>{children}</div>;
}

export function SidebarGroup({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("space-y-1", className)}>{children}</div>;
}

export function SidebarGroupLabel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[#525252]", className)}>
      {children}
    </div>
  );
}

export function SidebarGroupContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("space-y-0.5", className)}>{children}</div>;
}

export function SidebarMenu({ className, children }: { className?: string; children: React.ReactNode }) {
  return <ul className={cn("space-y-0.5", className)}>{children}</ul>;
}

export function SidebarMenuItem({ className, children }: { className?: string; children: React.ReactNode }) {
  return <li className={cn("", className)}>{children}</li>;
}

export function SidebarMenuButton({
  className,
  isActive,
  children,
  ...props
}: {
  className?: string;
  isActive?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-all",
        isActive
          ? "bg-[#1f1f1f] text-[#ededed]"
          : "text-[#737373] hover:bg-[#1a1a1a] hover:text-[#a3a3a3]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SidebarFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("px-3 py-3 border-t border-[#1f1f1f]", className)}>
      {children}
    </div>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={cn("h-8 w-8 text-[#737373] hover:text-[#ededed] hover:bg-[#1a1a1a]", className)}
      title="Toggle Sidebar"
    >
      <PanelLeft className="w-4 h-4" />
    </Button>
  );
}
