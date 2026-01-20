import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Link,
  Plus,
  Star,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SwipeToDelete } from "@/components/SwipeToDelete";
import { useIsMobile } from "@/hooks/use-mobile";

export interface PaymentLinkWithStats {
  id: string;
  label: string;
  url: string;
  isDefault: boolean;
  isActive: boolean;
  invoiceCount: number;
  createdAt: string;
}

interface PaymentLinksManagerProps {
  paymentLinks: PaymentLinkWithStats[];
  isLoading: boolean;
  onCreateLink: (label: string, url: string) => Promise<void>;
  onDeleteLink: (id: string) => Promise<void>;
  onSetDefault: (id: string) => Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
}

export function PaymentLinksManager({
  paymentLinks,
  isLoading,
  onCreateLink,
  onDeleteLink,
  onSetDefault,
  onToggleActive,
}: PaymentLinksManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setUrlError("Payment URL is required");
      return false;
    }
    try {
      const parsed = new URL(url.trim());
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        setUrlError("URL must start with http:// or https://");
        return false;
      }
      setUrlError("");
      return true;
    } catch {
      setUrlError("Please enter a valid URL");
      return false;
    }
  };

  const handleCreateLink = async () => {
    if (!validateUrl(newUrl)) return;

    try {
      setIsSubmitting(true);
      await onCreateLink(newLabel.trim() || "Payment Link", newUrl.trim());
      setNewLabel("");
      setNewUrl("");
      setUrlError("");
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast({ title: "Link copied!", description: "Payment link copied to clipboard" });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    await onSetDefault(id);
  };

  const handleDelete = async (id: string) => {
    await onDeleteLink(id);
  };

  const handleDialogClose = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setNewLabel("");
      setNewUrl("");
      setUrlError("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Payment Links</h3>
          <p className="text-sm text-muted-foreground">
            Manage your payment links. Set one as default to auto-fill in invoices.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Link</DialogTitle>
              <DialogDescription>
                Add your Stripe, PayPal, UPI, or other payment link URL.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="payment-label">Label</Label>
                <Input
                  id="payment-label"
                  type="text"
                  placeholder="e.g., Stripe, PayPal, UPI"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-url">Payment URL *</Label>
                <Input
                  id="payment-url"
                  type="url"
                  placeholder="https://pay.stripe.com/..."
                  value={newUrl}
                  onChange={(e) => {
                    setNewUrl(e.target.value);
                    if (urlError) validateUrl(e.target.value);
                  }}
                  className={urlError ? "border-destructive" : ""}
                />
                {urlError && (
                  <p className="text-sm text-destructive">{urlError}</p>
                )}
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDialogClose(false)}
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateLink}
                  className="w-full sm:w-auto flex-1"
                  disabled={isSubmitting || !newUrl.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Link"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Links List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : paymentLinks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Link className="h-10 w-10 text-muted-foreground mb-3" />
            <h4 className="font-medium">No payment links yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first payment link to get started
            </p>
            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Your First Link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {isMobile && (
            <p className="text-xs text-muted-foreground mb-2">
              ← Swipe left to delete
            </p>
          )}
          {paymentLinks.map((link) => (
            <SwipeToDelete
              key={link.id}
              onDelete={() => handleDelete(link.id)}
              disabled={!isMobile}
            >
              <Card
                className={
                  link.isDefault
                    ? "border-primary/50 bg-primary/5"
                    : ""
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Default Star Button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`shrink-0 ${
                              link.isDefault
                                ? "text-amber-500 hover:text-amber-600"
                                : "text-muted-foreground hover:text-amber-500"
                            }`}
                            onClick={() => handleSetDefault(link.id)}
                            disabled={link.isDefault}
                          >
                            <Star
                              className={`h-5 w-5 ${
                                link.isDefault ? "fill-current" : ""
                              }`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {link.isDefault
                            ? "Default payment link"
                            : "Set as default"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Link Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                          {link.label}
                        </span>
                        {link.isDefault && (
                          <Badge variant="secondary" className="shrink-0">
                            Default
                          </Badge>
                        )}
                        {!link.isActive && (
                          <Badge variant="outline" className="shrink-0">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-none mt-1">
                        {link.url}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Used in {link.invoiceCount} invoice
                        {link.invoiceCount !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Copy Button */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopyUrl(link.url, link.id)}
                            >
                              {copiedId === link.id ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy link</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Open External Link */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                            >
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Open link</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Active Toggle */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Switch
                                checked={link.isActive}
                                onCheckedChange={(checked) =>
                                  onToggleActive(link.id, checked)
                                }
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {link.isActive ? "Deactivate" : "Activate"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Delete Button (Desktop only) */}
                      {!isMobile && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Payment Link?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this payment link.
                                {link.invoiceCount > 0 && (
                                  <span className="block mt-2 text-amber-600">
                                    Warning: This link is used in {link.invoiceCount}{" "}
                                    invoice{link.invoiceCount !== 1 ? "s" : ""}.
                                  </span>
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(link.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwipeToDelete>
          ))}
        </div>
      )}
    </div>
  );
}
