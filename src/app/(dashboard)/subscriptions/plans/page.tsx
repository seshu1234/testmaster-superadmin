"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Activity, 
  ChevronRight,
  Check,
  X,
  CreditCard,
  Target,
  Zap,
  Shield,
  Layers
} from "lucide-react";
import apiClient from "@/lib/api/client";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  features: string[];
  student_limit: number;
  test_limit: number;
  ai_grading: boolean;
  api_access: boolean;
  custom_branding: boolean;
  is_active: boolean;
  subscriber_count: number;
  created_at: string;
}

export default function PlansPage() {
  const queryClient = useQueryClient();
  
  const { data: plansResponse, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: () => apiClient.get("super-admin/plans").then((res) => res.data),
  });

  const { data: statsResponse } = useQuery({
    queryKey: ["plan-stats"],
    queryFn: () => apiClient.get("super-admin/subscriptions/stats").then((res) => res.data),
  });

  const plans = plansResponse?.data || [];
  const stats = statsResponse?.data || {};

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`super-admin/plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Subscription Tiers</h1>
          <p className="mt-1 text-sm text-muted-foreground font-medium">
            Define pricing, limits, and product feature sets.
          </p>
        </div>
        <Button asChild className="rounded-xl h-12 px-6 font-bold shadow-lg shadow-primary/20">
          <Link href="/subscriptions/plans/create">
            <Plus className="mr-2 h-5 w-5" />
            Launch New Plan
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="pb-2 pt-6 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Product Portfolio</CardTitle>
            <Layers className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-1">
            <div className="text-3xl font-black">{plans.length}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">Total defined tiers</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="pb-2 pt-6 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Active Market</CardTitle>
            <Zap className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-1">
            <div className="text-3xl font-black text-emerald-600">{plans.filter((p: any) => p.is_active).length}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">Visible to consumers</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
          <CardHeader className="pb-2 pt-6 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Total Reach</CardTitle>
            <Target className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-1">
            <div className="text-3xl font-black">{stats.active_subscriptions || 0}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">Active subscribers total</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Activity className="h-10 w-10 animate-spin text-primary opacity-20" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3 pt-4">
          {plans.map((plan: Plan) => (
            <Card
              key={plan.id}
              className={`rounded-[2.5rem] border-none shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col group ${
                !plan.is_active ? 'opacity-70 grayscale-[0.5]' : ''
              }`}
            >
              <CardHeader className="p-8 pb-4 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-4 rounded-3xl ${plan.name.toLowerCase().includes('pro') ? 'bg-primary/10 text-primary' : 'bg-muted text-foreground'}`}>
                    <CreditCard className="h-6 w-6" />
                  </div>
                  {plan.is_active ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-3 py-1 font-bold">Active</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-500/10 text-slate-600 border-none px-3 py-1 font-bold">Archived</Badge>
                  )}
                </div>
                <CardTitle className="text-2xl font-black">{plan.name}</CardTitle>
                <CardDescription className="font-medium text-sm leading-relaxed mt-2 min-h-[40px]">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8 pt-0 flex-1 space-y-8">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-foreground">
                      {formatCurrency(plan.price_monthly)}
                    </span>
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">/mo</span>
                  </div>
                  <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.1em] mt-2">
                    {formatCurrency(plan.price_annual)} /yr billed annually
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-muted pb-2">Entitlements</h4>
                  <ul className="space-y-3">
                    <FeatureItem label={`Up to ${plan.student_limit} students`} />
                    <FeatureItem label={`${plan.test_limit} tests / month`} />
                    <FeatureItem label="AI Smart Grading" active={plan.ai_grading} />
                    <FeatureItem label="White-label Branding" active={plan.custom_branding} />
                    <FeatureItem label="Strategic API Access" active={plan.api_access} />
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="p-4 bg-muted/30 border-t border-muted/50 flex items-center justify-between">
                <div className="px-4">
                  <span className="text-xs font-bold text-muted-foreground mr-1">Reach:</span>
                  <span className="text-sm font-black text-foreground">{plan.subscriber_count}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" asChild className="h-10 w-10 p-0 rounded-xl hover:bg-background">
                    <Link href={`/subscriptions/plans/${plan.id}/edit`}>
                      <Pencil className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      if (confirm("Permanently retire this plan? This action is archived but restricts new signups.")) {
                        deleteMutation.mutate(plan.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function FeatureItem({ label, active = true }: { label: string; active?: boolean }) {
  return (
    <li className={`flex items-center gap-3 text-sm font-semibold transition-opacity ${active ? 'text-foreground' : 'text-muted-foreground opacity-40'}`}>
      <div className={`shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
        {active ? <Check className="h-3 w-3" strokeWidth={4} /> : <X className="h-3 w-3" strokeWidth={4} />}
      </div>
      <span>{label}</span>
    </li>
  );
}
