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
  ChevronUp
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";

export default function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", body: "", type: "info" });

  const { data: response, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => apiClient.get("super-admin/announcements").then((res) => res.data),
  });

  const announcements = response?.data || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post("super-admin/announcements", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setIsCreateOpen(false);
      setNewAnnouncement({ title: "", body: "", type: "info" });
      alert("Announcement Broadcasted: Your message has been sent to all active tenants.");
    },
  });

  const clearCurrentMutation = useMutation({
    mutationFn: () => apiClient.post("super-admin/announcements/clear"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      alert("Broadcast Cleared: The active announcement has been removed from all dashboards.");
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Global Broadcasts</h1>
          <p className="text-sm text-muted-foreground font-medium">Communicate critical updates and maintenance schedules to all institutions.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
            variant="outline" 
            className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50"
            onClick={() => clearCurrentMutation.mutate()}
            disabled={clearCurrentMutation.isPending}
           >
              {clearCurrentMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
              Clear Active
           </Button>
           <Button 
            className="rounded-xl shadow-lg shadow-primary/20"
            onClick={() => setIsCreateOpen(!isCreateOpen)}
           >
              {isCreateOpen ? <ChevronUp className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {isCreateOpen ? "Close Form" : "New Announcement"}
           </Button>
        </div>
      </div>

      {isCreateOpen && (
        <Card className="rounded-[2rem] border-none shadow-xl animate-in slide-in-from-top-4 duration-500 bg-card p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create Broadcast</CardTitle>
            <CardDescription>
              This message will be visible to all administrators and users across all tenants.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Subject</label>
              <Input 
                placeholder="e.g., Scheduled Maintenance" 
                className="rounded-xl border-none bg-muted/50 h-12 px-4 focus-visible:ring-primary"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Message Body</label>
              <Textarea 
                placeholder="Detail the update or instructions..." 
                className="rounded-xl border-none bg-muted/50 min-h-[120px] p-4 focus-visible:ring-primary"
                value={newAnnouncement.body}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, body: e.target.value})}
              />
            </div>
            <div className="pt-4">
              <Button 
                className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/10"
                onClick={() => createMutation.mutate(newAnnouncement)}
                disabled={createMutation.isPending || !newAnnouncement.title || !newAnnouncement.body}
              >
                {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Broadcast Globally
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="h-4 w-4 text-primary animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Recent Transmissions</h2>
          </div>

          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 w-full bg-muted/30 animate-pulse rounded-[2rem]" />
            ))
          ) : announcements.length > 0 ? (
            announcements.map((ann: any) => (
              <Card key={ann.id} className="rounded-[2rem] border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                <CardContent className="p-8">
                   <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest">Global</Badge>
                           <span className="text-[10px] font-bold text-muted-foreground/40">{formatDistanceToNow(new Date(ann.created_at))} ago</span>
                        </div>
                        <h3 className="text-xl font-bold">{ann.title}</h3>
                        <p className="text-muted-foreground leading-relaxed italic">{ann.content}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 transition-all">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                   </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 bg-muted/10 rounded-[2rem] border-2 border-dashed border-muted/50">
               <Megaphone className="h-10 w-10 text-muted-foreground/30" />
               <p className="text-sm font-bold text-muted-foreground">No recent global broadcasts found.</p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <Card className="rounded-[2.5rem] border-none shadow-sm bg-primary/5 p-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                   <AlertCircle className="h-5 w-5 text-primary" />
                   Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm font-medium text-muted-foreground/80">
                 <p>• Use global broadcasts only for critical system-wide updates.</p>
                 <p>• Include clear timeframes for maintenance windows.</p>
                 <p>• Announcements are translated where supported.</p>
              </CardContent>
           </Card>

           <Card className="rounded-[2.5rem] border-none shadow-sm p-2">
              <CardHeader>
                <CardTitle className="text-lg">Broadcast Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-muted/40 rounded-3xl">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">Total sent</span>
                    <span className="text-xl font-black">{announcements.length}</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-muted/40 rounded-3xl">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">Active now</span>
                    <span className="text-xl font-black">1</span>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
