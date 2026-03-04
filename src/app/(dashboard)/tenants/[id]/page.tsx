"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Activity,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Globe
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Loading institutional intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold">Tenant Not Found</h2>
          <p className="text-muted-foreground">The institution you are looking for might have been removed or the ID is incorrect.</p>
          <Button onClick={() => router.push("/tenants")} variant="outline" className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tenants
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none px-3 py-1">Active</Badge>;
      case 'suspended':
        return <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-none px-3 py-1">Suspended</Badge>;
      case 'trial':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none px-3 py-1">Free Trial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="pl-0 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => router.push("/tenants")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tenants
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
            {getStatusBadge(tenant.status)}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {tenant.slug}.testmaster.in</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Joined {new Date(tenant.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl px-5 border-2">Edit Details</Button>
          <Button className="rounded-xl px-5 shadow-lg shadow-primary/20">
            <ShieldCheck className="mr-2 h-4 w-4" /> Impersonate Admin
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Stats & Info */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-primary/70">Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 font-medium">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><Users className="h-4 w-4" /></div>
                    <span>Total Students</span>
                  </div>
                  <span className="text-lg font-bold">{tenant.stats.total_students}</span>
                </div>
                <Progress value={(tenant.stats.total_students / (tenant.plan?.student_limit || 1000)) * 100} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground text-right italic">
                  {tenant.stats.total_students} / {tenant.plan?.student_limit || "∞"} limit
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 font-medium">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600"><GraduationCap className="h-4 w-4" /></div>
                    <span>Total Teachers</span>
                  </div>
                  <span className="text-lg font-bold">{tenant.stats.total_teachers}</span>
                </div>
                <Progress value={(tenant.stats.total_teachers / (tenant.plan?.teacher_limit || 100)) * 100} className="h-1.5" />
                <p className="text-[10px] text-muted-foreground text-right italic">
                   {tenant.stats.total_teachers} / {tenant.plan?.teacher_limit || "∞"} limit
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm break-all">{tenant.email}</span>
                </div>
                {tenant.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{tenant.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Plan: <span className="font-bold text-primary">{tenant.plan?.name || "Free"}</span></span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-gradient-to-br from-primary/10 via-background to-background">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 bg-white/50 backdrop-blur rounded-2xl border border-white/20 shadow-inner">
                <CreditCard className="h-10 w-10 text-primary mb-2 opacity-50" />
                <p className="text-2xl font-black text-primary">${tenant.plan?.price_monthly || "0.00"}</p>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Monthly Billing</p>
              </div>
              
              <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600">Active</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">ID: sub_1N82hX9...</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Tabs */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="bg-muted/50 p-1.5 rounded-2xl mb-6 inline-flex w-auto border border-muted">
              <TabsTrigger value="stats" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">Usage Intelligence</TabsTrigger>
              <TabsTrigger value="subscriptions" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">Subscription History</TabsTrigger>
              <TabsTrigger value="settings" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">System Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="rounded-[1.5rem] border-none shadow-sm">
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Total Tests</p>
                      <p className="text-2xl font-black">{tenant.stats.total_tests}</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                      <BookOpen className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-[1.5rem] border-none shadow-sm">
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Total Attempts</p>
                      <p className="text-2xl font-black">{tenant.stats.total_attempts}</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-[2rem] border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Usage Trends</CardTitle>
                  <CardDescription>Activity logs for students and teachers over the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center border-t border-muted/20 bg-muted/5">
                   <div className="flex flex-col items-center text-muted-foreground opacity-40">
                      <Activity className="h-12 w-12 mb-2" />
                      <p className="text-sm font-medium italic">Advanced analytics visualization coming in V2.1</p>
                   </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions" className="animate-in fade-in duration-500">
              <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden text-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 border-none">
                      <TableHead className="font-bold">Period</TableHead>
                      <TableHead className="font-bold">Plan</TableHead>
                      <TableHead className="font-bold">Amount</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="text-right font-bold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenant.subscriptions?.length > 0 ? tenant.subscriptions.map((sub: any) => (
                      <TableRow key={sub.id} className="border-none hover:bg-muted/20 transition-colors">
                        <TableCell>
                           <div className="font-medium">{new Date(sub.current_period_starts_at).toLocaleDateString()}</div>
                           <div className="text-[10px] text-muted-foreground font-mono uppercase">Started</div>
                        </TableCell>
                        <TableCell className="font-bold">{sub.plan?.name || "Standard"}</TableCell>
                        <TableCell className="font-mono text-primary font-bold">${sub.plan?.price_monthly || "49.00"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter bg-emerald-50 text-emerald-600 border-none px-2">{sub.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="rounded-lg h-8 w-8 p-0 text-muted-foreground">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                           No subscription history found for this institution.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="animate-in fade-in duration-500">
               <Card className="rounded-[2rem] border-none shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">System Events</h3>
                     <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-600 border-none">LIVE</Badge>
                  </div>
                  <div className="space-y-4 pt-2">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4 items-start pb-4 border-b border-muted/20 last:border-0 last:pb-0">
                           <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                           </div>
                           <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">Security Audit Performed</p>
                              <p className="text-xs text-muted-foreground italic leading-none">Success / IP 192.168.1.{i * 10}</p>
                           </div>
                           <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">2h ago</span>
                        </div>
                     ))}
                  </div>
               </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
