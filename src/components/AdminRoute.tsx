import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { Loader2, ShieldX } from "lucide-react";

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * Protected route component that only allows admin users.
 * Redirects non-admin users to the dashboard.
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading, error } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    // If authenticated but not admin, redirect to dashboard
    if (!authLoading && !adminLoading && isAuthenticated && !isAdmin) {
      navigate("/dashboard");
    }
  }, [authLoading, adminLoading, isAuthenticated, isAdmin, navigate]);

  // Show loading state
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If there was an error checking admin status
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center p-4">
          <ShieldX className="w-12 h-12 text-destructive" />
          <h1 className="text-xl font-semibold">Access Error</h1>
          <p className="text-muted-foreground">
            Unable to verify your access permissions. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // If not admin, don't render children (redirect will happen via useEffect)
  if (!isAdmin) {
    return null;
  }

  // Render children for admin users
  return <>{children}</>;
}

export default AdminRoute;
