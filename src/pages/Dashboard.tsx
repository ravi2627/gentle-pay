import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  CreditCard,
  DollarSign,
  Mail,
  Plus,
  Send,
  Settings,
  TrendingUp,
  Users,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Link,
  ExternalLink,
  Trash2,
} from "lucide-react";

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  reminders: number;
}

interface PaymentLink {
  id: string;
  name: string;
  url: string;
  description: string;
  createdAt: string;
}

const initialPaymentLinks: PaymentLink[] = [
  {
    id: "PL-001",
    name: "Stripe Invoice Link",
    url: "https://invoice.stripe.com/i/acct_1234",
    description: "Main payment link for invoices",
    createdAt: "Jan 10, 2026",
  },
  {
    id: "PL-002",
    name: "PayPal.me Link",
    url: "https://paypal.me/yourname",
    description: "Alternative PayPal payment option",
    createdAt: "Jan 5, 2026",
  },
];

const initialInvoices: Invoice[] = [
  {
    id: "INV-001",
    client: "Acme Corp",
    amount: 2500,
    status: "paid",
    dueDate: "Jan 15, 2026",
    reminders: 2,
  },
  {
    id: "INV-002",
    client: "TechStart Inc",
    amount: 4200,
    status: "pending",
    dueDate: "Jan 22, 2026",
    reminders: 1,
  },
  {
    id: "INV-003",
    client: "Design Studio",
    amount: 1800,
    status: "overdue",
    dueDate: "Jan 10, 2026",
    reminders: 4,
  },
  {
    id: "INV-004",
    client: "Marketing Pro",
    amount: 3100,
    status: "pending",
    dueDate: "Jan 28, 2026",
    reminders: 0,
  },
];

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(initialPaymentLinks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [isPaymentLinksDialogOpen, setIsPaymentLinksDialogOpen] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [reminderMessage, setReminderMessage] = useState(
    "Hi {client},\n\nThis is a friendly reminder that invoice {invoice_id} for ${amount} is due on {due_date}.\n\nPlease let us know if you have any questions.\n\nBest regards"
  );
  const [formData, setFormData] = useState({
    client: "",
    amount: "",
    dueDate: "",
    status: "pending" as "paid" | "pending" | "overdue",
  });
  const [linkFormData, setLinkFormData] = useState({
    name: "",
    url: "",
    description: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const resetForm = () => {
    setFormData({
      client: "",
      amount: "",
      dueDate: "",
      status: "pending",
    });
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const clientName = formData.client.trim();
    const amount = parseFloat(formData.amount);

    if (!clientName || clientName.length > 100) {
      toast({
        title: "Invalid client name",
        description: "Please enter a valid client name (max 100 characters).",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(amount) || amount <= 0 || amount > 10000000) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount between $0.01 and $10,000,000.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.dueDate) {
      toast({
        title: "Missing due date",
        description: "Please select a due date for the invoice.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newInvoice: Invoice = {
        id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
        client: clientName,
        amount: amount,
        status: formData.status,
        dueDate: new Date(formData.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        reminders: 0,
      };

      setInvoices([newInvoice, ...invoices]);
      setIsSubmitting(false);
      setIsDialogOpen(false);
      resetForm();

      toast({
        title: "Invoice created!",
        description: `Invoice ${newInvoice.id} for ${newInvoice.client} has been created.`,
      });
    }, 500);
  };

  if (!isAuthenticated) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return null;
    }
  };

  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingCount = invoices.filter((inv) => inv.status !== "paid").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-primary">PayPing</span>
              <Badge variant="secondary" className="text-xs">
                Demo Mode
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your invoices today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Outstanding
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalOutstanding.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {pendingCount} invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Collected This Month
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,400</div>
              <p className="text-xs text-success">+23% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reminders Sent
              </CardTitle>
              <Send className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Clients
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                3 with pending invoices
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
          <Button variant="outline" onClick={() => setIsReminderDialogOpen(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Send Reminder
          </Button>
          <Button variant="outline" onClick={() => setIsPaymentLinksDialogOpen(true)}>
            <CreditCard className="w-4 h-4 mr-2" />
            Payment Links
          </Button>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Invoices</span>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Invoice
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Due Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Reminders
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium">{invoice.id}</td>
                      <td className="py-4 px-4">{invoice.client}</td>
                      <td className="py-4 px-4 font-medium">
                        ${invoice.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {invoice.dueDate}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-muted-foreground">
                          {invoice.reminders} sent
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(invoice.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-center text-muted-foreground">
            🎉 <strong>Demo Mode:</strong> This is a preview of the PayPing
            dashboard. Connect a backend to enable real invoice management and
            automated reminders.
          </p>
        </div>
      </main>

      {/* New Invoice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Add a new invoice to track and send payment reminders.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateInvoice} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input
                id="client"
                placeholder="e.g., Acme Corp"
                value={formData.client}
                onChange={(e) =>
                  setFormData({ ...formData, client: e.target.value })
                }
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                min="0.01"
                max="10000000"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "paid" | "pending" | "overdue") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Invoice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Send Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Payment Reminder</DialogTitle>
            <DialogDescription>
              Select invoices and customize your reminder message.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Invoice Selection */}
            <div className="space-y-2">
              <Label>Select Invoices</Label>
              <div className="border border-border rounded-lg max-h-48 overflow-y-auto">
                {invoices.filter((inv) => inv.status !== "paid").length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground text-center">
                    No pending invoices to remind
                  </p>
                ) : (
                  invoices
                    .filter((inv) => inv.status !== "paid")
                    .map((invoice) => (
                      <label
                        key={invoice.id}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b border-border last:border-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedInvoices([...selectedInvoices, invoice.id]);
                            } else {
                              setSelectedInvoices(
                                selectedInvoices.filter((id) => id !== invoice.id)
                              );
                            }
                          }}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              {invoice.client}
                            </span>
                            <span className="font-medium text-sm">
                              ${invoice.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{invoice.id}</span>
                            <span>Due: {invoice.dueDate}</span>
                          </div>
                        </div>
                        {invoice.status === "overdue" && (
                          <Badge className="bg-destructive/10 text-destructive text-xs">
                            Overdue
                          </Badge>
                        )}
                      </label>
                    ))
                )}
              </div>
              {selectedInvoices.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {selectedInvoices.length} invoice(s) selected
                </p>
              )}
            </div>

            {/* Message Template */}
            <div className="space-y-2">
              <Label htmlFor="reminderMessage">Reminder Message</Label>
              <textarea
                id="reminderMessage"
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                className="w-full min-h-32 p-3 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                Variables: {"{client}"}, {"{invoice_id}"}, {"{amount}"}, {"{due_date}"}
              </p>
            </div>

            {/* Channel Selection */}
            <div className="space-y-2">
              <Label>Send via</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="flex-1" disabled>
                  <span className="text-xs">SMS (Pro)</span>
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsReminderDialogOpen(false);
                setSelectedInvoices([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedInvoices.length === 0) {
                  toast({
                    title: "No invoices selected",
                    description: "Please select at least one invoice to send a reminder.",
                    variant: "destructive",
                  });
                  return;
                }

                setIsSubmitting(true);
                
                // Simulate sending reminders
                setTimeout(() => {
                  // Update reminder count for selected invoices
                  setInvoices(
                    invoices.map((inv) =>
                      selectedInvoices.includes(inv.id)
                        ? { ...inv, reminders: inv.reminders + 1 }
                        : inv
                    )
                  );

                  setIsSubmitting(false);
                  setIsReminderDialogOpen(false);
                  setSelectedInvoices([]);

                  toast({
                    title: "Reminders sent!",
                    description: `Payment reminders sent to ${selectedInvoices.length} client(s).`,
                  });
                }, 800);
              }}
              disabled={isSubmitting || selectedInvoices.length === 0}
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send {selectedInvoices.length > 0 ? `(${selectedInvoices.length})` : ""}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Links Dialog */}
      <Dialog open={isPaymentLinksDialogOpen} onOpenChange={setIsPaymentLinksDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Links</DialogTitle>
            <DialogDescription>
              Manage your payment links to include in reminders.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Existing Payment Links */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Your Payment Links</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingLink(!isAddingLink)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add New
                </Button>
              </div>

              {/* Add New Link Form */}
              {isAddingLink && (
                <div className="p-4 border border-border rounded-lg bg-muted/30 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="linkName">Link Name</Label>
                    <Input
                      id="linkName"
                      placeholder="e.g., Stripe Invoice Link"
                      value={linkFormData.name}
                      onChange={(e) =>
                        setLinkFormData({ ...linkFormData, name: e.target.value })
                      }
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkUrl">Payment URL</Label>
                    <Input
                      id="linkUrl"
                      type="url"
                      placeholder="https://..."
                      value={linkFormData.url}
                      onChange={(e) =>
                        setLinkFormData({ ...linkFormData, url: e.target.value })
                      }
                      maxLength={500}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkDescription">Description (optional)</Label>
                    <Input
                      id="linkDescription"
                      placeholder="Brief description..."
                      value={linkFormData.description}
                      onChange={(e) =>
                        setLinkFormData({ ...linkFormData, description: e.target.value })
                      }
                      maxLength={100}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        const name = linkFormData.name.trim();
                        const url = linkFormData.url.trim();

                        if (!name || name.length > 50) {
                          toast({
                            title: "Invalid name",
                            description: "Please enter a valid link name.",
                            variant: "destructive",
                          });
                          return;
                        }

                        try {
                          new URL(url);
                        } catch {
                          toast({
                            title: "Invalid URL",
                            description: "Please enter a valid payment URL.",
                            variant: "destructive",
                          });
                          return;
                        }

                        const newLink: PaymentLink = {
                          id: `PL-${String(paymentLinks.length + 1).padStart(3, "0")}`,
                          name,
                          url,
                          description: linkFormData.description.trim(),
                          createdAt: new Date().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }),
                        };

                        setPaymentLinks([newLink, ...paymentLinks]);
                        setLinkFormData({ name: "", url: "", description: "" });
                        setIsAddingLink(false);

                        toast({
                          title: "Payment link added!",
                          description: `${name} has been saved.`,
                        });
                      }}
                    >
                      Save Link
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAddingLink(false);
                        setLinkFormData({ name: "", url: "", description: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Links List */}
              <div className="border border-border rounded-lg divide-y divide-border">
                {paymentLinks.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground text-center">
                    No payment links added yet
                  </p>
                ) : (
                  paymentLinks.map((link) => (
                    <div
                      key={link.id}
                      className="p-3 flex items-start gap-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Link className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{link.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {link.url}
                        </p>
                        {link.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {link.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            navigator.clipboard.writeText(link.url);
                            toast({
                              title: "Copied!",
                              description: "Payment link copied to clipboard.",
                            });
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => window.open(link.url, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            setPaymentLinks(paymentLinks.filter((l) => l.id !== link.id));
                            toast({
                              title: "Link removed",
                              description: `${link.name} has been deleted.`,
                            });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Info Note */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> Add your Stripe, PayPal, or other payment links here.
                They'll be included in your payment reminders to clients.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentLinksDialogOpen(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
