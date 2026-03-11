"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Search, 
  Download, 
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Loader2,
  MoreVertical
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { format } from "date-fns";

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const { data: response, isLoading } = useQuery({
    queryKey: ["invoices", search, status],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status !== "all") params.append("status", status);
      return apiClient.get(`super-admin/subscriptions/invoices?${params.toString()}`).then((res) => res.data);
    },
  });

  const invoices = response?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-3 font-bold">Paid</Badge>;
      case 'pending': return <Badge className="bg-amber-500/10 text-amber-600 border-none px-3 font-bold">Pending</Badge>;
      case 'failed': return <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 border-none px-3 font-bold">Failed</Badge>;
      case 'void': return <Badge variant="secondary" className="px-3 font-bold">Void</Badge>;
      default: return <Badge variant="outline" className="px-3 font-bold">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing Records</h1>
          <p className="text-sm text-muted-foreground font-medium">Historical invoice ledger and payment reconciliation.</p>
        </div>
        <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all">
          <Download className="mr-2 h-4 w-4" /> Export Ledger
        </Button>
      </div>

      <Card className="rounded-[2rem] border-none shadow-sm bg-muted/20 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by Invoice ID, Tenant name or slug..." 
              className="h-12 bg-background border-none rounded-2xl pl-12 shadow-inner focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-12 w-12 rounded-2xl border-none bg-background shadow-inner p-0">
               <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
         <Table>
            <TableHeader className="bg-muted/30">
               <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="py-6 pl-8 font-black uppercase tracking-widest text-[10px] text-muted-foreground/60">Invoice ID</TableHead>
                  <TableHead className="py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground/60">Institution</TableHead>
                  <TableHead className="py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground/60">Plan</TableHead>
                  <TableHead className="py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground/60">Amount</TableHead>
                  <TableHead className="py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground/60">Date</TableHead>
                  <TableHead className="py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground/60">Status</TableHead>
                  <TableHead className="py-6 pr-8"></TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse border-muted/20">
                       <TableCell colSpan={7} className="py-8 px-8">
                          <div className="h-4 w-full bg-muted/40 rounded-full" />
                       </TableCell>
                    </TableRow>
                  ))
               ) : invoices.length > 0 ? (
                  invoices.map((invoice: any) => (
                    <TableRow key={invoice.id} className="group hover:bg-muted/20 transition-colors border-muted/20">
                       <TableCell className="py-6 pl-8">
                          <span className="font-mono text-xs font-bold uppercase tracking-tighter text-muted-foreground">#{invoice.id.slice(0, 8)}</span>
                       </TableCell>
                       <TableCell className="py-6">
                          <div className="flex flex-col">
                             <span className="font-bold text-sm tracking-tight">{invoice.tenant?.name}</span>
                             <span className="text-[10px] font-medium text-muted-foreground">{invoice.tenant?.slug}.testmaster.in</span>
                          </div>
                       </TableCell>
                       <TableCell className="py-6">
                          <Badge variant="outline" className="border-muted-foreground/10 text-muted-foreground/80 font-bold rounded-lg px-2">
                             {invoice.plan_name || "Professional"}
                          </Badge>
                       </TableCell>
                       <TableCell className="py-6">
                          <span className="font-black text-sm tracking-tighter text-foreground">${invoice.amount.toLocaleString()}</span>
                       </TableCell>
                       <TableCell className="py-6 text-sm font-medium text-muted-foreground">
                          {format(new Date(invoice.created_at), "MMM dd, yyyy")}
                       </TableCell>
                       <TableCell className="py-6">
                          {getStatusBadge(invoice.status)}
                       </TableCell>
                       <TableCell className="py-6 pr-8 text-right">
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-40 group-hover:opacity-100 transition-opacity">
                                   <MoreVertical className="h-4 w-4" />
                                </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[160px]">
                                <DropdownMenuItem className="rounded-xl flex items-center gap-3 font-bold text-primary focus:text-primary focus:bg-primary/5 cursor-pointer">
                                   <FileText className="h-4 w-4" /> View PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl flex items-center gap-3 font-bold text-muted-foreground focus:text-foreground focus:bg-muted/50 cursor-pointer">
                                   <ExternalLink className="h-4 w-4" /> Gateway Link
                                </DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </TableCell>
                    </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={7} className="h-40 py-8 px-8 text-center bg-muted/5">
                        <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                           <FileText className="h-10 w-10" />
                           <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No records found</p>
                        </div>
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>
      </Card>
    </div>
  );
}
