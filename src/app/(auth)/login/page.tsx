"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || "Invalid email or password");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Decorative Background Elements */}
      <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      
      <div className="relative w-full max-w-md space-y-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-2xl shadow-primary/30 transition-all duration-500 hover:rotate-6 hover:scale-110">
            <ShieldCheck size={36} className="text-primary-foreground" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
              TestMaster
            </h1>
            <p className="text-sm font-medium text-muted-foreground/80">
              Super Admin Gateway
            </p>
          </div>
        </div>

        <Card className="overflow-hidden border-none bg-background shadow-2xl">
          <CardHeader className="space-y-2 pb-6 pt-8 text-center sm:text-left">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to manage the platform
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 px-6 sm:px-8">
              {error && (
                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 border-destructive/20 bg-destructive/5 py-3">
                  <AlertDescription className="text-center text-sm font-semibold">{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-semibold tracking-tight">Email Address</Label>
                <div className="group relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@testmaster.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="h-12 border-border/60 bg-background/50 pl-11 shadow-sm transition-all focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold tracking-tight">Password</Label>
                  <Button variant="link" className="h-auto p-0 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                    Reset Access?
                  </Button>
                </div>
                <div className="group relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="h-12 border-border/60 bg-background/50 pl-11 shadow-sm transition-all focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-6 pb-10 pt-4 sm:px-8">
              <Button 
                type="submit" 
                className={cn(
                  "w-full h-12 text-base font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98] bg-black text-white",
                  isLoading ? "opacity-90" : "hover:scale-[1.01] hover:shadow-primary/30"
                )} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2.5">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Authorizing...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="flex flex-col items-center space-y-6">
          <p className="max-w-[280px] text-center text-xs leading-relaxed text-muted-foreground/70">
            Internal administrative system. Unauthorized access is strictly prohibited and monitored.
          </p>
          <div className="h-px w-12 bg-border/60" />
          <div className="flex gap-4">
            <Button variant="link" className="h-auto p-0 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors">Support</Button>
            <Button variant="link" className="h-auto p-0 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors">Status</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

