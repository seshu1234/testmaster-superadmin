"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Zap, 
  Cpu, 
  AlertTriangle, 
  Search, 
  BarChart3, 
  ArrowUpRight,
  Monitor,
  History,
  Loader2,
  Filter
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function AIUsagePage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["ai-usage-analytics"],
    queryFn: () => apiClient.get("super-admin/analytics/ai").then((res) => res.data),
  });

  const stats = response?.data || {
    total_credits_used: 0,
    active_models: 0,
    avg_response_time: 0,
    usage_by_tenant: [],
    usage_trend: [],
    at_risk: []
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Intelligence Grid</h1>
          <p className="text-sm text-muted-foreground font-medium">Monitor credit consumption and model performance across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-none bg-card shadow-sm h-10">
              <History className="mr-2 h-4 w-4" /> Usage Logs
           </Button>
           <Button className="rounded-xl shadow-lg shadow-primary/20">
              <Zap className="mr-2 h-4 w-4" /> Credit Adjustment
           </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Total Credits (24h)" 
          value={stats.total_credits_used.toLocaleString()} 
          icon={Zap}
          trend="+12%"
          trendType="up"
        />
        <MetricCard 
          label="Active Model Endpoints" 
          value={stats.active_models} 
          icon={Cpu}
          description="Across all providers"
        />
        <MetricCard 
          label="Avg Response Latency" 
          value={`${stats.avg_response_time}ms`} 
          icon={Monitor}
          trend="-45ms"
          trendType="up"
        />
        <MetricCard 
          label="Anomalous Spike Dept." 
          value={stats.at_risk?.length || 0} 
          icon={AlertTriangle}
          color={stats.at_risk?.length > 0 ? "text-rose-600" : "text-emerald-600"}
          bgColor={stats.at_risk?.length > 0 ? "bg-rose-500/10" : "bg-emerald-500/10"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Trend */}
        <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="p-8">
             <div className="flex items-center justify-between">
                <div>
                   <CardTitle className="text-xl font-bold">Consumption Velocity</CardTitle>
                   <CardDescription>Credit burn rate for the last 24 hours.</CardDescription>
                </div>
                <div className="flex gap-2">
                   <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Credits</span>
                   </div>
                </div>
             </div>
          </CardHeader>
          <CardContent className="px-4 pb-8">
             <div className="h-80 w-full">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center animate-pulse bg-muted/20 rounded-[2rem]">
                     <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.usage_trend?.length > 0 ? stats.usage_trend : dummyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="hour" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                      />
                      <Bar dataKey="credits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
             </div>
          </CardContent>
        </Card>

        {/* Top Consumers */}
        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="p-8">
             <CardTitle className="text-xl font-bold">Top Consumers</CardTitle>
             <CardDescription>Institutions with highest credit burn.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 flex-1 flex flex-col justify-start">
             <div className="space-y-5">
                {(stats.usage_by_tenant?.length > 0 ? stats.usage_by_tenant : dummyTenantData).map((tenant: any, i: number) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-muted/30 hover:bg-muted/50 transition-colors group cursor-default">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-2xl bg-background flex items-center justify-center font-black text-xs shadow-sm">
                            {tenant.name.slice(0, 2).toUpperCase()}
                         </div>
                         <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight">{tenant.name}</span>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-none">Global ID: {tenant.id.slice(0, 6)}</span>
                         </div>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-sm font-black text-primary tracking-tighter">{tenant.credits.toLocaleString()}</span>
                         <span className="text-[9px] font-bold text-muted-foreground uppercase leading-none">Credits</span>
                      </div>
                   </div>
                ))}
             </div>
             <Button variant="ghost" className="mt-6 w-full rounded-2xl h-12 font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                View Full Audit
             </Button>
          </CardContent>
        </Card>
      </div>

      {/* Anomalies / At Risk */}
      {stats.at_risk?.length > 0 && (
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-rose-500/5 overflow-hidden">
          <CardHeader className="p-8">
             <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                <CardTitle className="text-lg font-bold text-rose-900">Spike Anomalies Detected</CardTitle>
             </div>
             <CardDescription className="text-rose-600/70">The following tenants have shown a 300%+ increase in credit burn rate compared to their 7-day average.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.at_risk.map((risk: any, i: number) => (
                   <Card key={i} className="rounded-3xl border-rose-100 bg-white/50 p-4">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-bold">{risk.tenant}</span>
                         <Badge variant="destructive" className="bg-rose-500 text-white border-none font-bold">+{risk.spike}</Badge>
                      </div>
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                         <span>Current: {risk.recent}</span>
                         <span>Avg: {risk.average}</span>
                      </div>
                   </Card>
                ))}
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricCard({ label, value, trend, trendType, icon: Icon, description, color, bgColor }: any) {
  return (
    <Card className="rounded-[2rem] border-none shadow-sm p-4 overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
           <div className={`p-3 rounded-2xl ${bgColor || 'bg-muted/40'} group-hover:bg-primary/10 transition-colors duration-300`}>
             <Icon className={`h-6 w-6 ${color || 'text-muted-foreground'} group-hover:text-primary transition-colors`} />
           </div>
           {trend && (
             <span className={`flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full ${trendType === 'up' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
               <ArrowUpRight className="h-3 w-3" />
               {trend}
             </span>
           )}
        </div>
        <div className="mt-6 space-y-1">
          <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">{label}</p>
          <h3 className="text-3xl font-black text-foreground tracking-tighter">{value}</h3>
          {description && <p className="text-[10px] font-medium text-muted-foreground opacity-60 italic">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

const dummyTrendData = [
  { hour: '00:00', credits: 1200 },
  { hour: '04:00', credits: 800 },
  { hour: '08:00', credits: 2400 },
  { hour: '12:00', credits: 4200 },
  { hour: '16:00', credits: 3800 },
  { hour: '20:00', credits: 2900 },
];

const dummyTenantData = [
  { id: 'tn_1', name: 'Global Tech Institute', credits: 15400 },
  { id: 'tn_2', name: 'Heritage Academy', credits: 12100 },
  { id: 'tn_3', name: 'Future Skills Hub', credits: 9800 },
];
