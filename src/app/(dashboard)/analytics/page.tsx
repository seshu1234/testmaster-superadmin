"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  Users,
  ClipboardList,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Activity
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
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsHubPage() {
  const [activeTab, setActiveTab] = useState("growth");
  
  const { data, isLoading } = useQuery({
    queryKey: ["super-admin-analytics"],
    queryFn: () => apiClient.get("super-admin/dashboard").then((res: any) => res.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground font-medium italic">Synchronizing platform intelligence...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { overview, plan_distribution, signup_trend, platform_activity, cohort_retention, conversion_funnel } = data;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Intelligence Center</h1>
          <p className="text-sm text-muted-foreground font-medium">Authoritative data analysis and platform projection hub.</p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-muted/50 border border-primary/5">
           <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card shadow-sm border border-primary/10">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Sync: Active</span>
           </div>
        </div>
      </div>

      <Tabs defaultValue="growth" className="w-full space-y-8" onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1.5 rounded-2xl h-auto flex-wrap sm:flex-nowrap border border-primary/5">
          <TabsTrigger value="growth" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-xs font-black uppercase tracking-widest transition-all">
            <TrendingUp className="h-4 w-4 mr-2" />
            Growth Engine
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-xs font-black uppercase tracking-widest transition-all">
            <Users className="h-4 w-4 mr-2" />
            User Behavior
          </TabsTrigger>
          <TabsTrigger value="tests" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-xs font-black uppercase tracking-widest transition-all">
            <ClipboardList className="h-4 w-4 mr-2" />
            Test Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-8 mt-0 focus-visible:outline-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-card overflow-hidden">
               <CardHeader className="p-8 pb-0">
                  <div className="flex items-center justify-between">
                     <div>
                        <CardTitle className="text-xl font-bold">Conversion Funnel</CardTitle>
                        <CardDescription>Tenant acquisition efficiency metrics.</CardDescription>
                     </div>
                     <Target className="h-5 w-5 text-primary opacity-20" />
                  </div>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="space-y-6">
                     {conversion_funnel?.map((stage: any, i: number) => (
                        <div key={i} className="space-y-2 group">
                           <div className="flex justify-between items-end">
                              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stage.stage}</span>
                              <div className="text-right">
                                 <span className="text-sm font-black text-foreground">{formatNumber(stage.count)}</span>
                                 <span className="ml-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">{stage.percentage}%</span>
                              </div>
                           </div>
                           <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                              <div 
                                 className="h-full bg-primary/80 group-hover:bg-primary transition-all duration-1000" 
                                 style={{ width: `${stage.percentage}%` }}
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-sm bg-card overflow-hidden">
               <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-xl font-bold">Cohort Retention</CardTitle>
                  <CardDescription>MoM active tenant persistence by signup date.</CardDescription>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="overflow-hidden rounded-3xl border border-primary/5">
                     <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50">
                           <tr className="border-b border-primary/5">
                              <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground/60">Cohort</th>
                              <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground/60">Total</th>
                              <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground/60">Retained</th>
                              <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-foreground/60 text-right">Rate</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                           {cohort_retention?.map((cohort: any, i: number) => (
                              <tr key={i} className="hover:bg-primary/5 transition-colors">
                                 <td className="px-6 py-4 font-bold text-foreground">{cohort.cohort_month}</td>
                                 <td className="px-6 py-4 font-medium text-muted-foreground">{cohort.total_tenants}</td>
                                 <td className="px-6 py-4 font-medium text-muted-foreground">{cohort.retained_tenants}</td>
                                 <td className="px-6 py-4 text-right">
                                    <span className="font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">
                                       {cohort.retention_rate}%
                                    </span>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </CardContent>
            </Card>
          </div>

          <Card className="rounded-[2.5rem] border-none shadow-sm bg-card overflow-hidden">
             <CardHeader className="p-8">
                <CardTitle className="text-xl font-bold">Acquisition Trajectory</CardTitle>
                <CardDescription>Historical and projected tenant growth velocity.</CardDescription>
             </CardHeader>
             <CardContent className="p-8 pt-0">
                <div className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={signup_trend}>
                        <defs>
                          <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                        <XAxis dataKey="date" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Area type="monotone" dataKey="count" name="New Tenants" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-8 mt-0 focus-visible:outline-none">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                 { label: "DAU / MAU", value: "24.5%", sub: "Stickiness Ratio", icon: Activity, trend: "+2.1%", trendUp: true, color: "bg-blue-500" },
                 { label: "Avg Session", value: "48m", sub: "Platform Engagement", icon: Zap, trend: "-5m", trendUp: false, color: "bg-amber-500" },
                 { label: "Super Users", value: "1,240", sub: "Top 10% activity", icon: ShieldCheck, trend: "+124", trendUp: true, color: "bg-emerald-500" },
              ].map((kpi, i) => (
                 <Card key={i} className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden group">
                    <CardContent className="p-8">
                       <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-2xl ${kpi.color} text-white shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                             <kpi.icon className="h-5 w-5" />
                          </div>
                          <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${kpi.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                             {kpi.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                             {kpi.trend}
                          </div>
                       </div>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</p>
                       <p className="text-3xl font-black text-foreground tracking-tighter">{kpi.value}</p>
                       <p className="mt-2 text-[10px] font-bold text-muted-foreground/60 italic uppercase tracking-tighter">{kpi.sub}</p>
                    </CardContent>
                 </Card>
              ))}
           </div>
           
           <Card className="rounded-[2.5rem] border-none shadow-sm bg-card overflow-hidden">
              <CardHeader className="p-8">
                 <CardTitle className="text-xl font-bold">Hourly Engagement Heatmap</CardTitle>
                 <CardDescription>User activity levels distributed by timezone-normalized hours.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 flex items-center justify-center h-80 bg-muted/20">
                 <div className="text-center">
                    <Activity className="h-8 w-8 text-primary/20 mx-auto mb-4" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest italic">Wait for real-time user stream aggregation...</p>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-8 mt-0 focus-visible:outline-none">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="rounded-[2.5rem] border-none shadow-sm bg-card overflow-hidden">
                 <CardHeader className="p-8">
                    <CardTitle className="text-xl font-bold">Submission Velocity</CardTitle>
                    <CardDescription>Test submission spikes detected last 24h.</CardDescription>
                 </CardHeader>
                 <CardContent className="p-8 pt-0 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={platform_activity.slice(-24)}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                         <XAxis dataKey="date" hide />
                         <YAxis hide />
                         <Area type="step" dataKey="count" name="Submissions" stroke="hsl(var(--primary))" strokeWidth={2} fill="hsl(var(--primary))" fillOpacity={0.05} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </CardContent>
              </Card>

              <Card className="rounded-[2.5rem] border-none shadow-sm bg-card overflow-hidden">
                 <CardHeader className="p-8">
                    <CardTitle className="text-xl font-bold">Global Accuracy & Percentile</CardTitle>
                    <CardDescription>Normalized performance benchmarks.</CardDescription>
                 </CardHeader>
                 <CardContent className="p-8 pt-0 flex flex-col justify-center h-64">
                    <div className="space-y-6">
                       <div>
                          <div className="flex justify-between text-xs font-bold uppercase mb-2">
                             <span>Average Platform Score</span>
                             <span className="text-primary font-black">64.2%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                             <div className="h-full bg-primary w-[64.2%]" />
                          </div>
                       </div>
                       <div>
                          <div className="flex justify-between text-xs font-bold uppercase mb-2">
                             <span>Test Completion Rate</span>
                             <span className="text-emerald-500 font-black">98.5%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 w-[98.5%]" />
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
