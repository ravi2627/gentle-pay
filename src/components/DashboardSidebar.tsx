import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  CreditCard,
  LogOut,
  HelpCircle,
  Zap,
  BarChart3,
} from "lucide-react";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Invoices", url: "/dashboard", icon: FileText },
  { title: "Analytics", url: "/dashboard", icon: BarChart3 },
  { title: "Payment Links", url: "/dashboard", icon: CreditCard },
];

const secondaryNavItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help Center", url: "/faq", icon: HelpCircle },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile?.business_name || user?.email?.split("@")[0] || "User";

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-background">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base">RemindSwift</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-[18px] w-[18px]" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-[18px] w-[18px]" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        {!collapsed && user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className={`${collapsed ? "w-full" : "w-full justify-start"} text-muted-foreground hover:text-destructive hover:bg-destructive/10`}
          onClick={handleLogout}
        >
          <LogOut className="h-[18px] w-[18px]" />
          {!collapsed && <span className="ml-2 text-sm">Log out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
