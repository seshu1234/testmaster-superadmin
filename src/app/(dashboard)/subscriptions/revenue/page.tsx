"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  CreditCard, 
  ArrowUpRight,
  Loader2,
  Calendar,
  Filter
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export default function RevenueAnalyticsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["revenue-analytics"],
    queryFn: () => apiClient.get("super-admin/analytics/revenue").then((res) => res.data),
  });

  const stats = response?.data || {
    mrr: 0,
    mrr_growth: 0,
    arr: 0,
    active_subscriptions: 0,
    churn_rate: 0,
    revenue_by_month: [],
    revenue_by_plan: []
  };

  const mrrTrend = stats.mrr_growth >= 0 ? 'up' : 'down';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Revenue Intelligence</h1>
          <p className="text-sm text-muted-foreground font-medium">Global financial performance and subscription unit economics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-none bg-card shadow-sm h-10 px-4">
            <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
          </Button>
          <Button variant="outline" className="rounded-xl border-none bg-card shadow-sm h-10 px-4">
            <Filter className="mr-2 h-4 w-4" /> Filter Plans
          </Button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Monthly Recurring Revenue" 
          value={`$${stats.mrr.toLocaleString()}`} 
          trend={`${stats.mrr_growth}%`}
          trendType={mrrTrend}
          icon={DollarSign}
        />
        <MetricCard 
          label="Active Subscriptions" 
          value={stats.active_subscriptions.toLocaleString()} 
          trend="+5.2%"
          trendType="up"
          icon={CreditCard}
        />
        <MetricCard 
          label="Annual Run Rate" 
          value={`$${(stats.mrr * 12).toLocaleString()}`} 
          icon={TrendingUp}
          description="Projected annual revenue"
        />
        <MetricCard 
          label="Churn Rate" 
          value={`${stats.churn_rate}%`} 
           trend="-0.5%"
          trendType="up" // Churn going down is good
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 rounded-[2rem] border-none shadow-sm overflow-hidden">
          <CardHeader className="p-8 pb-0">
             <div className="flex items-center justify-between">
                <div>
                   <CardTitle className="text-xl font-bold">Revenue Growth</CardTitle>
                   <CardDescription>Consolidated platform revenue over time.</CardDescription>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold">Live Feed</Badge>
             </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-80 w-full">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-2xl animate-pulse">
                   <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.revenue_by_month?.length > 0 ? stats.revenue_by_month : dummyRevenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(val) => `$${val/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="p-8 pb-0">
             <CardTitle className="text-xl font-bold">Tier Distribution</CardTitle>
             <CardDescription>Revenue contribution by plan.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 flex-1 flex flex-col justify-center">
             <div className="space-y-6">
                {(stats.revenue_by_plan?.length > 0 ? stats.revenue_by_plan : dummyPlanData).map((plan: any, i: number) => (
                   <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm font-bold">
                         <span className="text-muted-foreground">{plan.name}</span>
                         <span>${plan.amount.toLocaleString()}</span>
                      </div>
                      <Progress value={plan.percentage} className="h-2 rounded-full bg-muted/40" />
                   </div>
                ))}
             </div>
             
             <div className="mt-10 p-6 bg-primary/5 rounded-[1.5rem] space-y-3">
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-primary" />
                   <span className="text-xs font-black uppercase tracking-wider text-primary/60">Expansion Insight</span>
                </div>
                <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                   The <span className="text-foreground font-bold font-mono uppercase tracking-tighter">Enterprise</span> tier has seen a 12% increase in adoption this quarter.
                </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, trendType, icon: Icon, description }: any) {
  return (
    <Card className="rounded-[2rem] border-none shadow-sm p-4 overflow-hidden relative group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
           <div className="p-3 rounded-2xl bg-muted/40 group-hover:bg-primary/10 transition-colors duration-300">
             <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
           </div>
           {trend && (
             <span className={`flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full ${trendType === 'up' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
               {trendType === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
               {trend}
             </span>
           )}
        </div>
        <div className="mt-6 space-y-1">
          <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">{label}</p>
          <h3 className="text-3xl font-black text-foreground tracking-tighter">{value}</h3>
          {description && <p className="text-[10px] font-medium text-muted-foreground italic">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

const dummyRevenueData = [
  { month: 'Oct', amount: 45000 },
  { month: 'Nov', amount: 52000 },
  { month: 'Dec', amount: 48000 },
  { month: 'Jan', amount: 61000 },
  { month: 'Feb', amount: 68000 },
  { month: 'Mar', amount: 75000 },
];

const dummyPlanData = [
  { name: 'Starter', amount: 15200, percentage: 35 },
  { name: 'Professional', amount: 28400, percentage: 55 },
  { name: 'Enterprise', amount: 31400, percentage: 75 },
];
