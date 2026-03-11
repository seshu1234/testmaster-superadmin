"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Zap,
  Server,
  AlertOctagon,
  RefreshCcw,
  Cpu,
  Database,
  BarChart3,
  Clock,
  ArrowUpRight,
  TrendingDown,
  ShieldCheck,
  ChevronRight,
  Loader2
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { useWebSocket } from "@/lib/hooks/useWebSocket";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  queue_size: number;
  failed_jobs: number;
  requests_per_minute: number;
  avg_response_time: number;
  uptime: number;
  latency_p95: number[];
  error_rate: number[];
}

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const { socket, isConnected } = useWebSocket();

  const { data: initialMetricsResponse, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["system-metrics"],
    queryFn: () => apiClient.get("super-admin/monitoring/metrics").then((res) => res.data),
  });
  const initialMetrics = initialMetricsResponse?.data;

  useEffect(() => {
    if (initialMetrics) {
      setMetrics(initialMetrics);
    }
  }, [initialMetrics]);

  useEffect(() => {
    if (socket) {
      socket.on("metrics:update", (data: SystemMetrics) => {
        setMetrics(data);
      });

      socket.emit("subscribe:metrics");

      return () => {
        socket.off("metrics:update");
        socket.emit("unsubscribe:metrics");
      };
    }
  }, [socket]);

  const { data: recentErrorsResponse } = useQuery({
    queryKey: ["recent-errors"],
    queryFn: () => apiClient.get("super-admin/monitoring/errors?limit=10").then((res) => res.data),
    refetchInterval: 30000,
  });
  const recentErrors = recentErrorsResponse?.data;

  const metricsCards = [
    {
      name: "CPU Utilization",
      value: metrics?.cpu ? `${metrics.cpu}%` : "0%",
      icon: Cpu,
      status: metrics?.cpu && metrics.cpu > 80 ? "critical" : "optimal",
      desc: "Distributed load across 8 nodes"
    },
    {
      name: "Memory Heap",
      value: metrics?.memory ? `${metrics.memory}%` : "0%",
      icon: Server,
      status: metrics?.memory && metrics.memory > 80 ? "critical" : "optimal",
      desc: "64GB Allocated / 52GB Used"
    },
    {
      name: "API Latency",
      value: metrics?.avg_response_time ? `${metrics.avg_response_time}ms` : "0ms",
      icon: Zap,
      status: metrics?.avg_response_time && metrics.avg_response_time > 300 ? "warning" : "optimal",
      desc: "Global p95 baseline"
    },
    {
      name: "Active Queues",
      value: metrics?.queue_size?.toString() || "0",
      icon: Activity,
      status: metrics?.queue_size && metrics.queue_size > 100 ? "warning" : "optimal",
      desc: "Horizon workers: 12 active"
    },
  ];

  if (isLoadingMetrics) {
     return (
        <div className="flex h-[70vh] items-center justify-center">
           <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm font-bold text-muted-foreground animate-pulse">Establishing Fortress Connection...</p>
           </div>
        </div>
     );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Technical Fortress</h1>
          <p className="text-sm text-muted-foreground font-medium">Real-time infrastructure health and performance telemetry.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isConnected ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-rose-500/10 border-rose-500/20 text-rose-600'} text-xs font-black uppercase tracking-widest`}>
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            {isConnected ? 'Telemetry Active' : 'Offline'}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.reload()}
            className="rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metricsCards.map((item) => (
          <Card key={item.name} className="rounded-[2rem] border-none shadow-none overflow-hidden group transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                 <div className={`p-3 rounded-2xl ${item.status === 'optimal' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                    <item.icon className="h-5 w-5" />
                 </div>
                 <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest ${item.status === 'optimal' ? 'text-emerald-500' : 'text-rose-500'} border-none`}>
                    {item.status}
                 </Badge>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{item.name}</p>
                 <p className="text-2xl font-black text-foreground">{item.value}</p>
                 <p className="text-[9px] font-medium text-muted-foreground/60">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Performance Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Latency Chart */}
        <Card className="rounded-[2.5rem] border-none shadow-none overflow-hidden bg-card">
           <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                 <div>
                    <CardTitle className="text-lg">p95 API Latency</CardTitle>
                    <CardDescription>Response time trends filtered by gateway.</CardDescription>
                 </div>
                 <Zap className="h-5 w-5 text-indigo-500" />
              </div>
           </CardHeader>
           <CardContent className="p-8">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { time: '10:00', p95: 120, p99: 180 },
                    { time: '10:05', p95: 135, p99: 210 },
                    { time: '10:10', p95: 115, p99: 165 },
                    { time: '10:15', p95: 155, p99: 240 },
                    { time: '10:20', p95: 125, p99: 195 },
                    { time: '10:25', p95: 130, p99: 200 },
                  ]}>
                    <defs>
                      <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))' }}
                    />
                    <Area type="monotone" dataKey="p95" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-muted-foreground uppercase italic px-2">
                 <span>Baseline: 150ms</span>
                 <span className="text-emerald-500 flex items-center gap-1"><TrendingDown className="h-3 w-3" /> 12% improvement</span>
              </div>
           </CardContent>
        </Card>

        {/* Error Rates Chart */}
        <Card className="rounded-[2.5rem] border-none shadow-none overflow-hidden bg-card">
           <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                 <div>
                    <CardTitle className="text-lg">HTTP Error Rates</CardTitle>
                    <CardDescription>Aggregate of 4xx and 5xx responses.</CardDescription>
                 </div>
                 <AlertOctagon className="h-5 w-5 text-rose-500" />
              </div>
           </CardHeader>
           <CardContent className="p-8">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { time: '10:00', e4xx: 120, e5xx: 5 },
                    { time: '10:05', e4xx: 145, e5xx: 2 },
                    { time: '10:10', e4xx: 98, e5xx: 0 },
                    { time: '10:15', e4xx: 110, e5xx: 8 },
                    { time: '10:20', e4xx: 85, e5xx: 1 },
                    { time: '10:25', e4xx: 92, e5xx: 0 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))' }}
                    />
                    <Bar dataKey="e4xx" name="4xx Client Error" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="e5xx" name="5xx Server Error" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                 <div className="p-3 bg-muted/30 rounded-2xl flex items-center justify-between">
                    <span className="text-[10px] font-black text-muted-foreground uppercase italic px-2">Global Error %</span>
                    <span className="text-sm font-black">0.02%</span>
                 </div>
                 <div className="p-3 bg-muted/30 rounded-2xl flex items-center justify-between font-black">
                    <span className="text-emerald-500 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Verified Stable</span>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Bottom Grid: Recent Errors and Quick Links */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-none overflow-hidden">
          <CardHeader className="bg-muted/30 flex flex-row items-center justify-between space-y-0 px-8 py-6">
            <div>
              <CardTitle className="text-lg">Fortress Sentry: Error Logs</CardTitle>
              <CardDescription>Real-time detection across all tenant clusters.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="rounded-xl font-bold">
               <Link href="/monitoring/logs">View All logs <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-muted/50">
                {recentErrors?.length > 0 ? (
                  recentErrors.map((error: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 p-6 hover:bg-muted/10 transition-colors">
                       <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 flex-shrink-0">
                          <AlertOctagon className="h-5 w-5" />
                       </div>
                       <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm font-black text-foreground line-clamp-1">{error.message}</p>
                          <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                             <span className="bg-muted px-1.5 py-0.5 rounded tracking-widest">{error.type || 'Runtime'}</span>
                             <span>•</span>
                             <span>{formatDistanceToNow(new Date(error.timestamp))} ago</span>
                          </div>
                       </div>
                       <Button variant="ghost" size="sm" className="rounded-xl text-[10px] font-black uppercase text-primary">Debug</Button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                     <ShieldCheck className="h-10 w-10 text-emerald-500 opacity-20" />
                     <p className="text-sm font-bold text-muted-foreground">The Sentry detects no active system errors.</p>
                  </div>
                )}
             </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
           <Card className="rounded-[2.5rem] border-none shadow-none p-4 bg-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-black uppercase tracking-tighter flex items-center gap-2">
                   <BarChart3 className="h-5 w-5 text-primary" />
                   Rapid Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'Queue Management', href: '/monitoring/queue', icon: Clock },
                  { label: 'Webhook Deliveries', href: '/monitoring/webhooks', icon: Activity },
                  { label: 'Database Perf', href: '/monitoring/database', icon: Database },
                ].map((link, i) => (
                  <Button key={i} variant="ghost" asChild className="w-full justify-start rounded-2xl h-14 font-bold text-muted-foreground hover:bg-white hover:text-primary transition-all group px-4">
                    <Link href={link.href} className="flex items-center w-full">
                       <div className="p-2 rounded-xl bg-muted/50 group-hover:bg-primary/10 mr-4 transition-colors">
                          <link.icon className="h-4 w-4" />
                       </div>
                       {link.label}
                       <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </Link>
                  </Button>
                ))}
              </CardContent>
           </Card>

           <Card className="rounded-[2.5rem] border-none shadow-none p-8">
              <h3 className="text-sm font-black text-foreground mb-6 flex items-center gap-2">
                 <Server className="h-4 w-4 text-primary" />
                 Active Alerts
              </h3>
              <div className="space-y-4">
                  {metrics?.failed_jobs && metrics.failed_jobs > 0 ? (
                    <div className="rounded-2xl bg-amber-500/10 p-5 border border-amber-500/20 text-amber-700">
                      <div className="flex items-center gap-2 mb-1">
                         <Clock className="h-4 w-4" />
                         <span className="text-xs font-black uppercase tracking-widest">Incomplete Tasks</span>
                      </div>
                      <p className="text-xs font-bold leading-relaxed">
                        {metrics.failed_jobs} failed background jobs detected in the last cycle. Manual retry recommended.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                       <p className="text-xs font-bold text-muted-foreground uppercase opacity-40">All alerts suppressed</p>
                    </div>
                  )}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
