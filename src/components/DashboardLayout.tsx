import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, LogOut, Settings, Search, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

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
  const { isAuthenticated, user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("USD");
  const [hasNotifications] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile?.business_name || user?.email?.split("@")[0] || "User";

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

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
      <div className="min-h-screen flex w-full bg-muted/30">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>
        
        <SidebarInset className="flex flex-col w-full">
          {/* Header - Clean minimal design */}
          <header className="bg-background border-b border-border sticky top-0 z-40">
            <div className="flex items-center h-16 px-4 lg:px-6 gap-4">
              {/* Sidebar trigger - desktop only */}
              <div className="hidden md:flex items-center">
                <SidebarTrigger className="mr-2" />
              </div>
              
              {/* Logo - mobile only */}
              <div className="md:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Search - desktop */}
              <div className="hidden md:flex flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search invoices, clients..." 
                    className="pl-9 h-10 bg-muted/50 border-0 focus-visible:ring-1"
                  />
                </div>
              </div>
              
              {/* Spacer */}
              <div className="flex-1" />
              
              {/* Right side actions */}
              <div className="flex items-center gap-2">
                {/* Currency selector - desktop only */}
                <div className="hidden lg:block">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-[85px] h-9 bg-muted/50 border-0">
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
                    <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-muted">
                      <Bell className="w-[18px] h-[18px]" />
                      {hasNotifications && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-sm">Notifications</p>
                    </div>
                    <div className="p-4">
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-success text-lg">$</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Payment received</p>
                          <p className="text-muted-foreground text-xs mt-0.5">
                            Acme Corp paid invoice #INV-001 ($2,500)
                          </p>
                          <p className="text-muted-foreground text-xs mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuItem className="justify-center text-primary font-medium py-3 border-t border-border">
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent-foreground text-white text-xs font-medium">
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-3 border-b border-border">
                      <p className="font-semibold text-sm">{displayName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                    </div>
                    <div className="p-1">
                      <DropdownMenuItem onClick={() => navigate("/settings")} className="py-2.5">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-1">
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive py-2.5">
                        <LogOut className="w-4 h-4 mr-2" />
                        Log out
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Title Section */}
          <div className="bg-background border-b border-border px-4 lg:px-6 py-5">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 pb-24 md:pb-6 lg:p-6">
            {children}
          </main>
        </SidebarInset>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}
