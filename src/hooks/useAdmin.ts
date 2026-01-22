import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AdminState {
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to check if the current user has admin role.
 * Uses server-side validation via Supabase RLS - never trust client-side flags.
 */
export function useAdmin(): AdminState & { checkAdminStatus: () => Promise<boolean> } {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<AdminState>({
    isAdmin: false,
    isLoading: true,
    error: null,
  });

  const checkAdminStatus = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setState({ isAdmin: false, isLoading: false, error: null });
      return false;
    }

    try {
      // Query the user_roles table - RLS ensures users can only see their own roles
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin status:", error);
        setState({ isAdmin: false, isLoading: false, error });
        return false;
      }

      const isAdmin = !!data;
      setState({ isAdmin, isLoading: false, error: null });
      return isAdmin;
    } catch (err) {
      console.error("Exception checking admin status:", err);
      setState({ isAdmin: false, isLoading: false, error: err as Error });
      return false;
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkAdminStatus();
    } else {
      setState({ isAdmin: false, isLoading: false, error: null });
    }
  }, [isAuthenticated, user, checkAdminStatus]);

  return { ...state, checkAdminStatus };
}

export default useAdmin;
