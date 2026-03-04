"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { 
  User as UserIcon,
  Mail, 
  Calendar, 
  Shield, 
  ArrowLeft,
  Pencil,
  Trash2,
  Key,
  ShieldAlert,
  Activity,
  AlertCircle,
  Building,
  CheckCircle2,
  MoreVertical,
  History
} from "lucide-react";
import apiClient from "@/lib/api/client";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface UserDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  tenant_name: string;
  status: 'active' | 'inactive' | 'suspended';
  last_login_at: string | null;
  created_at: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = params.id as string;

  const { data: response, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => apiClient.get(`super-admin/users/${userId}`).then((res) => res.data),
  });

  const user = response?.data as UserDetails;

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete(`super-admin/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/users");
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Retrieving user profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-[70vh] items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold">User Not Found</h2>
          <p className="text-muted-foreground">The user record you are looking for might have been removed or the ID is incorrect.</p>
          <Button onClick={() => router.push("/users")} variant="outline" className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none px-3 py-1">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-none px-3 py-1">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-none px-3 py-1">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleName = role.replace('_', ' ');
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-none capitalize">{roleName}</Badge>;
      case 'admin':
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-none capitalize">{roleName}</Badge>;
      case 'teacher':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none capitalize">{roleName}</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{roleName}</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="pl-0 text-muted-foreground hover:text-primary transition-colors"
          >
            <Link href="/users">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            {getStatusBadge(user.status)}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {user.email}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Registered {format(new Date(user.created_at), 'PPP')}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="rounded-xl px-5 border-2">
            <Link href={`/users/${userId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit Profile
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="rounded-xl w-10 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem className="cursor-pointer">
                <Key className="mr-2 h-4 w-4" /> Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ShieldAlert className="mr-2 h-4 w-4" /> Transfer Ownership
              </DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (confirm("Are you sure you want to delete this user? This cannot be undone.")) {
                    deleteMutation.mutate();
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-card overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-primary/10 via-background to-background items-center pb-8 pt-10">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl mb-4 scale-110">
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-black">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription className="text-center px-4 mt-1 font-medium">
                {getRoleBadge(user.role)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm group cursor-default">
                  <div className="flex items-center gap-3 text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                    <Building className="h-4 w-4" />
                    <span>Institution</span>
                  </div>
                  <span className="font-bold text-foreground/80">{user.tenant_name || "Central Administration"}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm group cursor-default">
                  <div className="flex items-center gap-3 text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                    <Shield className="h-4 w-4" />
                    <span>Account Tier</span>
                  </div>
                  <span className="font-bold text-foreground/80 capitalize">{user.role === 'super_admin' ? 'Premium' : 'Standard'}</span>
                </div>

                <div className="flex items-center justify-between text-sm group cursor-default">
                  <div className="flex items-center gap-3 text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                    <Activity className="h-4 w-4" />
                    <span>Last Login</span>
                  </div>
                  <span className="font-bold text-foreground/80">
                    {user.last_login_at ? format(new Date(user.last_login_at), 'MMM d, HH:mm') : 'Never'}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-muted/20">
                  <div className="h-8 w-8 rounded-xl bg-background flex items-center justify-center shadow-sm">
                    <History className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Member For</span>
                    <span className="text-sm font-bold">142 Days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-muted/10 p-6 space-y-4">
             <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
               <AlertCircle className="h-3 w-3" />
               Critical Alerts
             </div>
             <div className="bg-destructive/5 rounded-2xl p-4 border border-destructive/10">
               <p className="text-xs text-destructive font-medium leading-relaxed">
                 This user has administrative access to the global marketplace and subdomains.
               </p>
             </div>
          </Card>
        </div>

        {/* Right Column: Content Tabs */}
        <div className="lg:col-span-2 space-y-8">
           <Tabs defaultValue="activity" className="w-full">
            <TabsList className="bg-muted/50 p-1.5 rounded-2xl mb-6 inline-flex w-auto border border-muted">
              <TabsTrigger value="activity" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">Activity Audit</TabsTrigger>
              <TabsTrigger value="permissions" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">Access Control</TabsTrigger>
              <TabsTrigger value="security" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">Security Matrix</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-1 animate-in fade-in duration-500">
               <Card className="rounded-[2rem] border-none shadow-sm p-8">
                  <div className="space-y-8">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex gap-6 items-start pb-8 border-b border-muted/20 last:border-0 last:pb-0 relative group">
                        {i < 4 && <div className="absolute left-[15px] top-[30px] bottom-[-20px] w-0.5 bg-muted group-hover:bg-primary/20 transition-colors" />}
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 z-10 outline outline-4 outline-background">
                           <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1 pt-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-foreground">Global Login Success</p>
                            <span className="text-[10px] font-mono text-muted-foreground font-bold">Today, 10:{20 + i} AM</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Authenticated successfully from Chrome v121.0.0 on macOS. IP: 192.168.1.{i * 12}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
               </Card>
            </TabsContent>

            <TabsContent value="permissions" className="animate-in fade-in duration-500">
               <Card className="rounded-[2rem] border-none shadow-sm p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="space-y-3">
                       <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                         <Building className="h-3 w-3" /> Tenant Access
                       </h4>
                       <div className="space-y-2">
                          {['Manage Users', 'View Financials', 'Configure Tests'].map((p) => (
                            <div key={p} className="flex items-center gap-2 text-sm font-medium">
                               <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                               {p}
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-3">
                       <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                         <Shield className="h-3 w-3" /> System Access
                       </h4>
                       <div className="space-y-2 text-muted-foreground opacity-60">
                          {['Modify Billing', 'Full System Reset', 'API Key Generation'].map((p) => (
                            <div key={p} className="flex items-center gap-2 text-sm font-medium">
                               <ShieldAlert className="h-3.5 w-3.5" />
                               {p}
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
               </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
