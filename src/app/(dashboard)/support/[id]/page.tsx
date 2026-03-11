"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Send, 
  User, 
  Building2, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Loader2
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [reply, setReply] = useState("");

  const { data: response, isLoading, error } = useQuery({
    queryKey: ["support-ticket", id],
    queryFn: () => apiClient.get(`super-admin/support-tickets/${id}`).then((res) => res.data),
  });

  const ticket = response?.data;

  const replyMutation = useMutation({
    mutationFn: (message: string) => apiClient.post(`super-admin/support-tickets/${id}/replies`, { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-ticket", id] });
      setReply("");
      alert("Reply sent successfully.");
    },
  });

  const resolveMutation = useMutation({
    mutationFn: () => apiClient.post(`super-admin/support-tickets/${id}/resolve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-ticket", id] });
      alert("Ticket marked as resolved.");
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-rose-500 opacity-20" />
        <h2 className="text-xl font-bold">Ticket Not Found</h2>
        <Button onClick={() => router.push("/support")} variant="outline">Back to Support</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="pl-0 text-muted-foreground hover:text-foreground mb-2"
            onClick={() => router.push("/support")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tickets
          </Button>
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-black tracking-tighter text-foreground">{ticket.subject}</h1>
             <Badge className="bg-primary/10 text-primary border-none font-bold px-3">#{ticket.id.slice(0, 8)}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
             <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {ticket.tenant?.name}</span>
             <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {ticket.user?.name}</span>
             <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Opened {formatDistanceToNow(new Date(ticket.created_at))} ago</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button 
            variant="outline" 
            className="rounded-xl border-emerald-100 text-emerald-600 hover:bg-emerald-50"
            onClick={() => resolveMutation.mutate()}
            disabled={ticket.status === 'resolved' || resolveMutation.isPending}
           >
              {resolveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              Mark Resolved
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Messages Thread */}
        <div className="lg:col-span-3 space-y-6">
           <div className="space-y-4">
              {ticket.messages?.map((msg: any, i: number) => (
                <div 
                  key={i} 
                  className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-[2rem] p-6 ${
                    msg.is_admin 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10' 
                      : 'bg-muted/40 text-foreground'
                  }`}>
                    <div className="flex items-center gap-2 mb-2 opacity-60 text-[10px] font-black uppercase tracking-widest">
                       {msg.is_admin ? <ShieldCheck className="h-3 w-3" /> : <User className="h-3 w-3" />}
                       {msg.is_admin ? 'Support Team' : ticket.user?.name}
                       <span>•</span>
                       {formatDistanceToNow(new Date(msg.created_at))} ago
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              ))}
           </div>

           {/* Reply Box */}
           <Card className="rounded-[2.5rem] border-none shadow-xl bg-card overflow-hidden">
             <CardContent className="p-0">
                <Textarea 
                  placeholder="Type your response to the tenant admin..." 
                  className="min-h-[160px] border-none bg-transparent p-8 focus-visible:ring-0 resize-none text-base font-medium"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <div className="px-8 pb-8 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                      <MessageSquare className="h-3 w-3" />
                      Markdown Supported
                   </div>
                   <Button 
                    className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20"
                    onClick={() => replyMutation.mutate(reply)}
                    disabled={!reply || replyMutation.isPending}
                   >
                      {replyMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Send Reply
                   </Button>
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <Card className="rounded-[2.5rem] border-none shadow-sm bg-muted/20 p-2">
              <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Priority</p>
                    <Badge className={`border-none font-bold uppercase tracking-tighter ${
                      ticket.priority === 'urgent' ? 'bg-rose-500 text-white' : 'bg-primary/20 text-primary'
                    }`}>
                      {ticket.priority}
                    </Badge>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Category</p>
                    <p className="text-sm font-bold text-foreground capitalize">{ticket.category || 'General'}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Tenant Tier</p>
                    <p className="text-sm font-bold text-foreground">Enterprise</p>
                 </div>
              </CardContent>
           </Card>

           <Card className="rounded-[2.5rem] border-none shadow-sm p-4">
              <CardHeader className="p-4">
                 <CardTitle className="text-base font-bold text-muted-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                 <Button variant="ghost" className="w-full justify-start rounded-xl font-bold text-sm text-muted-foreground hover:bg-muted/50">
                    Assign to Specialist
                 </Button>
                 <Button variant="ghost" className="w-full justify-start rounded-xl font-bold text-sm text-muted-foreground hover:bg-muted/50">
                    Internal Note
                 </Button>
                 <Button variant="ghost" className="w-full justify-start rounded-xl font-bold text-sm text-rose-600 hover:bg-rose-50">
                    Escalate to Dev
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
