"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Globe, 
  CreditCard, 
  TrendingUp, 
  Activity,
  AlertTriangle,
  Clock
} from "lucide-react";
import apiClient from "@/lib/api/client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["super-admin-dashboard"],
    queryFn: () => apiClient.get("super-admin/dashboard").then((res: any) => res.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500 font-medium">Quantifying platform metrics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-lg font-semibold text-red-900">Failed to load analytics</h3>
        <p className="mt-2 text-sm text-red-700">{error ? "Please check your connection or permissions." : "Analytics data is unavailable."}</p>
      </div>
    );
  }

  const { overview, plan_distribution, signup_trend, platform_activity, recent_tenants, at_risk_tenants } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Platform Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monitor global growth, revenue, and system utilization across all tenants.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Activity className="h-4 w-4" />
          Live Platform Stats
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Tenants", value: overview.active_tenants, sub: `${overview.total_tenants} total`, icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Monthly Revenue", value: `$${overview.mrr.toLocaleString()}`, sub: "Gross MRR", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Growth Rate", value: `${overview.conversion_rate}%`, sub: "Trial to Paid", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Active Trials", value: overview.trial_tenants, sub: `${overview.churned_month} churned mo`, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((card, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                   <p className="mt-1 text-3xl font-bold text-foreground">{card.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                   <card.icon className="h-6 w-6" />
                </div>
             </div>
             <p className="mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 space-y-8">
           <div className="rounded-2xl bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                 <h2 className="text-xl font-bold text-foreground">Platform Utilization</h2>
                 <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last 30 Days</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={platform_activity}>
                    <defs>
                      <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="count" name="Global Activity" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-2xl bg-card p-6 shadow-sm">
                <h3 className="mb-6 text-lg font-bold text-foreground">Tenant Growth</h3>
                <div className="h-48">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={signup_trend}>
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <XAxis dataKey="date" hide />
                        <Tooltip />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl bg-card p-6 shadow-sm">
                <h3 className="mb-6 text-lg font-bold text-foreground">Recent Signups</h3>
                <div className="space-y-4">
                   {recent_tenants.slice(0, 5).map((tenant: any) => (
                      <div key={tenant.id} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary text-xs">
                               {tenant.name.charAt(0)}
                            </div>
                            <div>
                               <p className="text-xs font-semibold text-foreground">{tenant.name}</p>
                               <p className="text-[10px] text-muted-foreground">{tenant.plan?.name || "Free Trial"}</p>
                            </div>
                         </div>
                         <div className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${
                            tenant.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                         }`}>
                            {tenant.status}
                         </div>
                      </div>
                   ))}
                </div>
              </div>
           </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
           <div className="rounded-2xl bg-card p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold text-foreground">Market Share</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={plan_distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {plan_distribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                 {plan_distribution.map((plan: any, i: number) => (
                   <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                        <span className="text-muted-foreground">{plan.name}</span>
                      </div>
                      <span className="font-bold text-foreground">{plan.count}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="rounded-2xl bg-card p-6 shadow-sm">
             <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                   <AlertTriangle className="h-4 w-4 text-destructive" />
                   At-Risk Tenants
                </h2>
             </div>
             <div className="space-y-4">
                {at_risk_tenants.length > 0 ? (
                  at_risk_tenants.map((tenant: any) => (
                    <div key={tenant.id} className="rounded-xl p-3 bg-destructive/5">
                       <p className="text-xs font-bold text-foreground">{tenant.name}</p>
                       <div className="mt-1 flex items-center justify-between">
                          <p className="text-[10px] text-muted-foreground">Expiring soon</p>
                          <p className="text-[10px] font-medium text-destructive">{new Date(tenant.trial_ends_at).toLocaleDateString()}</p>
                       </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-muted-foreground py-4">No critical trial expirations.</p>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
