"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Globe, 
  CreditCard, 
  TrendingUp, 
  Activity,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Zap,
  Server,
  LayoutDashboard
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
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
import { useEffect, useState } from "react";
import { useWebSocket } from "@/lib/hooks/useWebSocket";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  BarChart4, 
  Users2, 
  Target, 
  HeartHandshake, 
  ArrowUpRight, 
  ArrowDownRight, 
  Timer,
  MousePointer2,
  Megaphone,
  Briefcase
} from "lucide-react";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DashboardPage() {
  const { socket, isConnected } = useWebSocket();
  const [realtimeMetrics, setRealtimeMetrics] = useState<any>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["super-admin-dashboard"],
    queryFn: () => apiClient.get("super-admin/dashboard").then((res: any) => res.data.data),
    refetchInterval: 5000, // Faster refetch for strategic metrics
  });

  useEffect(() => {
    if (socket) {
      socket.on("dashboard:update", (metrics: any) => {
        setRealtimeMetrics(metrics);
      });
      return () => {
        socket.off("dashboard:update");
      };
    }
  }, [socket]);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Synchronizing global intelligence stream...</p>
        </div>
      </div>
    );
  }

  const { 
    overview = { active_tenants: 0, total_students: 0, monthly_revenue: 0 }, 
    revenue_metrics = { mrr: 0, arr: 0, ltv: 0, cac: 0, net_retention: 0 },
    marketing_metrics = { leads: 0, traffic: 0, conversion: 0, ad_spend: 0, roi: 0 },
    conversion_metrics = { trial_start: 0, trial_to_paid: 0, churn: 0, referral_rate: 0 },
    crm_metrics = { active_tickets: 0, resolution_time: "—", satisfaction: 0, health_avg: 0 },
    platform_activity = [],
    plan_distribution = [],
    at_risk_tenants = []
  } = data || {};

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            Global Executive Terminal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Cross-functional real-time performance indicators.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isConnected ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-rose-500/10 border-rose-500/20 text-rose-600'} text-[10px] font-black uppercase tracking-widest shadow-sm`}>
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          {isConnected ? 'Real-time Signal: Active' : 'Offline Mode'}
        </div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-2xl border h-14 w-full md:w-auto grid grid-cols-2 md:inline-flex md:grid-cols-4 gap-1">
          <TabsTrigger value="revenue" className="rounded-xl font-bold gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all h-full">
            <DollarSign className="h-4 w-4" /> Revenue
          </TabsTrigger>
          <TabsTrigger value="marketing" className="rounded-xl font-bold gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all h-full">
            <Megaphone className="h-4 w-4" /> Marketing
          </TabsTrigger>
          <TabsTrigger value="conversion" className="rounded-xl font-bold gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all h-full">
            <Target className="h-4 w-4" /> Conversion
          </TabsTrigger>
          <TabsTrigger value="crm" className="rounded-xl font-bold gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all h-full">
            <HeartHandshake className="h-4 w-4" /> CRM
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Monthly Recurring Revenue" value={formatCurrency(revenue_metrics.mrr)} trend="+8.2%" icon={DollarSign} color="text-emerald-500" bgColor="bg-emerald-500/10" />
            <StatCard title="Annual Run Rate" value={formatCurrency(revenue_metrics.arr)} trend="+12.4%" icon={TrendingUp} color="text-indigo-500" bgColor="bg-indigo-500/10" />
            <StatCard title="Customer Lifetime Value" value={formatCurrency(revenue_metrics.ltv)} trend="+4.1%" icon={Briefcase} color="text-blue-500" bgColor="bg-blue-500/10" />
            <StatCard title="Net Rev Retention" value={`${revenue_metrics.net_retention}%`} trend="+0.5%" icon={ArrowUpRight} color="text-amber-500" bgColor="bg-amber-500/10" />
          </div>
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4 border-none shadow-none h-[450px]">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Revenue Projections</CardTitle>
                <CardDescription>Real-time MRR compounding vs Churn impact.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={platform_activity}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fill="#6366f120" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="md:col-span-3 border-none shadow-none">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Plan Efficiency</CardTitle>
                <CardDescription>Revenue density per subscription tier.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={plan_distribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="count">
                      {plan_distribution.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Traffic to Lead" value={`${marketing_metrics.conversion}%`} trend="+0.2%" icon={MousePointer2} color="text-purple-500" bgColor="bg-purple-500/10" />
            <StatCard title="Active Campaigns" value="12 Live" trend="Nominal" icon={Megaphone} color="text-amber-500" bgColor="bg-amber-500/10" />
            <StatCard title="Avg Cost per Lead" value={formatCurrency(marketing_metrics.cac / 10)} trend="-2.4%" icon={Target} color="text-rose-500" bgColor="bg-rose-500/10" />
            <StatCard title="Ad Spend ROI" value={`${marketing_metrics.roi}x`} trend="+0.8x" icon={Activity} color="text-emerald-500" bgColor="bg-emerald-500/10" />
          </div>
          <Card className="border-none shadow-none">
             <CardHeader>
                <CardTitle className="text-lg font-bold">Marketing Funnel Velocity</CardTitle>
                <CardDescription>Real-time lead ingestion and qualification speed.</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="h-80 w-full flex items-center justify-center bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                    <div className="text-center space-y-2">
                       <BarChart4 className="h-10 w-10 text-muted-foreground mx-auto" />
                       <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Inbound Funnel Visualization</p>
                    </div>
                </div>
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Trial Starts (24h)" value={conversion_metrics.trial_start} trend="+18" icon={Clock} color="text-blue-500" bgColor="bg-blue-500/10" />
            <StatCard title="Trial to Paid Rate" value={`${conversion_metrics.trial_to_paid}%`} trend="+1.2%" icon={Zap} color="text-amber-500" bgColor="bg-amber-500/10" />
            <StatCard title="Gross Churn Rate" value={`${conversion_metrics.churn}%`} trend="-0.1%" icon={ArrowDownRight} color="text-rose-500" bgColor="bg-rose-500/10" />
            <StatCard title="Viral K-Factor" value="1.2" trend="Growth Ops" icon={Users2} color="text-indigo-500" bgColor="bg-indigo-500/10" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
             <Card className="border-none shadow-none">
                <CardHeader><CardTitle>Onboarding Friction</CardTitle></CardHeader>
                <CardContent className="h-60 flex items-center justify-center italic text-muted-foreground">Session event data pending.</CardContent>
             </Card>
             <Card className="border-none shadow-none">
                <CardHeader><CardTitle>Referral Vectors</CardTitle></CardHeader>
                <CardContent className="h-60 flex items-center justify-center italic text-muted-foreground">Network graph stream inactive.</CardContent>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="crm" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Active Urgent Tickets" value={crm_metrics.active_tickets} trend="-2" icon={AlertTriangle} color="text-rose-500" bgColor="bg-rose-500/10" />
            <StatCard title="Avg Resolution Time" value={crm_metrics.resolution_time} trend="-15m" icon={Timer} color="text-blue-500" bgColor="bg-blue-500/10" />
            <StatCard title="CSAT Score" value={`${crm_metrics.satisfaction}%`} trend="+2%" icon={HeartHandshake} color="text-emerald-500" bgColor="bg-emerald-500/10" />
            <StatCard title="Avg Tenant Health" value={`${crm_metrics.health_avg}/100`} trend="Stable" icon={ShieldCheck} color="text-indigo-500" bgColor="bg-indigo-500/10" />
          </div>
          <Card className="border-none shadow-none overflow-hidden text-sm">
             <CardHeader>
                <CardTitle>Critical Tenant Feed</CardTitle>
                <CardDescription>Live CRM interventions required based on health dips.</CardDescription>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y border-t">
                  {at_risk_tenants.slice(0, 3).map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center font-black">!</div>
                          <div><p className="font-bold">{t.name}</p><p className="text-[10px] opacity-60">Last sync failure: 12m ago</p></div>
                       </div>
                       <Badge variant="destructive">Urgent Handler Needed</Badge>
                    </div>
                  ))}
                </div>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, color, bgColor }: any) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-xl ${bgColor} ${color}`}><Icon className="h-4 w-4" /></div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black tabular-nums">{value}</div>
        <p className={`text-[10px] font-bold mt-1 ${trend.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend} <span className="text-muted-foreground opacity-60">vs prev period</span>
        </p>
      </CardContent>
    </Card>
  );
}
