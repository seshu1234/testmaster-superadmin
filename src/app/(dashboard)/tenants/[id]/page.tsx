"use client";

import { useQuery } from "@tanstack/react-query";
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
  CheckCircle2
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  };
}

const dummyChartData = [
  { name: 'W1', students: 400, tests: 240 },
  { name: 'W2', students: 600, tests: 380 },
  { name: 'W3', students: 800, tests: 520 },
  { name: 'W4', students: 1000, tests: 740 },
  { name: 'W5', students: 1200, tests: 900 },
];

export default function TenantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: response, isLoading, error } = useQuery({
    queryKey: ["tenant", id],
    queryFn: () => apiClient.get(`super-admin/tenants/${id}`).then((res) => res.data),
  });

  const tenant = response?.data as TenantDetails;

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
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'trial':
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Free Trial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
          <Button size="sm">
            <ShieldCheck className="mr-2 h-4 w-4" /> Impersonate Admin
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
          <Card>
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

            <TabsContent value="insights">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Usage Trends</CardTitle>
                  <CardDescription>Operational metrics for recent weeks.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dummyChartData}>
                        <defs>
                          <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="students" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorStudents)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="tests" 
                          stroke="#94a3b8" 
                          strokeWidth={1}
                          strokeDasharray="4 4"
                          fillOpacity={0} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenant.subscriptions?.length > 0 ? tenant.subscriptions.map((sub: any) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">#{sub.id?.substring(0, 8).toUpperCase()}</TableCell>
                        <TableCell>{sub.plan?.name || "—"}</TableCell>
                        <TableCell>{sub.plan?.price_monthly ? `$${sub.plan.price_monthly}` : "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{sub.status}</Badge>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                           No billing records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
               <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent System Logs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {[
                       { event: 'Configuration Change', time: '12m ago', state: 'Success' },
                       { event: 'Security Scan', time: '1h ago', state: 'Complete' },
                       { event: 'API Key Usage', time: '4h ago', state: 'Verified' },
                     ].map((log, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                           <div className="space-y-0.5">
                              <p className="text-sm font-medium">{log.event}</p>
                              <p className="text-xs text-muted-foreground">{log.time}</p>
                           </div>
                           <Badge variant="secondary" className="text-[10px] uppercase font-bold">{log.state}</Badge>
                        </div>
                     ))}
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
