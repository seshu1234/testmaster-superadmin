"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Database, 
  CloudUpload, 
  Download, 
  History, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  HardDrive,
  ShieldAlert,
  Loader2
} from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export default function BackupSettingsPage() {
  const queryClient = useQueryClient();
  const [isBackingUp, setIsBackingUp] = useState(false);

  const { data: backupsResponse, isLoading } = useQuery({
    queryKey: ["settings", "backups"],
    queryFn: () => apiClient.get("super-admin/settings/backups").then((res) => res.data),
  });

  const backups = backupsResponse?.data || [];

  const backupMutation = useMutation({
    mutationFn: () => apiClient.post("super-admin/settings/backups"),
    onMutate: () => setIsBackingUp(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "backups"] });
      setIsBackingUp(false);
    },
    onError: () => setIsBackingUp(false),
  });

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl bg-white shadow-sm">
            <Link href="/settings">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground">Snapshot & Retention</h1>
            <p className="text-sm text-muted-foreground font-medium italic">Immutable platform archives and disaster recovery protocols.</p>
          </div>
        </div>
        <Button 
          onClick={() => backupMutation.mutate()} 
          disabled={isBackingUp}
          className="h-14 px-8 rounded-2xl font-black italic shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all flex items-center gap-2"
        >
          {isBackingUp ? <Loader2 className="h-5 w-5 animate-spin" /> : <CloudUpload className="h-5 w-5" />}
          Execute Manual Snapshot
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[3rem] border-none shadow-sm overflow-hidden bg-card">
               <CardHeader className="bg-muted/30 p-8 pt-10 px-10">
                  <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-2">
                     <History className="h-4 w-4" />
                     <span>Archives</span>
                  </div>
                  <CardTitle className="text-2xl font-black">Archive Ledger</CardTitle>
                  <CardDescription>Recent encrypted snapshots prioritized by recency.</CardDescription>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-muted/30">
                     {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                           <div key={i} className="p-8 h-24 animate-pulse bg-muted/5" />
                        ))
                     ) : backups.length > 0 ? backups.map((backup: any) => (
                        <div key={backup.id} className="p-8 flex items-center justify-between hover:bg-muted/10 transition-colors group">
                           <div className="flex items-center gap-6">
                              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shadow-inner">
                                 <Database className="h-7 w-7" />
                              </div>
                              <div className="space-y-1">
                                 <p className="text-lg font-black text-foreground">SNAPSHOT_{backup.id?.substring(0, 6).toUpperCase()}</p>
                                 <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 italic">
                                    <span>{backup.size || "1.2 GB"}</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(backup.created_at))} ago</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                 <CheckCircle2 className="h-3 w-3" /> Fully Replicated
                              </div>
                              <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-all bg-white shadow-sm border border-muted">
                                 <Download className="h-4 w-4" />
                              </Button>
                           </div>
                        </div>
                     )) : (
                        <div className="py-20 text-center space-y-4">
                           <ShieldAlert className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                           <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No archives found. System is in fresh state.</p>
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-8">
            <Card className="rounded-[2.5rem] border-none shadow-sm p-8 bg-black text-white relative overflow-hidden">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-2 text-primary-foreground/60 font-black uppercase tracking-widest text-[10px]">
                     <HardDrive className="h-4 w-4" />
                     <span>Vault Metrics</span>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between items-end">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/50">Storage Capacity</p>
                        <p className="text-sm font-black italic">42.8 GB / 100 GB</p>
                     </div>
                     <Progress value={42.8} className="h-1.5 bg-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                        <p className="text-[10px] font-black uppercase text-white/40 mb-1">Retention</p>
                        <p className="text-lg font-black italic">90 Days</p>
                     </div>
                     <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                        <p className="text-[10px] font-black uppercase text-white/40 mb-1">Frequency</p>
                        <p className="text-lg font-black italic">Daily</p>
                     </div>
                  </div>
               </div>
               <div className="absolute -right-10 -bottom-10 h-64 w-64 bg-primary/20 blur-[100px] rounded-full" />
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-sm p-8 bg-muted/20">
               <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-6 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Next Transmission
               </h3>
               <div className="space-y-4">
                  <div className="p-5 rounded-3xl bg-white shadow-sm border border-primary/5">
                     <p className="text-[10px] font-black uppercase text-primary mb-1">Scheduled Event</p>
                     <p className="text-sm font-bold italic text-foreground tracking-tight">Full Global Rebalancing</p>
                     <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-black italic opacity-40">T-minus 04h 22m</span>
                        <Badge className="rounded-lg font-black uppercase text-[8px] tracking-widest">Routine</Badge>
                     </div>
                  </div>
                  <Button variant="outline" className="w-full rounded-2xl h-14 font-black italic border-2 uppercase tracking-widest text-[10px] hover:bg-white transition-all">
                     <Settings className="mr-2 h-3 w-3" /> Adjust Policy
                  </Button>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
