"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  User, 
  Globe, 
  Lock, 
  Eye, 
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");

  const { data: logsResponse, isLoading } = useQuery({
    queryKey: ["audit-logs", search, eventFilter],
    queryFn: () => apiClient.get("super-admin/audit-logs", { 
      params: { search, event: eventFilter } 
    }).then((res) => res.data),
  });

  const logs = logsResponse?.data || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground text-glow-primary">Administrative Audit</h1>
          <p className="text-sm text-muted-foreground font-medium">Full accountability trail for all platform-level operations.</p>
        </div>
        <Button variant="outline" className="rounded-xl font-bold bg-white shadow-sm border-primary/10">
          <Download className="mr-2 h-4 w-4" /> Export Ledger
        </Button>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-8 pt-10 px-10">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by admin name or event..." 
                  className="pl-12 rounded-2xl border-none bg-white h-12 text-sm font-medium focus-visible:ring-primary/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                 <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-[200px] rounded-2xl border-none bg-white h-12 font-bold text-xs uppercase tracking-widest text-muted-foreground">
                       <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-xl">
                       <SelectItem value="all">All Events</SelectItem>
                       <SelectItem value="impersonation">Impersonation</SelectItem>
                       <SelectItem value="security">Security Policy</SelectItem>
                       <SelectItem value="billing">Plan Changes</SelectItem>
                       <SelectItem value="tenant">Tenant Status</SelectItem>
                    </SelectContent>
                 </Select>
                 <Button variant="ghost" className="rounded-2xl h-12 px-6 font-bold text-muted-foreground hover:bg-white transition-all">
                    <Filter className="mr-2 h-4 w-4" /> Reset
                 </Button>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10 border-none hover:bg-muted/10">
                <TableHead className="px-10 h-14 font-black text-[10px] uppercase tracking-widest">Administrator</TableHead>
                <TableHead className="px-6 h-14 font-black text-[10px] uppercase tracking-widest">Operation</TableHead>
                <TableHead className="px-6 h-14 font-black text-[10px] uppercase tracking-widest">Context</TableHead>
                <TableHead className="px-6 h-14 font-black text-[10px] uppercase tracking-widest">Timeline</TableHead>
                <TableHead className="px-10 h-14 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                     <TableCell colSpan={5} className="h-16 bg-muted/5"></TableCell>
                  </TableRow>
                ))
              ) : logs.length > 0 ? logs.map((log: any) => (
                <TableRow key={log.id} className="group border-none hover:bg-muted/10 transition-colors">
                  <TableCell className="px-10 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                        {log.admin?.name?.charAt(0) || "S"}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-black text-foreground">{log.admin?.name || "System"}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{log.ip_address || "Internal IP"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className={`h-2 w-2 rounded-full ${log.severity === 'high' ? 'bg-rose-500' : 'bg-primary'}`} />
                       <span className="text-sm font-bold text-foreground capitalize">{log.action || "System Event"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-sm font-medium text-muted-foreground/70 italic">
                    {log.description || "Administrative override performed."}
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <div className="flex flex-col gap-0.5">
                       <span className="text-xs font-black text-foreground">{formatDistanceToNow(new Date(log.created_at))} ago</span>
                       <span className="text-[9px] text-muted-foreground uppercase font-medium">{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-5 text-right">
                    <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                       <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-96 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 opacity-20">
                      <Lock className="h-16 w-16" />
                      <p className="text-lg font-black tracking-tight mt-4">Safe & Encrypted Ledger</p>
                      <p className="text-xs font-bold uppercase tracking-widest">No matching activities found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="rounded-[2rem] border-none shadow-sm bg-indigo-500/5 p-8 relative overflow-hidden">
            <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">Security Baseline</h3>
            <p className="text-2xl font-black text-foreground">Tier 1 Compliance</p>
            <p className="text-xs text-muted-foreground font-medium mt-2">All administrative actions are cryptographically signed.</p>
            <ShieldCheck className="absolute -right-4 -bottom-4 h-24 w-24 text-indigo-500/10" />
         </Card>
         <Card className="rounded-[2rem] border-none shadow-sm bg-rose-500/5 p-8 relative overflow-hidden">
            <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest mb-4">Integrity Monitoring</h3>
            <p className="text-2xl font-black text-foreground">Real-time Sentry</p>
            <p className="text-xs text-muted-foreground font-medium mt-2">Any unauthorized mutation triggers immediate lockout.</p>
            <AlertCircle className="absolute -right-4 -bottom-4 h-24 w-24 text-rose-500/10" />
         </Card>
         <Card className="rounded-[2rem] border-none shadow-sm bg-emerald-500/5 p-8 relative overflow-hidden">
            <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4">Storage Lifecycle</h3>
            <p className="text-2xl font-black text-foreground">7 Year Retention</p>
            <p className="text-xs text-muted-foreground font-medium mt-2">Logs are immutable and replicated across 3 regions.</p>
            <Calendar className="absolute -right-4 -bottom-4 h-24 w-24 text-emerald-500/10" />
         </Card>
      </div>
    </div>
  );
}
