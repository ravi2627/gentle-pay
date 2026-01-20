import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Building2,
  DollarSign,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
  Edit,
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  totalPaid: number;
  totalOutstanding: number;
  paymentHistory: PaymentRecord[];
  createdAt: string;
}

const initialClients: Client[] = [
  {
    id: "CL-001",
    name: "John Smith",
    email: "john@acmecorp.com",
    phone: "+1 555-0123",
    company: "Acme Corp",
    totalPaid: 12500,
    totalOutstanding: 0,
    paymentHistory: [
      { id: "PH-001", invoiceId: "INV-001", amount: 2500, status: "paid", date: "Jan 15, 2026" },
      { id: "PH-002", invoiceId: "INV-005", amount: 5000, status: "paid", date: "Dec 20, 2025" },
      { id: "PH-003", invoiceId: "INV-008", amount: 5000, status: "paid", date: "Nov 15, 2025" },
    ],
    createdAt: "Oct 1, 2025",
  },
  {
    id: "CL-002",
    name: "Sarah Johnson",
    email: "sarah@techstart.io",
    phone: "+1 555-0456",
    company: "TechStart Inc",
    totalPaid: 8400,
    totalOutstanding: 4200,
    paymentHistory: [
      { id: "PH-004", invoiceId: "INV-002", amount: 4200, status: "pending", date: "Jan 22, 2026" },
      { id: "PH-005", invoiceId: "INV-006", amount: 4200, status: "paid", date: "Dec 10, 2025" },
      { id: "PH-006", invoiceId: "INV-009", amount: 4200, status: "paid", date: "Nov 5, 2025" },
    ],
    createdAt: "Sep 15, 2025",
  },
  {
    id: "CL-003",
    name: "Mike Chen",
    email: "mike@designstudio.co",
    phone: "+1 555-0789",
    company: "Design Studio",
    totalPaid: 5400,
    totalOutstanding: 1800,
    paymentHistory: [
      { id: "PH-007", invoiceId: "INV-003", amount: 1800, status: "overdue", date: "Jan 10, 2026" },
      { id: "PH-008", invoiceId: "INV-007", amount: 1800, status: "paid", date: "Dec 5, 2025" },
      { id: "PH-009", invoiceId: "INV-010", amount: 1800, status: "paid", date: "Nov 1, 2025" },
      { id: "PH-010", invoiceId: "INV-012", amount: 1800, status: "paid", date: "Oct 3, 2025" },
    ],
    createdAt: "Aug 20, 2025",
  },
  {
    id: "CL-004",
    name: "Emma Wilson",
    email: "emma@marketingpro.com",
    phone: "+1 555-0321",
    company: "Marketing Pro",
    totalPaid: 6200,
    totalOutstanding: 3100,
    paymentHistory: [
      { id: "PH-011", invoiceId: "INV-004", amount: 3100, status: "pending", date: "Jan 28, 2026" },
      { id: "PH-012", invoiceId: "INV-011", amount: 3100, status: "paid", date: "Dec 15, 2025" },
      { id: "PH-013", invoiceId: "INV-013", amount: 3100, status: "paid", date: "Nov 10, 2025" },
    ],
    createdAt: "Jul 1, 2025",
  },
];

const Clients = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", company: "" });
  };

  const handleAddClient = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const company = formData.company.trim();

    if (!name || name.length > 100) {
      toast({
        title: "Invalid name",
        description: "Please enter a valid name (max 100 characters).",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (company.length > 100) {
      toast({
        title: "Invalid company",
        description: "Company name must be less than 100 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newClient: Client = {
        id: `CL-${String(clients.length + 1).padStart(3, "0")}`,
        name,
        email,
        phone,
        company,
        totalPaid: 0,
        totalOutstanding: 0,
        paymentHistory: [],
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      setClients([newClient, ...clients]);
      setIsSubmitting(false);
      setIsAddDialogOpen(false);
      resetForm();

      toast({
        title: "Client added",
        description: `${name} has been added to your clients.`,
      });
    }, 500);
  };

  const handleDeleteClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    setClients(clients.filter((c) => c.id !== clientId));
    toast({
      title: "Client removed",
      description: `${client?.name} has been removed from your clients.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-success/10 text-success border-success/20 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Clients</h1>
              <p className="text-xs text-muted-foreground">
                Manage your client contacts and payment history
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              Demo Mode
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                ${clients.reduce((sum, c) => sum + c.totalPaid, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Outstanding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                ${clients.reduce((sum, c) => sum + c.totalOutstanding, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>

        {/* Clients List */}
        <Card>
          <CardContent className="p-0">
            {filteredClients.length === 0 ? (
              <div className="p-8 text-center">
                <User className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No clients match your search" : "No clients yet"}
                </p>
                {!searchQuery && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add your first client
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Client Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium">{client.name}</h3>
                            {client.company && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Building2 className="w-3 h-3" />
                                {client.company}
                              </div>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedClient(client);
                                  setIsHistoryDialogOpen(true);
                                }}
                              >
                                <History className="w-4 h-4 mr-2" />
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Client
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteClient(client.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </div>
                          {client.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {client.phone}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-success" />
                            <span className="text-sm">
                              <span className="font-medium text-success">
                                ${client.totalPaid.toLocaleString()}
                              </span>{" "}
                              <span className="text-muted-foreground">paid</span>
                            </span>
                          </div>
                          {client.totalOutstanding > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-warning" />
                              <span className="text-sm">
                                <span className="font-medium text-warning">
                                  ${client.totalOutstanding.toLocaleString()}
                                </span>{" "}
                                <span className="text-muted-foreground">outstanding</span>
                              </span>
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Client since {client.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-center text-muted-foreground">
            🎉 <strong>Demo Mode:</strong> Client data is not persisted. Connect
            a backend to save your clients.
          </p>
        </div>
      </main>

      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Add a client to track invoices and send payment reminders.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Name *</Label>
              <Input
                id="clientName"
                placeholder="Client name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="client@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Phone (optional)</Label>
              <Input
                id="clientPhone"
                type="tel"
                placeholder="+1 555-0123"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientCompany">Company (optional)</Label>
              <Input
                id="clientCompany"
                placeholder="Company name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                maxLength={100}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddClient} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment History</DialogTitle>
            <DialogDescription>
              {selectedClient?.name} - {selectedClient?.company}
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
                  <p className="text-lg font-bold text-success">
                    ${selectedClient.totalPaid.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Outstanding</p>
                  <p className="text-lg font-bold text-warning">
                    ${selectedClient.totalOutstanding.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* History List */}
              <div className="border border-border rounded-lg divide-y divide-border max-h-64 overflow-y-auto">
                {selectedClient.paymentHistory.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground text-center">
                    No payment history yet
                  </p>
                ) : (
                  selectedClient.paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-sm">{payment.invoiceId}</p>
                        <p className="text-xs text-muted-foreground">{payment.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          ${payment.amount.toLocaleString()}
                        </span>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
