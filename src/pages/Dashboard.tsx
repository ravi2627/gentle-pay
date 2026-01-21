import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
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
import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICards } from "@/components/dashboard/KPICards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { SMSUsageCard } from "@/components/dashboard/SMSUsageCard";
import { TeamManagement } from "@/components/dashboard/TeamManagement";
import { MobileInvoiceList } from "@/components/dashboard/MobileInvoiceList";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { EmailTrackingCards } from "@/components/dashboard/EmailTrackingCards";
import { EmailStatusIndicator } from "@/components/dashboard/EmailStatusIndicator";
import { InvoiceActivityTimeline, reminderLogsToActivities } from "@/components/dashboard/InvoiceActivityTimeline";
import { SwipeToDelete } from "@/components/SwipeToDelete";
import { useEmailTracking } from "@/hooks/useEmailTracking";
import { useInvoices, InvoiceWithClient } from "@/hooks/useInvoices";
import { useClients } from "@/hooks/useClients";
import { useReminders } from "@/hooks/useReminders";
import { usePaymentLinks } from "@/hooks/usePaymentLinks";
import { useInvoiceReminders } from "@/hooks/useInvoiceReminders";
import { CreateInvoiceForm, CreateInvoiceFormData } from "@/components/dashboard/CreateInvoiceForm";
import { PaymentLinksManager, PaymentLinkWithStats } from "@/components/dashboard/PaymentLinksManager";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  Mail,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Link,
  ExternalLink,
  Trash2,
  MoreHorizontal,
  Edit,
  Eye,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Local invoice type for UI compatibility
interface LocalInvoice {
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

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
];

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

