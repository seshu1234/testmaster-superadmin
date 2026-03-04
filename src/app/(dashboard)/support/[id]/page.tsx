"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ChevronLeft, 
  Send, 
  User, 
  Shield, 
  Clock, 
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export default function TicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [reply, setReply] = useState("");

  const { data: response, isLoading, error } = useQuery({
    queryKey: ["support-ticket", id],
    queryFn: () => apiClient.get(`super-admin/support-tickets/${id}`).then((res) => res.data),
  });

  const ticket = response;

  const replyMutation = useMutation({
    mutationFn: (message: string) => apiClient.post(`super-admin/support-tickets/${id}/reply`, { message }),
    onSuccess: () => {
      setReply("");
      queryClient.invalidateQueries({ queryKey: ["support-ticket", id] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => apiClient.put(`super-admin/support-tickets/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-ticket", id] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <ActivityIndicator />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6">
         <AlertCircle className="h-12 w-12 text-destructive mb-4" />
         <h2 className="text-2xl font-bold">Ticket Not Found</h2>
         <p className="text-muted-foreground mt-2">This support session may have been archived or removed.</p>
         <Button asChild variant="outline" className="mt-6 rounded-xl">
           <Link href="/support">Back to Queue</Link>
         </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="pl-0 text-muted-foreground hover:text-primary transition-colors">
            <Link href="/support">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Queue
            </Link>
          </Button>
          <div className="flex items-center gap-4">
             <h1 className="text-3xl font-bold tracking-tight">{ticket.subject}</h1>
             <StatusBadge status={ticket.status} />
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-bold uppercase tracking-widest mt-2">
            <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {ticket.tenant?.name}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Opened {format(new Date(ticket.created_at), 'PPp')}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl px-5 border-2 text-emerald-600 hover:bg-emerald-50" onClick={() => statusMutation.mutate('resolved')}>
             <CheckCircle2 className="mr-2 h-4 w-4" /> Resolve Ticket
           </Button>
           <Button variant="secondary" size="icon" className="rounded-xl h-10 w-10">
             <MoreVertical className="h-4 w-4" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Discussion Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-8">
            {ticket.messages?.map((msg: any) => (
              <div key={msg.id} className={`flex gap-4 ${msg.user.role === 'super_admin' ? 'flex-row-reverse' : ''}`}>
                 <Avatar className="h-10 w-10 border shadow-sm shrink-0">
                    <AvatarFallback className={msg.user.role === 'super_admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}>
                      {msg.user.name.charAt(0)}
                    </AvatarFallback>
                 </Avatar>
                 <div className={`space-y-2 max-w-[85%] ${msg.user.role === 'super_admin' ? 'items-end flex flex-col' : ''}`}>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold">{msg.user.name}</span>
                       <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">{format(new Date(msg.created_at), 'hh:mm a')}</span>
                       {msg.user.role === 'super_admin' && <Badge className="rounded-full h-5 text-[9px] bg-primary/10 text-primary border-none">SYSTEM ADMIN</Badge>}
                    </div>
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.user.role === 'super_admin' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-card border shadow-sm rounded-tl-none'}`}>
                        {msg.message}
                    </div>
                 </div>
              </div>
            ))}
          </div>

          <Separator className="my-10" />

          {/* Reply Interface */}
          <div className="animate-in slide-in-from-bottom-2 duration-500">
             <Card className="rounded-[2rem] border-none shadow-xl bg-card overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Send className="h-4 w-4" /> Compose Response
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                   <Textarea 
                      placeholder="Enter admin response, technical guidance or resolution steps..."
                      className="min-h-[150px] border-none bg-muted/50 rounded-2xl focus-visible:ring-primary shadow-inner p-4 text-sm font-medium"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                   />
                   <div className="flex items-center justify-between gap-4">
                      <p className="text-[10px] text-muted-foreground italic font-medium">This response will be visible to the tenant administrator and all assigned teachers.</p>
                      <Button 
                        disabled={!reply.trim() || replyMutation.isPending} 
                        className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20"
                        onClick={() => replyMutation.mutate(reply)}
                      >
                         {replyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Dispatch Reply</>}
                      </Button>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-8 sticky top-24">
           <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden text-sm">
             <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Context Brief</CardTitle>
             </CardHeader>
             <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Reporting User</span>
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"><User className="h-4 w-4" /></div>
                         <div className="flex flex-col leading-none">
                            <span className="font-bold">{ticket.user?.name}</span>
                            <span className="text-xs text-muted-foreground font-medium">{ticket.user?.email}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Institution Scope</span>
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"><Building2 className="h-4 w-4" /></div>
                         <div className="flex flex-col leading-none">
                            <span className="font-bold">{ticket.tenant?.name}</span>
                            <span className="text-xs text-muted-foreground lowercase font-medium">{ticket.tenant?.slug}.testmaster.in</span>
                         </div>
                      </div>
                   </div>

                   <Separator className="bg-muted/50" />

                   <div className="flex flex-col gap-2">
                       <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Intelligence Metadata</span>
                       <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 rounded-2xl bg-muted/30 border border-muted/20">
                             <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Priority</div>
                             <div className="text-sm font-black capitalize text-foreground">{ticket.priority}</div>
                          </div>
                          <div className={`p-3 rounded-2xl border ${ticket.assigned_to ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'}`}>
                             <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Assignment</div>
                             <div className="text-sm font-black text-foreground">{ticket.assigned_to ? 'Dedicated' : 'Unassigned'}</div>
                          </div>
                       </div>
                   </div>
                </div>
             </CardContent>
           </Card>

           <div className="p-6 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/10">
              <div className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest mb-3">
                 <Shield className="h-4 w-4" /> Security Audit
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Internal system checks confirm this ticket originated from a verified administrator session. User permissions validated.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'open': return <Badge className="bg-blue-500/10 text-blue-600 border-none px-4 py-1 font-bold">Open</Badge>;
    case 'in_progress': return <Badge className="bg-amber-500/10 text-amber-600 border-none px-4 py-1 font-bold">In Progress</Badge>;
    case 'resolved': return <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1 font-bold">Resolved</Badge>;
    default: return <Badge variant="secondary" className="px-4 py-1 font-bold border-none uppercase text-[10px] tracking-widest">{status}</Badge>;
  }
}

function ActivityIndicator() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse font-medium">Initializing encrypted support stream...</p>
    </div>
  );
}
