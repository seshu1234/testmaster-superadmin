"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  CreditCard, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TrendingUp,
  Users,
  AlertCircle,
  MoreVertical,
  Calendar,
  Loader2,
  DollarSign
} from "lucide-react";
import apiClient from "@/lib/api/client";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Subscription {
  id: string;
  tenant_id: string;
  tenant_name: string;
  plan_id: string;
  plan_name: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  created_at: string;
}

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");

  const { data: response, isLoading } = useQuery({
    queryKey: ["subscriptions", search, status, plan],
    queryFn: () => {
      const params: any = { search };
      if (status !== 'all') params.status = status;
      if (plan !== 'all') params.plan_id = plan;
      
      return apiClient
        .get("super-admin/subscriptions", { params })
        .then((res) => res.data);
    },
  });

  const subscriptions = response?.data || [];

  const { data: plansResponse } = useQuery({
    queryKey: ["plans-list"],
    queryFn: () => apiClient.get("super-admin/subscriptions/plans").then((res) => res.data),
  });

  const plans = plansResponse?.data || [];

  const { data: statsResponse } = useQuery({
    queryKey: ["subscription-stats"],
    queryFn: () => apiClient.get("super-admin/subscriptions/stats").then((res) => res.data),
  });

  const stats = statsResponse?.data || {};

  const getStatusBadge = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none gap-1.5"><CheckCircle2 className="h-3 w-3" /> Active</Badge>;
      case 'past_due':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none gap-1.5"><Clock className="h-3 w-3" /> Past Due</Badge>;
      case 'canceled':
        return <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-none gap-1.5"><XCircle className="h-3 w-3" /> Canceled</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-none gap-1.5">Trialing</Badge>;
      default:
        return <Badge variant="secondary" className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-none capitalize">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Subscriptions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage ongoing commitments and recurring revenue streams.</p>
        </div>
        <Button asChild className="rounded-xl shadow-md shadow-primary/20">
          <Link href="/subscriptions/plans">
            <DollarSign className="mr-2 h-4 w-4" />
            Manage Plans
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "MRR", value: formatCurrency(stats?.mrr || 0), sub: `${stats?.mrr_growth || 0}% vs last mo`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Active Subs", value: stats?.active_subscriptions || 0, sub: "Paying customers", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-500/10" },
          { label: "Churn Rate", value: `${stats?.churn_rate || 0}%`, sub: "Monthly average", icon: Users, color: "text-indigo-600", bg: "bg-indigo-500/10" },
          { label: "Past Due", value: stats?.past_due || 0, sub: "Requires attention", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-500/10" },
        ].map((card, i) => (
          <div key={i} className="rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{card.label}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className={`text-[11px] font-bold ${card.color}`}>{card.sub}</p>
              </div>
              <div className={`rounded-xl p-3 ${card.bg} ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by tenant..."
            className="pl-9 h-11 bg-card border-none shadow-sm rounded-xl focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px] h-11 bg-card border-none shadow-sm rounded-xl">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="past_due">Past Due</SelectItem>
            <SelectItem value="trialing">Trialing</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
          </SelectContent>
        </Select>

        <Select value={plan} onValueChange={setPlan}>
          <SelectTrigger className="w-[180px] h-11 bg-card border-none shadow-sm rounded-xl">
            <SelectValue placeholder="All Plans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            {plans.map((p: any) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl bg-card shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">Processing financial records...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-card shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Tenant</TableHead>
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Plan / Billing</TableHead>
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Status</TableHead>
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Amount</TableHead>
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Period</TableHead>
                <TableHead className="px-6 h-14 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length > 0 ? subscriptions.map((sub: Subscription) => (
                <TableRow key={sub.id} className="group hover:bg-muted/50 border-none transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                        {sub.tenant_name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {sub.tenant_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-foreground">{sub.plan_name}</span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{sub.interval === 'month' ? 'Monthly' : 'Yearly'} Billing</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getStatusBadge(sub.status)}
                    {sub.cancel_at_period_end && (
                      <p className="mt-1 text-[9px] text-muted-foreground italic tracking-tight">Pending cancellation</p>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm font-bold text-foreground">
                      {formatCurrency(sub.amount)}
                      <span className="text-muted-foreground font-normal text-xs ml-0.5">/{sub.interval === 'month' ? 'mo' : 'yr'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(sub.current_period_end)}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem asChild>
                          <Link href={`/subscriptions/${sub.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/subscriptions/${sub.id}/edit`}>Manage Subscription</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/subscriptions/invoices?tenant_id=${sub.tenant_id}`}>View Invoices</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                    No active subscriptions match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
