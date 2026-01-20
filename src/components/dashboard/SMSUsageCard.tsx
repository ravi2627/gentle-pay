import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, Plus, Zap } from "lucide-react";
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
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-violet-500" />
            </div>
            SMS Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-sm mb-1">Upgrade to unlock SMS</p>
            <p className="text-xs text-muted-foreground mb-4">
              Send SMS reminders for faster payments
            </p>
            <Button size="sm" className="bg-gradient-to-r from-primary to-accent-foreground">
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-violet-500" />
              </div>
              SMS Credits
            </CardTitle>
            <span className="text-xs text-muted-foreground font-medium">
              {plan === "pro" ? "Pro Plan" : "Agency Plan"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main stat */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">{remaining}</p>
              <p className="text-xs text-muted-foreground">credits remaining</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {used} <span className="text-muted-foreground/60">/ {included}</span>
              </p>
              <p className="text-xs text-muted-foreground">used this month</p>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress 
            value={percentUsed} 
            className="h-2 bg-muted" 
          />

          {/* Buy More Button */}
          <Button 
            variant="outline" 
            className="w-full h-10" 
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buy More Credits
          </Button>
        </CardContent>
      </Card>

      {/* Buy SMS Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buy SMS Credits</DialogTitle>
            <DialogDescription>
              Add more SMS credits to your account. Credits never expire.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            {SMS_PACKAGES.map((pkg, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedPackage(index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  selectedPackage === index
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{pkg.amount} SMS</p>
                    <p className="text-xs text-muted-foreground">
                      ${(pkg.price / pkg.amount * 10).toFixed(1)}¢ per SMS
                    </p>
                  </div>
                  <p className="text-xl font-bold">${pkg.price}</p>
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
