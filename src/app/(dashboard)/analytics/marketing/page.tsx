"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Target, 
  AlertCircle, 
  ArrowRight,
  ChevronRight,
  Filter,
  MousePointer2
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

const COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

export default function MarketingAnalyticsPage() {
  const { data: funnelData, isLoading: funnelLoading } = useQuery({
    queryKey: ["marketing-funnels"],
    queryFn: () => apiClient.get("super-admin/marketing/funnels").then((res: any) => res.data.data),
  });

  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ["marketing-trends"],
    queryFn: () => apiClient.get("super-admin/marketing/trends").then((res: any) => res.data.data),
  });

  if (funnelLoading || trendLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground font-medium">Crunching conversion data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Marketing & Funnels</h1>
          <p className="text-sm text-muted-foreground font-medium">Conversion intelligence for channel-specific acquisition funnels.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/50 border border-primary/5">
           <Filter className="h-4 w-4 text-muted-foreground" />
           <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Global View</span>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Traffic", value: "5,321", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Avg Conversion", value: "15.2%", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Lead Velocity", value: "+12.4%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Leakage Points", value: "4", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
        ].map((kpi, i) => (
          <Card key={i} className="rounded-3xl border-none shadow-sm bg-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{kpi.label}</p>
                  <p className="text-2xl font-black text-foreground">{kpi.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funnel Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.entries(funnelData || {}).map(([key, program]: [string, any]) => (
          <Card key={key} className="rounded-[2.5rem] border-none shadow-sm bg-card overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">{program.name}</CardTitle>
                  <CardDescription>Multi-stage conversion path analysis.</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                  <MousePointer2 className="h-4 w-4 text-primary opacity-40" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                {program.stages.map((stage: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-black text-muted-foreground">{i + 1}</span>
                          {stage.stage}
                       </span>
                       <div className="text-right">
                          <span className="text-sm font-black text-foreground">{formatNumber(stage.count)}</span>
                          <span className="ml-2 text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                            {stage.prev_percentage}%
                          </span>
                       </div>
                    </div>
                    <div className="h-3 w-full bg-muted/30 rounded-full overflow-hidden">
                       <div 
                          className="h-full transition-all duration-1000 ease-out" 
                          style={{ 
                            width: `${(stage.count / program.stages[0].count) * 100}%`,
                            backgroundColor: COLORS[i % COLORS.length]
                          }}
                       />
                    </div>
                    
                    {i < program.stages.length - 1 && (
                      <div className="absolute left-2.5 top-8 w-px h-6 bg-muted-foreground/10" />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-primary/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Critical Leakage Points</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.dropoffs.map((drop: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-muted/30 border border-primary/5">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black text-foreground uppercase tracking-wider">{drop.stage}</span>
                        <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-md">-{drop.leakage}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium">{drop.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conversion Trends */}
      <Card className="rounded-[2.5rem] border-none shadow-sm bg-card overflow-hidden">
        <CardHeader className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Conversion Trajectory</CardTitle>
              <CardDescription>Daily successful coaching centre signups across all channels.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rolling 7-Day View</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: '700'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4} 
                  dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
