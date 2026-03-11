"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Filter, 
  Download, 
  User, 
  Building2, 
  Clock, 
  Shield, 
  Eye, 
  X,
  History,
  Activity,
  AlertTriangle,
  ArrowRight,
  Database,
  Globe,
  MoreVertical
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  tenant_id: string;
  tenant_name: string;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values: Record<string, any>;
  new_values: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");
  const [tenant, setTenant] = useState("all");
  const [user, setUser] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data: logsResponse, isLoading } = useQuery({
    queryKey: ["audit-logs", search, action, tenant, user, fromDate, toDate],
    queryFn: () =>
      apiClient
        .get("super-admin/audit-logs", {
          params: {
            search,
            action: action !== 'all' ? action : undefined,
            tenant_id: tenant !== 'all' ? tenant : undefined,
            user_id: user !== 'all' ? user : undefined,
            from_date: fromDate,
            to_date: toDate,
          },
        })
        .then((res) => res.data),
  });
  
  const logs = logsResponse?.data || [];
  const meta = logsResponse?.meta;

  const { data: tenantsResponse } = useQuery({
    queryKey: ["tenants-list"],
    queryFn: () => apiClient.get("super-admin/tenants?limit=100").then((res) => res.data),
  });
  const tenants = tenantsResponse?.data || [];

  const { data: usersResponse } = useQuery({
    queryKey: ["users-list"],
    queryFn: () => apiClient.get("super-admin/users?limit=100").then((res) => res.data),
  });
  const users = usersResponse?.data || [];

  const { data: actionsResponse } = useQuery({
    queryKey: ["audit-actions"],
    queryFn: () => apiClient.get("super-admin/audit-logs/actions").then((res) => res.data),
  });
  const actions = actionsResponse?.data || [];

  const getActionStyles = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('created') || act.includes('success')) return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
    if (act.includes('updated')) return 'bg-indigo-500/10 text-indigo-600 border-indigo-200';
    if (act.includes('deleted') || act.includes('failed')) return 'bg-rose-500/10 text-rose-600 border-rose-200';
    if (act.includes('login')) return 'bg-amber-500/10 text-amber-600 border-amber-200';
    return 'bg-blue-500/10 text-blue-600 border-blue-200';
  };

  const exportLogs = () => {
    const params = new URLSearchParams({
      ...(search && { search }),
      ...(action !== 'all' && { action }),
      ...(tenant !== 'all' && { tenant_id: tenant }),
      ...(user !== 'all' && { user_id: user }),
      ...(fromDate && { from_date: fromDate }),
      ...(toDate && { to_date: toDate }),
    });
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/super-admin/audit-logs/export?${params}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase tracking-widest">Platform Telemetry</h1>
          <p className="text-sm text-muted-foreground font-medium">Immutable audit trail of cross-tenant administrative actions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            asChild
            className="rounded-2xl border-none shadow-sm bg-card hover:bg-muted font-bold h-11"
          >
            <Link href="/audit-logs/security">
               <Shield className="mr-2 h-4 w-4" /> Security Events
            </Link>
          </Button>
          <Button
            onClick={exportLogs}
            className="rounded-2xl shadow-lg shadow-primary/20 font-bold h-11"
          >
            <Download className="mr-2 h-4 w-4" /> Export Ledger
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatMiniCard title="Total Events" value={meta?.total || "0"} icon={Activity} color="text-indigo-500" />
          <StatMiniCard title="Unique Actors" value={users.length} icon={User} color="text-amber-500" />
          <StatMiniCard title="Active Tenants" value={tenants.length} icon={Building2} color="text-emerald-500" />
          <StatMiniCard title="Retention" value="30 Days" icon={History} color="text-blue-500" />
      </div>

      {/* Filters */}
      <Card className="rounded-[2.5rem] border-none shadow-sm bg-muted/20 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="relative col-span-1 sm:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Filter by subject or component..."
              className="h-12 bg-card border-none rounded-2xl pl-12 shadow-inner focus-visible:ring-primary font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="h-12 bg-card border-none rounded-2xl px-4 shadow-inner font-bold">
               <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="all">Total Scope</SelectItem>
              {actions.map((act: string) => (
                <option key={act} value={act}>{act}</option>
              ))}
              {/* Fallback for select items if map fails */}
              <SelectItem value="create">Created</SelectItem>
              <SelectItem value="update">Updated</SelectItem>
              <SelectItem value="delete">Deleted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tenant} onValueChange={setTenant}>
            <SelectTrigger className="h-12 bg-card border-none rounded-2xl px-4 shadow-inner font-bold text-xs">
               <SelectValue placeholder="All Tenants" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="all">Global Reach</SelectItem>
              {tenants.map((t: any) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 col-span-1 lg:col-span-2">
            <Input
              type="date"
              className="h-12 bg-card border-none rounded-2xl px-4 shadow-inner text-xs font-bold"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <Input
              type="date"
              className="h-12 bg-card border-none rounded-2xl px-4 shadow-inner text-xs font-bold"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-40 gap-4 opacity-40">
           <Loader2 className="h-10 w-10 animate-spin text-primary" />
           <p className="text-xs font-black uppercase tracking-widest">Decrypting audit logs...</p>
        </div>
      ) : (
        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-muted/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 w-48">Timestamp</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Actor</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Tenant</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Action</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Resource</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/30">
                {logs.map((log: AuditLog) => (
                  <tr key={log.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-xl bg-muted group-hover:bg-background transition-colors">
                            <Clock className="h-4 w-4 text-muted-foreground/60" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-foreground leading-none">{formatDate(log.created_at)}</p>
                            <p className="text-[10px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-tighter">
                               {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                         </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                           {log.user_name?.[0] || 'S'}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-foreground leading-none">{log.user_name}</p>
                           <p className="text-[10px] font-medium text-muted-foreground/60 mt-1">{log.user_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                       <p className="text-sm font-bold text-muted-foreground/80 flex items-center gap-1.5">
                          <Building2 className="h-3 w-3 opacity-40" />
                          {log.tenant_name}
                       </p>
                    </td>
                    <td className="p-6">
                      <Badge className={`border-none text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${getActionStyles(log.action)}`}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-6">
                      <p className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1">
                         <Database className="h-3 w-3 text-muted-foreground/40" />
                         {log.resource_type?.split('\\').pop()}
                      </p>
                      <p className="text-[9px] font-mono text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity">
                         UUID: {log.resource_id?.slice(0, 13)}...
                      </p>
                    </td>
                    <td className="p-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="rounded-xl font-bold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 h-9 px-4"
                      >
                        <Eye className="mr-2 h-4 w-4" /> Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                       <div className="flex flex-col items-center justify-center opacity-30 gap-3 grayscale">
                          <History className="h-12 w-12" />
                          <p className="text-sm font-black uppercase tracking-widest">Digital archives are empty</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Details Side-Dialog style */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-3xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-card">
          <DialogHeader className="p-10 pb-6 bg-muted/30">
            <div className="flex items-center justify-between mb-2">
               <Badge className={`border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${selectedLog ? getActionStyles(selectedLog.action) : ''}`}>
                 {selectedLog?.action} Event
               </Badge>
               <span className="text-[10px] font-black text-muted-foreground/40 opacity-60">ID: {selectedLog?.id}</span>
            </div>
            <DialogTitle className="text-3xl font-black tracking-tighter">Event Investigation</DialogTitle>
            <DialogDescription className="font-bold text-muted-foreground">
               {selectedLog?.user_name} performed {selectedLog?.action} on {selectedLog?.resource_type?.split('\\').pop()} resource.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                     <Clock className="h-3 w-3" /> Event Horizon
                  </h4>
                  <div className="p-5 rounded-3xl bg-muted/40 font-bold text-sm">
                     {selectedLog && formatDate(selectedLog.created_at)} at {selectedLog && new Date(selectedLog.created_at).toLocaleTimeString()}
                  </div>
               </div>
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                     <Globe className="h-3 w-3" /> Origin Point
                  </h4>
                  <div className="p-5 rounded-3xl bg-muted/40 font-mono text-xs">
                     {selectedLog?.ip_address}
                  </div>
               </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                 <History className="h-3 w-3" /> Delta Changes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-4">Initial State</p>
                  <pre className="text-[11px] bg-rose-500/[0.03] text-rose-700/80 p-6 rounded-[2rem] font-mono leading-relaxed border border-rose-500/10">
                    {selectedLog && JSON.stringify(selectedLog.old_values, null, 2)}
                    {selectedLog && Object.keys(selectedLog.old_values).length === 0 && "// No previous data"}
                  </pre>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-4">Final State</p>
                  <pre className="text-[11px] bg-emerald-500/[0.03] text-emerald-700/80 p-6 rounded-[2rem] font-mono leading-relaxed border border-emerald-500/10">
                    {selectedLog && JSON.stringify(selectedLog.new_values, null, 2)}
                    {selectedLog && Object.keys(selectedLog.new_values).length === 0 && "// Resource removal"}
                  </pre>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Device Signature</h4>
              <div className="p-6 rounded-[2rem] bg-muted/20 border border-muted-foreground/5 text-[11px] font-bold text-muted-foreground font-mono italic">
                 {selectedLog?.user_agent}
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-muted/30 flex justify-end gap-3 border-t">
            <Button
              onClick={() => setSelectedLog(null)}
              className="rounded-2xl px-8 font-black uppercase tracking-widest h-12 shadow-md shadow-primary/10"
            >
              Conclude Investigation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatMiniCard({ title, value, icon: Icon, color }: any) {
    return (
        <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
             <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-muted/60 ${color}`}>
                   <Icon className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 leading-none mb-1">{title}</p>
                   <p className="text-xl font-black tracking-tight">{value}</p>
                </div>
             </CardContent>
        </Card>
    );
}


function Loader2({ className }: { className?: string }) {
    return <Activity className={`${className} animate-pulse`} />;
}
