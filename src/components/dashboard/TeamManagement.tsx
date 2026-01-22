import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Plus,
  MoreHorizontal,
  Mail,
  Shield,
  User,
  Trash2,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  status: "active" | "pending";
  lastActive: string;
  invitedAt: string;
}

// No demo data - start with empty team
const initialTeamMembers: TeamMember[] = [];

interface TeamManagementProps {
  plan: "free" | "pro" | "agency";
}

export const TeamManagement = ({ plan }: TeamManagementProps) => {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "staff" as "admin" | "staff",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInvite = () => {
    const email = inviteData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (teamMembers.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
      toast({
        title: "Already invited",
        description: "This email has already been invited to the team.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newMember: TeamMember = {
        id: `TM-${String(teamMembers.length + 1).padStart(3, "0")}`,
        name: "",
        email,
        role: inviteData.role,
        status: "pending",
        lastActive: "",
        invitedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      setTeamMembers([...teamMembers, newMember]);
      setIsSubmitting(false);
      setIsInviteDialogOpen(false);
      setInviteData({ email: "", role: "staff" });

      toast({
        title: "Invitation sent!",
        description: `An invite has been sent to ${email}.`,
      });
    }, 500);
  };

  const handleRemoveMember = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    setTeamMembers(teamMembers.filter((m) => m.id !== memberId));
    toast({
      title: "Team member removed",
      description: `${member?.email} has been removed from the team.`,
    });
  };

  const handleResendInvite = (email: string) => {
    toast({
      title: "Invite resent",
      description: `A new invitation has been sent to ${email}.`,
    });
  };

  if (plan !== "agency") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-5 h-5" />
            Team Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium mb-1">Team features for Agency plan</p>
            <p className="text-sm text-muted-foreground mb-4">
              Invite team members and manage access
            </p>
            <Button size="sm">Upgrade to Agency</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""} • Unlimited seats
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsInviteDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Invite
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">No team members yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Invite your first team member to get started
              </p>
              <Button size="sm" onClick={() => setIsInviteDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Invite Team Member
              </Button>
            </div>
          ) : (
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {member.name ? (
                    <span className="text-primary font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">
                      {member.name || member.email}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        member.role === "admin"
                          ? "bg-primary/10 text-primary border-primary/30"
                          : ""
                      }
                    >
                      {member.role === "admin" ? (
                        <Shield className="w-3 h-3 mr-1" />
                      ) : null}
                      {member.role}
                    </Badge>
                    {member.status === "pending" && (
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {member.name && <span>{member.email}</span>}
                    {member.status === "active" && member.lastActive && (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-success" />
                        {member.lastActive}
                      </span>
                    )}
                    {member.status === "pending" && (
                      <span>Invited {member.invitedAt}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {member.status === "pending" && (
                      <DropdownMenuItem onClick={() => handleResendInvite(member.email)}>
                        <Mail className="w-4 h-4 mr-2" />
                        Resend Invite
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team on RemindSwift.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="colleague@company.com"
                value={inviteData.email}
                onChange={(e) =>
                  setInviteData({ ...inviteData, email: e.target.value })
                }
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <Select
                value={inviteData.role}
                onValueChange={(value: "admin" | "staff") =>
                  setInviteData({ ...inviteData, role: value })
                }
              >
                <SelectTrigger id="inviteRole">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <div>
                        <p className="font-medium">Staff</p>
                        <p className="text-xs text-muted-foreground">
                          Can manage clients & invoices
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <div>
                        <p className="font-medium">Admin</p>
                        <p className="text-xs text-muted-foreground">
                          Full access including billing
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsInviteDialogOpen(false);
                setInviteData({ email: "", role: "staff" });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
