"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Bell, 
  Megaphone, 
  Plus, 
  Trash2, 
  Send, 
  Clock, 
  AlertCircle,
  XCircle,
  Radio,
  Loader2,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  CheckCircle2,
  Mail
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow } from "date-fns";

export default function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ 
    title: "", 
    body: "", 
    type: "info",
    send_email: false 
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["current-announcement"],
    queryFn: () => apiClient.get("super-admin/announcements/current").then((res) => res.data),
  });

  const activeAnnouncement = response?.data || null;

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post("super-admin/announcements", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-announcement"] });
      setIsCreateOpen(false);
      setNewAnnouncement({ title: "", body: "", type: "info", send_email: false });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => apiClient.delete("super-admin/announcements"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-announcement"] });
    },
  });

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'maintenance': return 'bg-rose-500/10 text-rose-600 border-rose-200';
      default: return 'bg-blue-500/10 text-blue-600 border-blue-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase tracking-widest">Global Broadcasts</h1>
          <p className="text-sm text-muted-foreground font-medium">Platform-wide communication for maintenance and updates.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
            variant="outline" 
            className="rounded-2xl border-none shadow-sm bg-card hover:bg-muted font-bold h-11"
            onClick={() => setIsCreateOpen(!isCreateOpen)}
           >
              {isCreateOpen ? <ChevronUp className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {isCreateOpen ? "Discard Draft" : "New Broadcast"}
           </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
             <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600">
                   <Radio className={`h-5 w-5 ${activeAnnouncement ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Broadcast Status</p>
                   <p className="text-xl font-black">{activeAnnouncement ? 'Transmitting' : 'Silent'}</p>
                </div>
             </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
             <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
                   <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Platform Reach</p>
                   <p className="text-xl font-black">All Tenants</p>
                </div>
             </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-none shadow-sm bg-card overflow-hidden">
             <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
                   <Clock className="h-5 w-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Persistence</p>
                   <p className="text-xl font-black">30 Days</p>
                </div>
             </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          {/* Active Broadcast View */}
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Active Transmission</h2>
             </div>

             {isLoading ? (
               <div className="h-48 w-full bg-muted/30 animate-pulse rounded-[2.5rem]" />
             ) : activeAnnouncement ? (
               <Card className="rounded-[2.5rem] border-none shadow-lg overflow-hidden bg-card animate-in zoom-in-95 duration-500">
                  <CardHeader className="p-10 pb-6">
                    <div className="flex items-start justify-between">
                       <div className="space-y-2">
                         <div className="flex items-center gap-2">
                            <Badge className={`border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${getTypeStyles(activeAnnouncement.type)}`}>
                              {activeAnnouncement.type}
                            </Badge>
                            <span className="text-[10px] font-bold text-muted-foreground/50">
                               {formatDistanceToNow(new Date(activeAnnouncement.created_at))} ago
                            </span>
                         </div>
                         <CardTitle className="text-3xl font-black tracking-tight">{activeAnnouncement.title}</CardTitle>
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-10 pb-10">
                    <p className="text-lg font-medium text-muted-foreground/80 leading-relaxed mb-10">
                      {activeAnnouncement.body}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-muted/50">
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                          <CheckCircle2 className="h-4 w-4" />
                          Live on all dashboards
                       </div>
                       <Button 
                        variant="ghost" 
                        className="rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold"
                        onClick={() => clearMutation.mutate()}
                        disabled={clearMutation.isPending}
                       >
                         {clearMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                         Kill Broadcast
                       </Button>
                    </div>
                  </CardContent>
               </Card>
             ) : (
               <div className="flex flex-col items-center justify-center p-20 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border-4 border-dashed border-muted/50">
                  <div className="p-6 bg-muted/40 rounded-full">
                     <Radio className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-muted-foreground">The Airwaves are Silent</p>
                    <p className="text-sm text-muted-foreground/60 mt-1 max-w-[280px]">No active global announcements are currently being served to tenants.</p>
                  </div>
                  <Button 
                    className="rounded-xl px-8 font-bold"
                    onClick={() => setIsCreateOpen(true)}
                  >
                    Broadcast Now
                  </Button>
               </div>
             )}
          </div>
        </div>

        {/* Create Side Sheet style */}
        <div className="lg:col-span-2">
           <div className={`transition-all duration-700 ${isCreateOpen ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
              <Card className="rounded-[2.5rem] border-none shadow-xl bg-card p-4 overflow-hidden sticky top-8">
                <CardHeader className="p-8">
                  <CardTitle className="text-xl font-bold">New Global Broadcast</CardTitle>
                  <CardDescription>Targeting all active institutions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-8 pt-0">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Urgency Tier</Label>
                    <Select 
                      value={newAnnouncement.type} 
                      onValueChange={(v) => setNewAnnouncement({...newAnnouncement, type: v})}
                    >
                      <SelectTrigger className="rounded-2xl border-none bg-muted/50 h-12 px-4 shadow-inner">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="info" className="rounded-xl font-bold text-blue-600">Information</SelectItem>
                        <SelectItem value="warning" className="rounded-xl font-bold text-amber-600">Warning</SelectItem>
                        <SelectItem value="maintenance" className="rounded-xl font-bold text-rose-600">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Subject Line</Label>
                    <Input 
                      placeholder="e.g., V2.1 Rollout commencing..." 
                      className="rounded-2xl border-none bg-muted/50 h-12 px-4 shadow-inner focus-visible:ring-primary font-bold"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Detailed Message</Label>
                    <Textarea 
                      placeholder="Message content..." 
                      className="rounded-2xl border-none bg-muted/50 min-h-[160px] p-4 shadow-inner focus-visible:ring-primary font-medium scrollbar-hide"
                      value={newAnnouncement.body}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, body: e.target.value})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-muted-foreground/5">
                     <div className="space-y-0.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest">Email Notification</Label>
                        <p className="text-[10px] text-muted-foreground font-medium italic">Push to all tenant owners</p>
                     </div>
                     <Switch 
                        checked={newAnnouncement.send_email}
                        onCheckedChange={(c) => setNewAnnouncement({...newAnnouncement, send_email: c})}
                     />
                  </div>

                  <div className="pt-6">
                    <Button 
                      className="w-full rounded-2xl h-14 text-base font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      onClick={() => createMutation.mutate(newAnnouncement)}
                      disabled={createMutation.isPending || !newAnnouncement.title || !newAnnouncement.body}
                    >
                      {createMutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                      Fire Broadcast
                    </Button>
                    {!isCreateOpen && (
                      <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-4">Form Inactive</p>
                    )}
                  </div>
                </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
}
