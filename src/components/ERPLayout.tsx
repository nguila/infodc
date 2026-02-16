import { ERPSidebar } from "@/components/ERPSidebar";

interface ERPLayoutProps {
  children: React.ReactNode;
}

export function ERPLayout({ children }: ERPLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <ERPSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
