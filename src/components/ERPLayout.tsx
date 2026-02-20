import { useState } from "react";
import { ERPSidebar } from "@/components/ERPSidebar";

interface ERPLayoutProps {
  children: React.ReactNode;
}

export function ERPLayout({ children }: ERPLayoutProps) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex min-h-screen w-full">
      <ERPSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className="flex-1 overflow-auto light-content bg-background text-foreground">
        {children}
      </main>
    </div>
  );
}
