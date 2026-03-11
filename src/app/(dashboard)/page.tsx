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
  LayoutDashboard,
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
  Briefcase,
  Layers,
  Sparkles,
  Search,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DashboardPage() {
  const { socket, isConnected } = useWebSocket();
  const [realtimeMetrics, setRealtimeMetrics] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["super-admin-dashboard"],
    queryFn: () => apiClient.get("super-admin/dashboard").then((res: any) => res.data.data),
    refetchInterval: 10000,
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
      <div className="flex h-[70vh] items-center justify-center grayscale opacity-50">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-10 w-10 animate-pulse text-indigo-500" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Calibrating global telemetry stream...</p>
        </div>
      </div>
    );
  }

  const { 
    overview = {}, 
    revenue_metrics = {},
    marketing_metrics = {},
    conversion_metrics = {},
    crm_metrics = {},
    platform_activity = [],
    plan_distribution = [],
    at_risk_tenants = [],
    conversion_funnel = []
  } = data || {};

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="rounded-lg border-primary/20 bg-primary/5 text-primary text-[8px] font-black uppercase px-2 py-0.5">Executive Terminal</Badge>
              <span className="text-[10px] font-black text-muted-foreground opacity-40 uppercase tracking-widest">v2.4 Delta</span>
           </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase tracking-widest">Platform Core</h1>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
             Live intelligence across {overview.active_tenants || 0} production nodes.
          </p>
        </div>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-none ${isConnected ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'} text-[10px] font-black uppercase tracking-widest shadow-inner`}>
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
          {isConnected ? 'Real-time Signal: Active' : 'Synchronization Active'}
        </div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-8">
        <TabsList className="bg-muted/30 p-1.5 rounded-[2rem] border-none h-16 w-full md:w-auto flex overflow-hidden shadow-inner">
          <TabsTrigger value="revenue" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all h-full">
            Revenue
          </TabsTrigger>
          <TabsTrigger value="marketing" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all h-full">
            Marketing
          </TabsTrigger>
          <TabsTrigger value="conversion" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all h-full">
            Conversion
          </TabsTrigger>
          <TabsTrigger value="crm" className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all h-full text-xs">
            CRM Ops
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:outline-none">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Recurring Revenue" value={formatCurrency(revenue_metrics.mrr)} trend="+8.2%" icon={DollarSign} color="text-emerald-500" bgColor="bg-emerald-500/10" description="Monthly MRR Floor" />
            <StatCard title="Annual Territory" value={formatCurrency(revenue_metrics.arr)} trend="+12.4%" icon={TrendingUp} color="text-indigo-500" bgColor="bg-indigo-500/10" description="LTM Projected ARR" />
            <StatCard title="Node Value (LTV)" value={formatCurrency(revenue_metrics.ltv)} trend="+4.1%" icon={Briefcase} color="text-blue-500" bgColor="bg-blue-500/10" description="Estimated Tenant Lifecycle"  />
            <StatCard title="Net Retention" value={`${revenue_metrics.net_retention}%`} trend="+0.5%" icon={ArrowUpRight} color="text-amber-500" bgColor="bg-amber-500/10" description="Expansion Index" />
          </div>
          <div className="grid gap-6 md:grid-cols-7">
            <Card className="md:col-span-4 border-none shadow-none rounded-[3rem] bg-card/50 backdrop-blur-sm overflow-hidden border border-white/5 h-[480px]">
               <CardHeader className="p-10 pb-4">
                  <div className="flex items-center justify-between">
                     <div>
                        <CardTitle className="text-xl font-black tracking-tighter uppercase tracking-widest">Financial Trajectory</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">Growth signals (Signups vs Revenue)</CardDescription>
                     </div>
                     <Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-xl font-black px-4 py-1">REAL-TIME</Badge>
                  </div>
               </CardHeader>
               <CardContent className="p-4 pt-0 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={platform_activity}>
                        <defs>
                           <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--muted))" opacity={0.2} />
                        <XAxis dataKey="date" hide />
                        <YAxis hide />
                        <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', fontWeight: 900, fontSize: '12px' }} />
                        <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorRevenue)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </CardContent>
            </Card>
            <Card className="md:col-span-3 border-none shadow-none rounded-[3rem] bg-indigo-600 text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="h-32 w-32" />
               </div>
               <CardHeader className="p-10 pb-0">
                  <CardTitle className="text-xl font-black tracking-tighter uppercase tracking-widest text-white">Market Density</CardTitle>
                  <CardDescription className="text-white/60 font-medium">Revenue distribution per tier.</CardDescription>
               </CardHeader>
               <CardContent className="h-[300px] flex items-center justify-center p-0">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={plan_distribution} cx="50%" cy="50%" innerRadius={70} outerRadius={90} dataKey="count" stroke="none">
                          {plan_distribution.map((_: any, i: number) => <Cell key={i} fill={['#ffffff', '#ffffff40', '#ffffff10'][i % 3]} />)}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </CardContent>
               <div className="px-10 pb-10 space-y-4">
                  {plan_distribution.slice(0, 3).map((plan: any, idx: number) => (
                      <div key={plan.name} className="flex justify-between items-center text-xs font-black">
                         <span className="opacity-60">{plan.name}</span>
                         <span className="tabular-nums">{plan.count} Nodes</span>
                      </div>
                  ))}
               </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:outline-none">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Inbound Traffic" value={formatNumber(marketing_metrics.traffic)} trend="+12%" icon={MousePointer2} color="text-purple-500" bgColor="bg-purple-500/10" description="Global Reach" />
            <StatCard title="Qualified Leads" value={marketing_metrics.leads} trend="+84" icon={Users2} color="text-amber-500" bgColor="bg-amber-500/10" description="Qualified CRM Ingest" />
            <StatCard title="Acquisition Cost" value={formatCurrency(marketing_metrics.cac)} trend="-4.2%" icon={Target} color="text-rose-500" bgColor="bg-rose-500/10" description="Blended CAC Floor" />
            <StatCard title="Conversion Ratio" value={`${marketing_metrics.conversion}%`} trend="+0.8%" icon={ArrowUpRight} color="text-emerald-500" bgColor="bg-emerald-500/10" description="Visitor-to-Lead Speed" />
          </div>
          <Card className="border-none shadow-none rounded-[3rem] bg-muted/30 overflow-hidden relative h-[450px]">
             <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
                <div>
                   <CardTitle className="text-xl font-black tracking-tighter uppercase tracking-widest">Acquisition Funnel</CardTitle>
                   <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">Full-stack multi-channel lead flow</CardDescription>
                </div>
                <Badge className="bg-white/40 text-black/60 border-none rounded-xl font-black px-4 py-1">ACTIVE STREAM</Badge>
             </CardHeader>
             <CardContent className="px-20 pb-10 flex items-center justify-center gap-12 h-[300px]">
                {conversion_funnel.map((item: any, idx: number) => (
                   <div key={item.stage} className="flex flex-col items-center gap-4 group scale-110">
                      <div 
                         className="h-24 w-24 rounded-[2rem] bg-white shadow-2xl shadow-indigo-500/10 flex items-center justify-center transition-all duration-500 group-hover:-translate-y-2 border border-muted"
                         style={{ opacity: 1 - (idx * 0.15) }}
                      >
                         <p className="text-xl font-black text-indigo-600 tabular-nums">{formatNumber(item.count)}</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{item.stage}</p>
                         <p className="text-[9px] font-bold text-emerald-500 mt-0.5">{item.percentage}% Yield</p>
                      </div>
                   </div>
                ))}
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:outline-none">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Trial Starts (24h)" value={conversion_metrics.trial_start} trend="+18" icon={Clock} color="text-blue-500" bgColor="bg-blue-500/10" description="New Cloud Instances" />
            <StatCard title="Activation Speed" value={`${conversion_metrics.trial_to_paid}%`} trend="+1.2%" icon={Zap} color="text-amber-500" bgColor="bg-amber-500/10" description="Trial to Paid Logic" />
            <StatCard title="Churn Threshold" value={`${conversion_metrics.churn}%`} trend="-0.1%" icon={ArrowDownRight} color="text-rose-500" bgColor="bg-rose-500/10" description="Involuntary Dips" />
            <StatCard title="Organic K-Factor" value={conversion_metrics.referral_rate} trend="Positive" icon={Search} color="text-indigo-500" bgColor="bg-indigo-500/10" description="Virality Index" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
             <Card className="border-none shadow-none rounded-[3rem] bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors group p-4 border border-indigo-500/10">
                <CardHeader className="p-10 pb-4">
                   <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6">
                      <Activity className="h-6 w-6 text-indigo-600" />
                   </div>
                   <CardTitle className="text-2xl font-black tracking-tighter uppercase tracking-widest">Transition Signal</CardTitle>
                   <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-40 mt-1">Subscriber onboarding velocity stream</CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-0 h-40 flex items-center justify-center gap-2">
                    {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
                        <div key={i} className={`w-2 h-16 rounded-full bg-indigo-500/20 animate-pulse`} style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                    <p className="absolute text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Active Pulse Monitored</p>
                </CardContent>
             </Card>
             <Card className="border-none shadow-none rounded-[3rem] bg-muted/40 p-4 border border-muted/50">
                <CardHeader className="p-10 pb-4">
                   <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
                      <Users className="h-6 w-6 text-emerald-600" />
                   </div>
                   <CardTitle className="text-2xl font-black tracking-tighter uppercase tracking-widest">Network Growth</CardTitle>
                   <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-40 mt-1">Cross-tenant referral network</CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-0 flex flex-col items-center justify-center gap-4 h-40">
                    <p className="text-4xl font-black tracking-tighter tabular-nums text-foreground">{conversion_metrics.referral_rate}x</p>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-xl font-black px-4 py-1 uppercase tracking-widest text-[9px]">Stabilized Expansion</Badge>
                </CardContent>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="crm" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:outline-none">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Urgent Inquiries" value={crm_metrics.active_tickets} trend="-2" icon={AlertTriangle} color="text-rose-500" bgColor="bg-rose-500/10" description="Action Required" />
            <StatCard title="Resolution Velocity" value={crm_metrics.resolution_time} trend="-15m" icon={Timer} color="text-blue-500" bgColor="bg-blue-500/10" description="MTTR Index" />
            <StatCard title="Pulse Satisfaction" value={`${crm_metrics.satisfaction}%`} trend="+2%" icon={HeartHandshake} color="text-emerald-500" bgColor="bg-emerald-500/10" description="CSAT Feedback" />
            <StatCard title="Network Health" value={`${crm_metrics.health_avg}/100`} trend="Stable" icon={ShieldCheck} color="text-indigo-500" bgColor="bg-indigo-500/10" description="Avg Infrastructure Score" />
          </div>
          <Card className="border-none shadow-none rounded-[3rem] bg-card overflow-hidden border border-muted/30">
             <CardHeader className="p-10 pb-6 flex flex-row items-center justify-between">
                <div>
                   <CardTitle className="text-xl font-black tracking-tighter uppercase tracking-widest">Critical Interventions</CardTitle>
                   <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">Tenants requiring immediate strategic handling</CardDescription>
                </div>
                <Badge variant="outline" className="rounded-xl border-rose-500/20 bg-rose-500/5 text-rose-600 text-[10px] font-black uppercase px-4 py-1.5">Attention Matrix</Badge>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y border-t divide-muted/30">
                  {at_risk_tenants.length > 0 ? at_risk_tenants.map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between p-8 hover:bg-muted/30 transition-all duration-300 group">
                       <div className="flex items-center gap-6">
                          <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                             <AlertTriangle className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-lg font-black tracking-tight">{t.name}</p>
                             <div className="flex items-center gap-3 mt-1">
                                <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                                   <Server className="h-2.5 w-2.5" /> Node: {t.slug}
                                </p>
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/20" />
                                <p className="text-[9px] font-black text-rose-500/60 uppercase tracking-widest">Health Dip: -14%</p>
                             </div>
                          </div>
                       </div>
                       <Button size="sm" className="rounded-2xl bg-rose-600 hover:bg-rose-700 font-bold px-6 h-10 shadow-lg shadow-rose-600/20">
                          Initiate Handler
                       </Button>
                    </div>
                  )) : (
                    <div className="p-20 text-center opacity-30 grayscale flex flex-col items-center gap-4">
                       <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                       <p className="text-xs font-black uppercase tracking-[0.3em]">All system nodes are within safety thresholds</p>
                    </div>
                  )}
                </div>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, color, bgColor, description }: any) {
  return (
    <Card className="border-none shadow-none rounded-[2.5rem] bg-card overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-white/5">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-8">
           <div className={`p-4 rounded-2xl ${bgColor} ${color} group-hover:scale-110 transition-transform`}>
              <Icon className="h-5 w-5" />
           </div>
           {trend && (
              <Badge className={`border-none rounded-xl font-black text-[9px] px-2.5 py-1 uppercase tracking-widest ${trend.includes('+') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                {trend}
              </Badge>
           )}
        </div>
        <div>
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-1">{title}</p>
           <h3 className="text-3xl font-black tracking-tighter text-foreground tabular-nums mb-2">{value}</h3>
           <p className="text-[10px] font-bold text-muted-foreground/60">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Loader2({ className }: { className?: string }) {
    return <Activity className={`${className} animate-pulse`} />;
}
