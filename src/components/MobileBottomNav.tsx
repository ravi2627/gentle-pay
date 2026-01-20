import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Invoices", url: "/dashboard?tab=invoices", icon: FileText },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Analytics", url: "/dashboard?tab=analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function MobileBottomNav() {
  const location = useLocation();

  const isActive = (url: string) => {
    if (url.includes("?")) {
      const [path, query] = url.split("?");
      const searchParams = new URLSearchParams(location.search);
      const tabParam = query.split("=")[1];
      return location.pathname === path && searchParams.get("tab") === tabParam;
    }
    return location.pathname === url && !location.search.includes("tab=");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.url);
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-[44px] transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon
                className={`w-5 h-5 mb-1 transition-transform ${
                  active ? "scale-110" : ""
                }`}
              />
              <span className="text-[10px] font-medium">{item.title}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
