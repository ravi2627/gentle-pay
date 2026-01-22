import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { AdminRoute } from "@/components/AdminRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Mail, 
  Shield, 
  Activity,
  AlertTriangle,
  Clock,
  FileText,
  Loader2
} from "lucide-react";
import ContactMessages from "@/components/dashboard/ContactMessages";

function AdminDashboardContent() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Fetch all users from profiles table
  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch user roles
  const { data: userRoles, isLoading: rolesLoading, refetch: refetchRoles } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  // Fetch invoice activity logs
  const { data: activityLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["admin-activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoice_activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  // Get user role by user_id
  const getUserRole = (userId: string) => {
    const role = userRoles?.find((r) => r.user_id === userId);
    return role?.role || "user";
  };

  // Stats
  const totalUsers = users?.length || 0;
  const adminCount = userRoles?.filter((r) => r.role === "admin").length || 0;
  const recentActivity = activityLogs?.length || 0;

  return (
    <DashboardLayout
      title="Admin Dashboard"
      description="Manage users, view system logs, and monitor security."
    >
      <Helmet>
        <title>Admin Dashboard | RemindSwift</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admin Users</p>
                <p className="text-2xl font-bold">{adminCount}</p>
              </div>
              <Shield className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recent Activity</p>
                <p className="text-2xl font-bold">{recentActivity}</p>
              </div>
              <Activity className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security</p>
                <Badge className="bg-success/10 text-success">Active</Badge>
              </div>
              <AlertTriangle className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="messages">
            <Mail className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="logs">
            <FileText className="w-4 h-4 mr-2" />
            Activity Logs
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage all registered users. Role changes require direct database access for security.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading || rolesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : users && users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <span className="font-medium">{user.business_name || "Unnamed"}</span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={getUserRole(user.id) === "admin" ? "default" : "secondary"}
                              className={getUserRole(user.id) === "admin" ? "bg-primary" : ""}
                            >
                              {getUserRole(user.id)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No users found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <ContactMessages />
        </TabsContent>

        {/* Activity Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>System Activity Logs</CardTitle>
              <CardDescription>Recent activity across all invoices and reminders.</CardDescription>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : activityLogs && activityLogs.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {log.event_type.replace(/_/g, " ")}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Invoice: {log.invoice_id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No activity logs yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <p className="font-medium text-sm">Security Notice</p>
            <p className="text-sm text-muted-foreground mt-1">
              Role changes and user deletions must be performed via direct database access (SQL) for security. 
              This prevents privilege escalation attacks.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}
