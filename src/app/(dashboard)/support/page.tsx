"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Ticket, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  MessageSquare,
  ChevronRight,
  User,
  Building2
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function SupportPage() {
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");

  const { data: response, isLoading } = useQuery({
    queryKey: ["support-tickets", status, priority],
    queryFn: () => {
      const params = new URLSearchParams();
      if (status !== "all") params.append("status", status);
      if (priority !== "all") params.append("priority", priority);
      return apiClient.get(`super-admin/support-tickets?${params.toString()}`).then((res) => res.data);
    },
  });

  const tickets = response?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge className="bg-blue-500/10 text-blue-600 border-none">Open</Badge>;
      case 'in_progress': return <Badge className="bg-amber-500/10 text-amber-600 border-none">In Progress</Badge>;
      case 'resolved': return <Badge className="bg-emerald-500/10 text-emerald-600 border-none">Resolved</Badge>;
      case 'closed': return <Badge variant="secondary" className="opacity-60">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low': return <Badge variant="outline" className="text-slate-500 border-slate-200">Low</Badge>;
      case 'medium': return <Badge variant="outline" className="text-amber-500 border-amber-200">Medium</Badge>;
      case 'high': return <Badge variant="outline" className="text-orange-500 border-orange-200">High</Badge>;
      case 'urgent': return <Badge variant="destructive" className="bg-rose-500 text-white border-none animate-pulse">Urgent</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Command Center Support</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage cross-tenant inquiries and technical escalations.</p>
        </div>
      </div>

      <Card className="rounded-[2rem] border-none shadow-sm bg-muted/20 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ticket ID or subject..." 
              className="h-12 bg-background border-none rounded-2xl pl-12 shadow-inner focus-visible:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <Select onValueChange={setStatus} defaultValue="all">
              <SelectTrigger className="w-[160px] h-12 bg-background border-none rounded-2xl shadow-inner px-4">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setPriority} defaultValue="all">
              <SelectTrigger className="w-[160px] h-12 bg-background border-none rounded-2xl shadow-inner px-4">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-xl">
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
             <div key={i} className="h-24 w-full bg-muted/40 animate-pulse rounded-[1.5rem]" />
          ))
        ) : tickets.length > 0 ? (
          tickets.map((ticket: any) => (
            <Link key={ticket.id} href={`/support/${ticket.id}`} className="block group">
              <Card className="rounded-[1.5rem] border-none shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] group-active:scale-[0.99] overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center gap-6 p-6">
                    <div className={`p-4 rounded-2xl ${ticket.priority === 'urgent' ? 'bg-rose-500/10 text-rose-600' : 'bg-primary/5 text-primary'}`}>
                      <Ticket className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">#{ticket.id.slice(0, 8)}</span>
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                      <h3 className="text-base font-bold text-foreground line-clamp-1">{ticket.subject}</h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5"><Building2 className="h-3 w-3" /> {ticket.tenant?.name}</span>
                        <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {ticket.user?.name}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(ticket.created_at))} ago</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 pr-2">
                       <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          <span className="text-xs font-bold">{ticket.messages_count || 0}</span>
                       </div>
                       <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 bg-muted/10 rounded-[2rem] border-2 border-dashed border-muted/50">
            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center">
               <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold">No High-Priority Inquiries</h3>
              <p className="text-sm text-muted-foreground">The platform is operating optimally. All ticket queues are clear.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
