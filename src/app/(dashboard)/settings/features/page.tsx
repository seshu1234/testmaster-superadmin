"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Flag, 
  Zap, 
  Shield, 
  Cpu, 
  ChevronRight, 
  AlertCircle,
  Loader2,
  Settings2,
  RefreshCw,
  Search
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function FeatureFlagsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["feature-flags"],
    queryFn: () => apiClient.get("super-admin/settings/features").then((res) => res.data),
  });

  const flags = response?.data || [];

  const toggleMutation = useMutation({
    mutationFn: ({ key, enabled }: { key: string, enabled: boolean }) => 
      apiClient.post("super-admin/settings/features/toggle", { feature_key: key, is_enabled: enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
      alert("Feature state updated successfully.");
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Advanced Controls</h1>
          <p className="text-sm text-muted-foreground font-medium">Toggle platform features, experimental modules, and global scaling parameters.</p>
        </div>
        <Button variant="outline" className="rounded-xl border-none bg-card shadow-sm h-12" onClick={() => queryClient.invalidateQueries({ queryKey: ["feature-flags"] })}>
           <RefreshCw className="mr-2 h-4 w-4" /> Sync Registry
        </Button>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-sm bg-muted/20 p-4">
         <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search feature keys, tiers or dependencies..." 
              className="h-12 bg-background border-none rounded-2xl pl-12 shadow-inner focus-visible:ring-primary font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {isLoading ? (
           Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="h-40 w-full bg-muted/30 animate-pulse rounded-[2rem]" />
           ))
         ) : flags.length > 0 ? (
           flags.filter((f: any) => f.key.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase())).map((flag: any) => (
             <Card key={flag.id} className="rounded-[2.5rem] border-none shadow-sm bg-card hover:shadow-md transition-all duration-300 group">
                <CardContent className="p-8">
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                         <div className={`p-4 rounded-[1.5rem] ${flag.is_enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground/40'}`}>
                            <Flag className="h-6 w-6" />
                         </div>
                         <div className="space-y-1">
                            <h3 className="text-lg font-bold tracking-tight">{flag.title || flag.key}</h3>
                            <p className="text-xs font-medium text-muted-foreground leading-relaxed italic">{flag.description}</p>
                         </div>
                      </div>
                      <Switch 
                        checked={flag.is_enabled} 
                        onCheckedChange={(checked) => toggleMutation.mutate({ key: flag.key, enabled: checked })}
                        className="data-[state=checked]:bg-primary"
                        disabled={toggleMutation.isPending}
                      />
                   </div>
                   <div className="mt-8 flex items-center gap-3">
                      <Badge variant="secondary" className="rounded-lg text-[9px] font-black uppercase tracking-[0.1em] px-2 bg-muted/50 border-none">
                         Release Type: {flag.group || 'Public'}
                      </Badge>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest pl-2 border-l border-muted/50">
                        <Settings2 className="h-3 w-3" />
                        ID: {flag.key}
                      </div>
                   </div>
                </CardContent>
             </Card>
           ))
         ) : (
           <div className="col-span-full h-80 flex flex-col items-center justify-center space-y-4 bg-muted/10 rounded-[3rem] border-2 border-dashed border-muted/50">
              <AlertCircle className="h-10 w-10 text-muted-foreground/20" />
              <p className="text-sm font-bold text-muted-foreground/40 uppercase tracking-widest">No matching features found</p>
           </div>
         )}
      </div>

      {/* Global Safety Switch */}
      <Card className="rounded-[3rem] border-none shadow-2xl bg-gradient-to-br from-rose-500 to-rose-600 p-1 overflow-hidden">
         <div className="p-8 md:p-12 text-white bg-black/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-rose-200 font-black text-xs uppercase tracking-widest leading-none">
                  <Shield className="h-4 w-4" /> Safety Protocol
               </div>
               <h2 className="text-3xl font-black tracking-tighter">Global Maintenance Override</h2>
               <p className="max-w-md text-rose-100/70 text-sm font-medium leading-relaxed">
                  Activating this will instantly place the entire platform into a read-only state. Only super administrators will have write access to core databases.
               </p>
            </div>
            <Button variant="outline" className="h-16 px-8 rounded-2xl bg-white text-rose-600 border-none font-black text-lg hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-rose-900/40">
               Activate Lockout
            </Button>
         </div>
      </Card>
    </div>
  );
}
