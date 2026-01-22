import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState("");
  const { toast } = useToast();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const checkRateLimit = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke("login-rate-limit", {
        body: { email, action: "check" },
      });

      if (error) {
        console.error("Rate limit check error:", error);
        return false; // Allow login attempt if rate limit check fails
      }

      if (data?.isLimited) {
        setIsRateLimited(true);
        setRateLimitMessage(
          `Too many login attempts. Please wait ${data.windowMinutes} minutes before trying again.`
        );
        return true;
      }

      return false;
    } catch (err) {
      console.error("Rate limit exception:", err);
      return false;
    }
  };

  const recordLoginAttempt = async () => {
    try {
      await supabase.functions.invoke("login-rate-limit", {
        body: { email, action: "record" },
      });
    } catch (err) {
      console.error("Failed to record login attempt:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRateLimited) {
      toast({
        title: "Too many attempts",
        description: rateLimitMessage,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Check rate limit before attempting login
    const limited = await checkRateLimit();
    if (limited) {
      setIsLoading(false);
      toast({
        title: "Too many attempts",
        description: rateLimitMessage,
        variant: "destructive",
      });
      return;
    }

    // Record the login attempt
    await recordLoginAttempt();

    const { error } = await signIn(email, password);
    
    setIsLoading(false);
    
    if (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Welcome back!",
      description: "You've been logged in successfully.",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Login | RemindSwift</title>
        <meta name="description" content="Log in to your RemindSwift account to manage invoices and payment reminders." />
      </Helmet>
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
              <p className="text-muted-foreground">
                Log in to your RemindSwift account
              </p>
            </div>

            {isRateLimited && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{rateLimitMessage}</p>
              </div>
            )}

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
                  disabled={isRateLimited}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11"
                  disabled={isRateLimited}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11" 
                disabled={isLoading || isRateLimited}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;