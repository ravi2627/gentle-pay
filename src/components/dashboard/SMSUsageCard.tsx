import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertTriangle, Plus, Zap } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface SMSUsageCardProps {
  plan: "free" | "pro" | "agency";
}

const SMS_PACKAGES = [
  { amount: 100, price: 10 },
  { amount: 250, price: 20 },
  { amount: 500, price: 35 },
  { amount: 1000, price: 60 },
];

export const SMSUsageCard = ({ plan }: SMSUsageCardProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  // Simulated SMS data based on plan
  const smsData = {
    free: { included: 0, used: 0 },
    pro: { included: 150, used: 87 },
    agency: { included: 500, used: 312 },
  };

  const { included, used } = smsData[plan];
  const remaining = Math.max(0, included - used);
  const percentUsed = included > 0 ? (used / included) * 100 : 0;
  const isLowBalance = remaining < included * 0.2 && included > 0;

  const handleBuyPackage = () => {
    if (selectedPackage !== null) {
      toast({
        title: "SMS Package Added!",
        description: `${SMS_PACKAGES[selectedPackage].amount} SMS credits have been added to your account.`,
      });
      setIsDialogOpen(false);
      setSelectedPackage(null);
    }
  };

  if (plan === "free") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="w-5 h-5" />
            SMS Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium mb-1">Upgrade to unlock SMS</p>
            <p className="text-sm text-muted-foreground mb-4">
              Send SMS reminders for faster payments
            </p>
            <Button size="sm">
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={isLowBalance ? "border-warning/50" : ""}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="w-5 h-5" />
              SMS Usage
            </CardTitle>
            {isLowBalance && (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Low Balance
              </Badge>
            )}
          </div>
          <CardDescription>
            {plan === "pro" ? "Pro Plan" : "Agency Plan"} • {included} SMS/month
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Used this month</span>
              <span className="font-medium">{used} / {included}</span>
            </div>
            <Progress 
              value={percentUsed} 
              className={`h-2 ${isLowBalance ? "[&>div]:bg-warning" : ""}`} 
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold text-primary">{included}</p>
              <p className="text-xs text-muted-foreground">Included</p>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold">{used}</p>
              <p className="text-xs text-muted-foreground">Used</p>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <p className={`text-lg font-bold ${isLowBalance ? "text-warning" : "text-success"}`}>
                {remaining}
              </p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
          </div>

          {/* Low Balance Alert */}
          {isLowBalance && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Running low on SMS credits</p>
                  <p className="text-xs text-muted-foreground">
                    Top up to avoid interruption to your SMS reminders
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buy More Button */}
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buy SMS Add-on Pack
          </Button>
        </CardContent>
      </Card>

      {/* Buy SMS Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buy SMS Add-on Pack</DialogTitle>
            <DialogDescription>
              Add more SMS credits to your account. Credits never expire.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {SMS_PACKAGES.map((pkg, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedPackage(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedPackage === index
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{pkg.amount} SMS</p>
                    <p className="text-sm text-muted-foreground">
                      ${(pkg.price / pkg.amount * 10).toFixed(1)}¢ per SMS
                    </p>
                  </div>
                  <p className="text-lg font-bold">${pkg.price}</p>
                </div>
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBuyPackage} 
              disabled={selectedPackage === null}
            >
              Buy Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