const Dashboard = () => {
  const { user, profile } = useAuth();
  const displayName = profile?.business_name || user?.email?.split("@")[0] || "User";
  const navigate = useNavigate();
  const { toast } = useToast();

  // Supabase data hooks
  const { 
    invoices: dbInvoices, 
    isLoading: invoicesLoading, 
    createInvoice, 
    updateInvoice, 
    deleteInvoice, 
    markAsPaid,
    stats: invoiceStats 
  } = useInvoices();
  const { clients, isLoading: clientsLoading, createClient: createClientMutation } = useClients();
  const { reminders, stats: reminderStats, sendReminder: sendDbReminder } = useReminders();
  const { 
    paymentLinks: dbPaymentLinks, 
    isLoading: paymentLinksLoading,
    createPaymentLink: createPaymentLinkMutation,
    deletePaymentLink: deletePaymentLinkMutation,
    setDefault: setDefaultPaymentLink,
    toggleActive: togglePaymentLinkActive,
  } = usePaymentLinks();

  // Email tracking hook (for legacy compatibility)
  const { stats: emailStats, getInvoiceEmailStatus, getInvoiceLogs, sendReminder, shouldEscalateToSMS } = useEmailTracking();

  // User preferences
  const [currency, setCurrency] = useState("INR");
  const [plan] = useState<"free" | "pro" | "agency">("pro");

  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || "₹";

  // Transform DB invoices to local format for UI compatibility
  const invoices: LocalInvoice[] = useMemo(() => {
    return dbInvoices.map((inv) => ({
      id: inv.id,
      client: inv.client_name || "Unknown Client",
      amount: Number(inv.amount),
      status: (inv.status === "sent" || inv.status === "viewed" ? "pending" : inv.status) as "paid" | "pending" | "overdue",
      dueDate: new Date(inv.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      reminders: inv.reminders_count,
    }));
  }, [dbInvoices]);

  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(initialPaymentLinks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [isPaymentLinksDialogOpen, setIsPaymentLinksDialogOpen] = useState(false);
  const [isActivitySheetOpen, setIsActivitySheetOpen] = useState(false);
  const [selectedActivityInvoice, setSelectedActivityInvoice] = useState<LocalInvoice | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<LocalInvoice | null>(null);
  const [selectedDbInvoiceId, setSelectedDbInvoiceId] = useState<string | null>(null);
  const [reminderMessage, setReminderMessage] = useState(
    "Hi {client},\n\nThis is a friendly reminder that invoice {invoice_id} for {currency}{amount} is due on {due_date}.\n\nPlease let us know if you have any questions.\n\nBest regards"
  );
  const [formData, setFormData] = useState({
    client: "",
    clientId: "",
    amount: "",
    dueDate: "",
    status: "pending" as "paid" | "pending" | "overdue",
  });
  const [editFormData, setEditFormData] = useState({
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

  const resetForm = () => {
    setFormData({
      client: "",
      clientId: "",
      amount: "",
      dueDate: "",
      status: "pending",
    });
  };

  const handleCreateInvoiceNew = async (data: CreateInvoiceFormData) => {
    const amount = parseFloat(data.amount);

    if (isNaN(amount) || amount <= 0 || amount > 10000000) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount between 0.01 and 10,000,000.",
        variant: "destructive",
      });
      return;
    }

    if (!data.dueDate) {
      toast({
        title: "Missing due date",
        description: "Please select a due date for the invoice.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate invoice number
      const invoiceNumber = `INV-${String(dbInvoices.length + 1).padStart(3, "0")}`;
      
      // Determine reminder settings from the new flexible system
      const hasReminders = data.reminders.length > 0;
      
      createInvoice.mutate({
        invoice_number: invoiceNumber,
        amount: amount,
        due_date: data.dueDate.toISOString().split("T")[0],
        client_name: data.clientName,
        client_email: data.clientEmail,
        payment_link_id: data.paymentLinkId || undefined,
        currency: currency,
        reminder_enabled: hasReminders,
        // Use the first reminder's tone as the default tone for legacy compatibility
        reminder_tone: data.reminders[0]?.tone || "polite",
      }, {
        onSuccess: (newInvoice) => {
          // Create the flexible reminders in the new invoice_reminders table
          if (hasReminders && newInvoice?.id) {
            // Use the invoiceReminders hook to create reminders
            const reminderInserts = data.reminders.map((r, idx) => ({
              invoice_id: newInvoice.id,
              timing_type: r.timing_type,
              timing_days: r.timing_days,
              channel: r.channel,
              tone: r.tone,
              sort_order: idx,
            }));
            
            // We'll create reminders via direct supabase call since we're in a callback
            import("@/integrations/supabase/client").then(({ supabase }) => {
              supabase.auth.getUser().then(({ data: { user } }) => {
                if (user) {
                  supabase.from("invoice_reminders").insert(
                    reminderInserts.map((r) => ({ ...r, user_id: user.id }))
                  );
                }
              });
            });
          }
          
          setIsSubmitting(false);
          setIsDialogOpen(false);
          resetForm();
        },
        onError: () => {
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Legacy handler for backward compatibility
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    const clientName = formData.client.trim();
    const amount = parseFloat(formData.amount);

    if (!formData.clientId && (!clientName || clientName.length > 100)) {
      toast({
        title: "Invalid client",
        description: "Please select a client or enter a valid client name (max 100 characters).",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(amount) || amount <= 0 || amount > 10000000) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount between 0.01 and 10,000,000.",
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
    
    try {
      let clientId = formData.clientId;
      
      if (!clientId && clientName) {
        const newClient = await createClientMutation.mutateAsync({ name: clientName });
        clientId = newClient.id;
      }
      
      const invoiceNumber = `INV-${String(dbInvoices.length + 1).padStart(3, "0")}`;
      
      createInvoice.mutate({
        invoice_number: invoiceNumber,
        amount: amount,
        due_date: formData.dueDate,
        client_id: clientId || undefined,
        currency: currency,
      }, {
        onSuccess: () => {
          setIsSubmitting(false);
          setIsDialogOpen(false);
          resetForm();
        },
        onError: () => {
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditInvoice = async () => {
    if (!selectedInvoice || !selectedDbInvoiceId) return;

    const amount = parseFloat(editFormData.amount);

    if (isNaN(amount) || amount <= 0 || amount > 10000000) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount between 0.01 and 10,000,000.",
        variant: "destructive",
      });
      return;
    }

    if (!editFormData.dueDate) {
      toast({
        title: "Missing due date",
        description: "Please select a due date for the invoice.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    updateInvoice.mutate({
      id: selectedDbInvoiceId,
      amount: amount,
      due_date: editFormData.dueDate,
      status: editFormData.status === "overdue" ? "overdue" : editFormData.status === "paid" ? "paid" : "pending",
    }, {
      onSuccess: () => {
        setIsSubmitting(false);
        setIsEditDialogOpen(false);
        setSelectedInvoice(null);
        setSelectedDbInvoiceId(null);
      },
      onError: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleDeleteInvoice = () => {
    if (!selectedInvoice || !selectedDbInvoiceId) return;

    deleteInvoice.mutate(selectedDbInvoiceId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setSelectedInvoice(null);
        setSelectedDbInvoiceId(null);
      }
    });
  };

  const openEditDialog = (invoice: LocalInvoice) => {
    setSelectedInvoice(invoice);
    setSelectedDbInvoiceId(invoice.id);
    // Find the DB invoice to get the correct date format
    const dbInv = dbInvoices.find(i => i.id === invoice.id);
    const formattedDate = dbInv ? dbInv.due_date : new Date().toISOString().split("T")[0];
    setEditFormData({
      client: invoice.client,
      amount: String(invoice.amount),
      dueDate: formattedDate,
      status: invoice.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (invoice: LocalInvoice) => {
    setSelectedInvoice(invoice);
    setSelectedDbInvoiceId(invoice.id);
    setIsDeleteDialogOpen(true);
  };

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

  const handleMarkPaid = (invoiceId: string) => {
    markAsPaid.mutate(invoiceId);
  };

  const handleSendSingleReminder = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return;

    // Send reminder via Supabase
    const dbInv = dbInvoices.find(i => i.id === invoiceId);
    sendDbReminder.mutate({
      invoice_id: invoiceId,
      type: "email",
      recipient_email: dbInv?.client_email || undefined,
    });
  };

  const openActivitySheet = (invoice: LocalInvoice) => {
    setSelectedActivityInvoice(invoice);
    setIsActivitySheetOpen(true);
  };

  return (
    <DashboardLayout
      title={`Welcome back, ${displayName}! 👋`}
      description="Here's what's happening with your invoices today."
    >
      {/* Floating Action Button - Mobile only */}
      <FloatingActionButton onClick={() => setIsDialogOpen(true)} label="New Invoice" />

      {/* KPI Cards */}
      <KPICards 
        invoices={invoices} 
        currency={currency} 
        currencySymbol={currencySymbol} 
      />

      {/* Actions - Hidden on mobile (using FAB instead) */}
      <div className="hidden md:flex flex-wrap gap-3 mt-8 mb-6">
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

      {/* Mobile Quick Actions */}
      <div className="flex gap-2 mt-6 mb-4 md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-shrink-0 h-10"
          onClick={() => setIsReminderDialogOpen(true)}
        >
          <Mail className="w-4 h-4 mr-2" />
          Send Reminder
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-shrink-0 h-10"
          onClick={() => setIsPaymentLinksDialogOpen(true)}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Payment Links
        </Button>
      </div>

      {/* Tabs for Dashboard Views */}
      <Tabs defaultValue="overview" className="space-y-4 md:space-y-6 mt-4 md:mt-0">
        <TabsList className="w-full md:w-auto overflow-x-auto scrollbar-hide">
          <TabsTrigger value="overview" className="flex-1 md:flex-none">Overview</TabsTrigger>
          <TabsTrigger value="invoices" className="flex-1 md:flex-none">Invoices</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 md:flex-none">Analytics</TabsTrigger>
          <TabsTrigger value="team" className="flex-1 md:flex-none">Team</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Charts */}
          <DashboardCharts currencySymbol={currencySymbol} />

          {/* SMS Usage & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SMSUsageCard plan={plan} />
            
            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Recent Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoices.slice(0, 4).map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-sm">{invoice.client}</p>
                          <p className="text-xs text-muted-foreground">
                            {invoice.id} • Due {invoice.dueDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          {currencySymbol}{invoice.amount.toLocaleString()}
                        </span>
                        {getStatusBadge(invoice.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          {/* Mobile: Card-based list */}
          <div className="md:hidden">
            <MobileInvoiceList
              invoices={invoices}
              currencySymbol={currencySymbol}
              getEmailStatus={getInvoiceEmailStatus}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onMarkPaid={handleMarkPaid}
              onSendReminder={handleSendSingleReminder}
            />
          </div>

          {/* Desktop: Table layout */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Invoices</span>
                <Button variant="ghost" size="sm">
                  Export
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
                        Email Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Reminders
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Actions
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
                          {currencySymbol}{invoice.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {invoice.dueDate}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <EmailStatusIndicator emailStatus={getInvoiceEmailStatus(invoice.id)} />
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getInvoiceEmailStatus(invoice.id).totalEmailsSent} emails
                            </Badge>
                            {getInvoiceEmailStatus(invoice.id).totalOpens > 0 && (
                              <Badge variant="secondary" className="text-xs bg-success/10 text-success">
                                {getInvoiceEmailStatus(invoice.id).totalOpens} opens
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(invoice.status)}</td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openActivitySheet(invoice)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Activity
                              </DropdownMenuItem>
                              {invoice.status !== "paid" && (
                                <DropdownMenuItem onClick={() => handleSendSingleReminder(invoice.id)}>
                                  <Send className="w-4 h-4 mr-2" />
                                  Send Reminder
                                  {shouldEscalateToSMS(invoice.id) && (
                                    <Badge variant="outline" className="ml-2 text-xs">SMS?</Badge>
                                  )}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => openEditDialog(invoice)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => openDeleteDialog(invoice)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Email Tracking Stats */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">📧 Email Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your email reminder performance - kis ko email bheji, kitni baar, aur open hui ya nahi
            </p>
          </div>
          <EmailTrackingCards stats={emailStats} />
          
          {/* Email Sent Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Recent Email Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices
                  .filter(inv => getInvoiceEmailStatus(inv.id).totalEmailsSent > 0)
                  .slice(0, 5)
                  .map((invoice) => {
                    const emailStatus = getInvoiceEmailStatus(invoice.id);
                    return (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <EmailStatusIndicator emailStatus={emailStatus} size="sm" />
                          <div>
                            <p className="font-medium text-sm">{invoice.client}</p>
                            <p className="text-xs text-muted-foreground">
                              {invoice.id} • {emailStatus.totalEmailsSent} email{emailStatus.totalEmailsSent !== 1 ? 's' : ''} sent
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {emailStatus.totalOpens > 0 ? (
                            <Badge className="bg-success/10 text-success border-success/20 text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              {emailStatus.totalOpens} opens
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Not opened yet
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {invoices.filter(inv => getInvoiceEmailStatus(inv.id).totalEmailsSent > 0).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No emails sent yet. Send reminders to start tracking!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <DashboardCharts currencySymbol={currencySymbol} />
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <TeamManagement plan={plan} />
        </TabsContent>
      </Tabs>

      {/* Demo Notice */}
      <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <p className="text-sm text-center text-muted-foreground">
          🎉 <strong>Demo Mode:</strong> This is a preview of the PayPing
          dashboard. Connect a backend to enable real invoice management and
          automated reminders.
        </p>
      </div>

      {/* New Invoice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Add a new invoice to track and send payment reminders.
            </DialogDescription>
          </DialogHeader>

          <CreateInvoiceForm
            paymentLinks={dbPaymentLinks.map((link) => ({
              id: link.id,
              label: link.label,
              url: link.url,
              isDefault: link.is_default,
            }))}
            clients={(clients || []).map((client) => ({
              id: client.id,
              name: client.name,
              email: client.email || null,
              phone: client.phone || null,
            }))}
            currency={currency}
            currencySymbol={currencySymbol}
            senderName={displayName}
            isSubmitting={isSubmitting}
            onSubmit={handleCreateInvoiceNew}
            onCancel={() => {
              setIsDialogOpen(false);
              resetForm();
            }}
          />
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
                              {currencySymbol}{invoice.amount.toLocaleString()}
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
                Variables: {"{client}"}, {"{invoice_id}"}, {"{amount}"}, {"{due_date}"}, {"{currency}"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Send via</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="flex-1" disabled={plan === "free"}>
                  <span className="text-xs">{plan === "free" ? "SMS (Pro)" : "SMS"}</span>
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

                // Send reminders for each selected invoice
                Promise.all(
                  selectedInvoices.map((invoiceId) => {
                    const dbInv = dbInvoices.find(i => i.id === invoiceId);
                    return sendDbReminder.mutateAsync({
                      invoice_id: invoiceId,
                      type: "email",
                      recipient_email: dbInv?.client_email || undefined,
                    }).catch(() => {}); // Silently catch individual errors
                  })
                ).then(() => {
                  setIsSubmitting(false);
                  setIsReminderDialogOpen(false);
                  setSelectedInvoices([]);

                  toast({
                    title: "Reminders sent!",
                    description: `Payment reminders sent to ${selectedInvoices.length} client(s).`,
                  });
                }).catch(() => {
                  setIsSubmitting(false);
                });
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
        <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl mx-auto p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
          <PaymentLinksManager
            paymentLinks={dbPaymentLinks.map((link) => ({
              id: link.id,
              label: link.label,
              url: link.url,
              isDefault: link.is_default,
              isActive: link.is_active,
              invoiceCount: link.invoice_count,
              createdAt: link.created_at,
            }))}
            isLoading={paymentLinksLoading}
            onCreateLink={async (label, url) => {
              await createPaymentLinkMutation.mutateAsync({ label, url });
            }}
            onDeleteLink={async (id) => {
              await deletePaymentLinkMutation.mutateAsync(id);
            }}
            onSetDefault={async (id) => {
              await setDefaultPaymentLink.mutateAsync(id);
            }}
            onToggleActive={async (id, isActive) => {
              await togglePaymentLinkActive.mutateAsync({ id, is_active: isActive });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>
              Update invoice {selectedInvoice?.id} details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editClient">Client Name</Label>
              <Input
                id="editClient"
                placeholder="e.g., Acme Corp"
                value={editFormData.client}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, client: e.target.value })
                }
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editAmount">Amount ({currencySymbol})</Label>
              <Input
                id="editAmount"
                type="number"
                placeholder="0.00"
                min="0.01"
                max="10000000"
                step="0.01"
                value={editFormData.amount}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, amount: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editDueDate">Due Date</Label>
              <Input
                id="editDueDate"
                type="date"
                value={editFormData.dueDate}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, dueDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editStatus">Status</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value: "paid" | "pending" | "overdue") =>
                  setEditFormData({ ...editFormData, status: value })
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
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedInvoice(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditInvoice} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete invoice {selectedInvoice?.id} for{" "}
              <strong>{selectedInvoice?.client}</strong> ({currencySymbol}{selectedInvoice?.amount.toLocaleString()})?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedInvoice(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvoice}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Invoice Activity Sheet */}
      <Sheet open={isActivitySheetOpen} onOpenChange={setIsActivitySheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Invoice Activity</SheetTitle>
            <SheetDescription>
              {selectedActivityInvoice?.id} - {selectedActivityInvoice?.client}
            </SheetDescription>
          </SheetHeader>
          
          {selectedActivityInvoice && (
            <div className="space-y-6">
              {/* Invoice Summary */}
              <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-semibold">
                    {currencySymbol}{selectedActivityInvoice.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <span>{selectedActivityInvoice.dueDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(selectedActivityInvoice.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Email Status</span>
                  <EmailStatusIndicator 
                    emailStatus={getInvoiceEmailStatus(selectedActivityInvoice.id)} 
                    size="sm" 
                  />
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h4 className="text-sm font-medium mb-3">Activity Timeline</h4>
                <InvoiceActivityTimeline 
                  activities={reminderLogsToActivities(getInvoiceLogs(selectedActivityInvoice.id))}
                />
              </div>

              {/* Actions */}
              {selectedActivityInvoice.status !== "paid" && (
                <div className="pt-4 border-t space-y-2">
                  <Button 
                    className="w-full"
                    onClick={() => {
                      handleSendSingleReminder(selectedActivityInvoice.id);
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Reminder
                    {shouldEscalateToSMS(selectedActivityInvoice.id) && (
                      <Badge variant="secondary" className="ml-2">Try SMS</Badge>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleMarkPaid(selectedActivityInvoice.id)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Paid
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default Dashboard;
