import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrengthMeter, getPasswordStrength } from "@/components/PasswordStrengthMeter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Check } from "lucide-react";

const benefits = [
  "Free forever plan available",
  "No credit card required",
  "Start automating in minutes",
];

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(password);
  const isPasswordValid = passwordStrength.score >= 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast({
        title: "Password too weak",
        description: "Please choose a stronger password with at least 8 characters.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    const { error } = await signUp(email, password);
    
    setIsLoading(false);
    
    if (error) {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account created!",
      description: "Please check your email to verify your account, then log in.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Sign Up | RemindSwift</title>
        <meta name="description" content="Create your free RemindSwift account and start automating invoice reminders." />
      </Helmet>
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Create your account</h1>
              <p className="text-muted-foreground">
                Polite reminders. Faster payments.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="h-11"
                />
                <PasswordStrengthMeter password={password} />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11" 
                disabled={isLoading || !isPasswordValid}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              
              {!isPasswordValid && password.length > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Password must be at least Medium strength to continue
                </p>
              )}
            </form>

            {/* Benefits */}
            <ul className="mt-6 space-y-2">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;