"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { 
  Mail, 
  Calendar, 
  Users, 
  GraduationCap, 
  BookOpen, 
  AlertCircle,
  Globe,
  Settings,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Activity,
  DollarSign
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface TenantDetails {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string | null;
  status: 'active' | 'suspended' | 'trial';
  created_at: string;
  trial_ends_at: string | null;
  plan: {
    id: string;
    name: string;
    student_limit: number;
    teacher_limit: number;
    price_monthly: string;
  } | null;
  subscriptions: any[];
  stats: {
    total_users: number;
    total_students: number;
    total_teachers: number;
    total_tests: number;
    total_attempts: number;
    activity_trend?: any[];
  };
  logs?: any[];
}

const emptyChartData = [
  { name: 'W1', students: 0, tests: 0 },
  { name: 'W2', students: 0, tests: 0 },
  { name: 'W3', students: 0, tests: 0 },
  { name: 'W4', students: 0, tests: 0 },
  { name: 'W5', students: 0, tests: 0 },
];

export default function TenantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: response, isLoading, error } = useQuery({
    queryKey: ["tenant", id],
    queryFn: () => apiClient.get(`super-admin/crm/tenants/${id}`).then((res) => res.data),
  });

  const impersonateMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`super-admin/tenants/${id}/impersonate`),
    onSuccess: (res: any) => {
      const { token, tenant } = res.data.data;
      // In a real production app, this would be a real domain. For dev/local, we use localhost.
      // The PRD mentions {tenant}.testmaster.in
      const tenantDomain = process.env.NEXT_PUBLIC_APP_ENV === 'production'
        ? `https://${tenant.slug}.testmaster.in/login/callback?token=${token}`
        : `http://${tenant.slug}.localhost:3000/login/callback?token=${token}`;
      
      window.open(tenantDomain, "_blank");
    },
  });

  const crmData = response?.data;
  const tenant = crmData?.tenant;
  const billingHistory = crmData?.billing_history || [];
  const activityLog = crmData?.activity_log || [];
  const totalRevenue = crmData?.total_revenue || 0;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoaderComponent />
      </div>
    );
  }

  if (error || !tenant) {
    return <ErrorComponent router={router} />;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none px-3 py-1 font-bold">Active</Badge>;
      case 'suspended':
        return <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-none px-3 py-1 font-bold">Suspended</Badge>;
      case 'trial':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none px-3 py-1 font-bold">Free Trial</Badge>;
      default:
        return <Badge variant="outline" className="px-3 py-1 font-bold">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Simple Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="pl-0 text-muted-foreground hover:text-foreground"
            onClick={() => router.push("/tenants")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tenants
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
            {getStatusBadge(tenant.status)}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> {tenant.slug}.testmaster.in</span>
            <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {tenant.email}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined {new Date(tenant.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/tenants/${id}/edit`)}
          >
            <Settings className="mr-2 h-4 w-4" /> Edit Details
          </Button>
          <Button 
            size="sm"
            className="rounded-xl shadow-md shadow-primary/20"
            onClick={() => impersonateMutation.mutate(id)}
            disabled={impersonateMutation.isPending}
          >
            {impersonateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-4 w-4" />
            )}
            Impersonate Admin
          </Button>
        </div>
      </div>

      <Separator />

      {/* Basic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Students" 
          value={tenant.stats.total_students} 
          limit={tenant.plan?.student_limit} 
          icon={Users}
        />
        <StatCard 
          label="Teachers" 
          value={tenant.stats.total_teachers} 
          limit={tenant.plan?.teacher_limit} 
          icon={GraduationCap}
        />
        <StatCard 
          label="Total Tests" 
          value={tenant.stats.total_tests} 
          icon={BookOpen}
        />
        <StatCard 
          label="Attempts" 
          value={tenant.stats.total_attempts} 
          icon={CheckCircle2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Subscription & Plan</CardTitle>
              <CardDescription>Current tier and billing status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground font-medium uppercase">Current Plan</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{tenant.plan?.name || "No Plan"}</span>
                  {tenant.plan && (
                    <span className="text-sm font-medium text-muted-foreground">(${tenant.plan.price_monthly}/mo)</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next Billing</span>
                  <span className="font-medium">April 12, 2026</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contact Phone</span>
                  <span className="font-medium">{tenant.phone || "Not provided"}</span>
                </div>
              </div>

              <Separator />
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Secure Authentication
                 </div>
                 <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> API Access Enabled
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="billing">Payments</TabsTrigger>
              <TabsTrigger value="security">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-[2rem] border-none shadow-none overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <CardTitle className="text-lg">Activity Velocity</CardTitle>
                    <CardDescription>Relative engagement trends over the last 30 days.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-64 w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={tenant.stats?.activity_trend || emptyChartData}>
                          <defs>
                            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                          <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="students" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorStudents)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                   <Card className="rounded-[2rem] border-none shadow-none bg-emerald-500/5 p-2">
                       <CardHeader>
                          <CardTitle className="text-base font-black uppercase tracking-widest text-emerald-600">Infrastructure Status</CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
                             <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm font-bold">Node Connectivity</span>
                             </div>
                             <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[10px]">Healthy</Badge>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl">
                             <div className="flex items-center gap-3">
                                <Activity className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm font-bold">Database Latency</span>
                             </div>
                             <span className="text-sm font-black text-emerald-600">12ms</span>
                          </div>
                       </CardContent>
                   </Card>

                   <Card className="rounded-[2rem] border-none shadow-none p-6">
                      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60 mb-4">Storage Utilization</h3>
                      <div className="space-y-2">
                         <div className="flex items-center justify-between text-xs font-bold">
                            <span>Assets & Media</span>
                            <span>4.2 GB / 10 GB</span>
                         </div>
                         <Progress value={42} className="h-2 bg-muted" />
                      </div>
                   </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="billing" className="animate-in fade-in slide-in-from-top-2 duration-500 space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                     <Card className="rounded-[2rem] border-none shadow-none overflow-hidden">
                        <Table>
                           <TableHeader>
                              <TableRow className="bg-muted/30 border-none hover:bg-muted/30">
                                 <TableHead className="px-6 h-12">Reference</TableHead>
                                 <TableHead className="px-6 h-12">Plan</TableHead>
                                 <TableHead className="px-6 h-12">Date</TableHead>
                                 <TableHead className="px-6 h-12">Amount</TableHead>
                                 <TableHead className="px-6 h-12 text-right">Status</TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                               {tenant.billing_history?.length > 0 ? tenant.billing_history.map((bill: any) => (
                                  <TableRow key={bill.id} className="border-none hover:bg-muted/20">
                                     <TableCell className="px-6 py-4 font-black text-xs">{bill.invoice}</TableCell>
                                     <TableCell className="px-6 py-4 font-bold text-sm text-foreground/70">{bill.date}</TableCell>
                                     <TableCell className="px-6 py-4 font-black italic">${Number(bill.amount).toLocaleString()}</TableCell>
                                     <TableCell className="px-6 py-4 text-right">
                                        <Badge className={cn(
                                          "capitalize px-3 py-1 font-bold border-none text-[10px] uppercase",
                                          bill.status === 'paid' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                        )}>{bill.status}</Badge>
                                     </TableCell>
                                  </TableRow>
                               )) : (
                                  <TableRow>
                                     <TableCell colSpan={4} className="h-48 text-center text-muted-foreground italic">
                                        <div className="flex flex-col items-center gap-2">
                                           <DollarSign className="h-8 w-8 opacity-10" />
                                           <span>No billing records found.</span>
                                        </div>
                                     </TableCell>
                                  </TableRow>
                               )}
                           </TableBody>
                        </Table>
                     </Card>
                  </div>

                  <div className="space-y-6">
                     <Card className="rounded-[2.5rem] border-none shadow-none bg-primary/5 p-6">
                        <CardHeader className="p-0 mb-6">
                           <CardTitle className="text-base font-black uppercase tracking-widest text-primary">Admin Overrides</CardTitle>
                           <CardDescription className="text-[10px] font-medium uppercase">Strategic overrides for high-value tenants.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 space-y-4">
                            <div className="p-4 bg-white/50 rounded-2xl">
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Lifetime Revenue</p>
                               <p className="text-2xl font-black text-primary">${tenant.total_revenue?.toLocaleString()}</p>
                            </div>
                            <div className="space-y-2">
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Extend Trial Baseline</p>
                               <div className="flex gap-2">
                                  <Input type="date" className="h-11 rounded-xl border-none bg-white shadow-inner text-xs font-bold" />
                                  <Button size="sm" className="rounded-xl font-bold h-11 px-4">Apply</Button>
                               </div>
                            </div>
                           <Separator className="bg-primary/5" />
                           <div className="space-y-2">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Manual AI Credit Grant</p>
                              <div className="flex gap-2">
                                 <Input type="number" placeholder="Credits" className="h-11 rounded-xl border-none bg-white shadow-inner text-xs font-bold" />
                                 <Button size="sm" variant="outline" className="rounded-xl font-bold h-11 border-2">Add</Button>
                              </div>
                           </div>
                           <Button variant="ghost" className="w-full justify-start rounded-xl font-bold text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-11 mt-4">
                              <ShieldCheck className="mr-2 h-4 w-4" /> Reset Security Policy
                           </Button>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </TabsContent>
            
            <TabsContent value="security" className="animate-in fade-in slide-in-from-top-2 duration-500">
               <Card className="rounded-[2.5rem] border-none shadow-none overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-6 px-8 flex flex-row items-center justify-between space-y-0">
                    <div>
                       <CardTitle className="text-lg">Governance Audit Logs</CardTitle>
                       <CardDescription>Administrative actions across this tenant.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold">Export Logs</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                      <div className="divide-y divide-muted/50">
                        {activityLog.length > 0 ? activityLog.map((log: any, i: number) => (
                           <div key={log.id || i} className="flex justify-between items-center py-5 px-8 hover:bg-muted/10 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${log.event?.includes('Warning') ? 'bg-rose-500/10 text-rose-600' : 'bg-primary/10 text-primary'}`}>
                                    {log.event?.includes('Warning') ? <AlertCircle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                                 </div>
                                 <div className="space-y-0.5">
                                    <p className="text-sm font-black text-foreground">{log.description || log.event}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{log.causer?.name || log.user_name || 'System'} • {new Date(log.created_at).toLocaleString()}</p>
                                 </div>
                              </div>
                           </div>
                        )) : (
                          <div className="p-10 text-center text-xs font-bold text-muted-foreground opacity-50 italic">No historical audit logs found.</div>
                        )}
                      </div>
                  </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, limit, icon: Icon }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          {limit && <span className="text-xs text-muted-foreground">/ {limit.toLocaleString()}</span>}
        </div>
        {limit && (
          <div className="space-y-1.5 mt-3">
            <Progress value={(value / limit) * 100} className="h-1" />
            <p className="text-[10px] text-right text-muted-foreground font-medium">{Math.round((value / limit) * 100)}% Used</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LoaderComponent() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-8 w-8 border-b-2 border-primary rounded-full animate-spin" />
      <p className="text-sm font-medium text-muted-foreground">Loading Institutional Data...</p>
    </div>
  );
}

function ErrorComponent({ router }: { router: any }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive opacity-30" />
        <h2 className="text-xl font-bold">Tenant Not Found</h2>
        <p className="text-muted-foreground">We couldn't find the institution you're looking for.</p>
        <Button onClick={() => router.push("/tenants")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tenants
        </Button>
      </div>
    </div>
  );
}
