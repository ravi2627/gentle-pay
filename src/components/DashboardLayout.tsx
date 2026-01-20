import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="bg-background border-b border-border sticky top-0 z-40">
            <div className="flex items-center gap-4 h-14 px-4">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-lg font-semibold">{title}</h1>
                {description && (
                  <p className="text-xs text-muted-foreground">{description}</p>
                )}
              </div>
              <Badge variant="secondary" className="text-xs">
                Demo Mode
              </Badge>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
