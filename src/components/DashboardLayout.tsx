import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
  { code: "AUD", symbol: "$" },
  { code: "CAD", symbol: "$" },
];

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("USD");
  const [hasNotifications] = useState(true);

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
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>
        
        <SidebarInset className="flex flex-col w-full">
          {/* Header - responsive */}
          <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-40">
            <div className="flex items-center gap-3 h-14 px-4">
              {/* Sidebar trigger - desktop only */}
              <div className="hidden md:block">
                <SidebarTrigger />
              </div>
              
              {/* Logo - mobile only */}
              <div className="md:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
                <span className="font-semibold">PayPing</span>
              </div>
              
              {/* Title - desktop only */}
              <div className="hidden md:block flex-1">
                <h1 className="text-lg font-semibold">{title}</h1>
                {description && (
                  <p className="text-xs text-muted-foreground">{description}</p>
                )}
              </div>
              
              {/* Spacer for mobile */}
              <div className="flex-1 md:hidden" />
              
              {/* Right side actions */}
              <div className="flex items-center gap-2">
                {/* Currency selector - desktop only */}
                <div className="hidden lg:block">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-20 h-9">
                      <DollarSign className="w-3 h-3 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((cur) => (
                        <SelectItem key={cur.code} value={cur.code}>
                          {cur.symbol} {cur.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-9 w-9">
                      <Bell className="w-4 h-4" />
                      {hasNotifications && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72">
                    <div className="p-3 text-sm">
                      <p className="font-medium mb-1">Payment received!</p>
                      <p className="text-muted-foreground text-xs">
                        Acme Corp paid invoice #INV-001 ($2,500)
                      </p>
                    </div>
                    <DropdownMenuItem className="justify-center text-primary">
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Demo badge */}
                <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                  Demo
                </Badge>
              </div>
            </div>
            
            {/* Mobile page title */}
            <div className="md:hidden px-4 pb-3">
              <h1 className="text-xl font-bold">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </header>

          {/* Main Content - with bottom padding for mobile nav */}
          <main className="flex-1 p-4 pb-24 md:pb-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}
