"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  History, 
  Activity, 
  DollarSign, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";

const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  status: z.enum(["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"]),
  value: z.coerce.number().min(0),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: leadResponse, isLoading } = useQuery({
    queryKey: ["crm-lead", id],
    queryFn: () => apiClient.get(`super-admin/crm/leads/${id}`).then(res => res.data),
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  useEffect(() => {
    if (leadResponse?.data?.lead) {
      form.reset({
        name: leadResponse.data.lead.name,
        company: leadResponse.data.lead.company || "",
        email: leadResponse.data.lead.email,
        phone: leadResponse.data.lead.phone || "",
        status: leadResponse.data.lead.status,
        value: leadResponse.data.lead.value,
      });
    }
  }, [leadResponse, form]);

  const updateLeadMutation = useMutation({
    mutationFn: (data: LeadFormValues) => apiClient.put(`super-admin/crm/leads/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-lead", id] });
      toast.success("Lead updated successfully");
      setIsEditOpen(false);
    },
    onError: () => toast.error("Failed to update lead"),
  });

  const onEditSubmit = (data: LeadFormValues) => {
    updateLeadMutation.mutate(data);
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground italic uppercase font-black text-[10px] tracking-widest">Loading details...</div>;
  if (!leadResponse?.data) return <div className="p-8 text-center text-destructive font-black text-[10px] uppercase">Lead not found.</div>;

  const { lead, activity, history, revenue_summary } = leadResponse.data;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'New': 'bg-blue-500/10 text-blue-600',
      'Contacted': 'bg-amber-500/10 text-amber-600',
      'Qualified': 'bg-indigo-500/10 text-indigo-600',
      'Proposal': 'bg-purple-500/10 text-purple-600',
      'Negotiation': 'bg-orange-500/10 text-orange-600',
      'Won': 'bg-emerald-500/10 text-emerald-600',
      'Lost': 'bg-rose-500/10 text-rose-600',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/crm">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{lead.name}</h1>
            <Badge className={cn("border-none font-black text-[10px] uppercase px-2 py-0.5", getStatusColor(lead.status))}>
              {lead.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{lead.company || 'Individual Lead'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="font-black text-[10px] uppercase">
                Edit Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Lead Details</DialogTitle>
                <DialogDescription>
                  Update the information for this potential client.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"].map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={updateLeadMutation.isPending}>
                      {updateLeadMutation.isPending ? "Updating..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Button size="sm" className="font-black text-[10px] uppercase">
            Convert to Tenant
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="border-none shadow-lg md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <User className="h-3 w-3" /> Contact Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Email</p>
                  <p className="text-sm font-bold">{lead.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Phone</p>
                  <p className="text-sm font-bold">{lead.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Organization</p>
                  <p className="text-sm font-bold">{lead.company || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-muted">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Lead Source</p>
              <Badge variant="outline" className="font-bold text-[10px] uppercase">{lead.source || 'Direct'}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Metrics & Activity */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${Number(lead.value).toLocaleString()}</div>
                <p className="text-[10px] text-muted-foreground uppercase font-medium mt-1">Estimated LTV</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last Interaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  {lead.last_contacted_at ? new Date(lead.last_contacted_at).toLocaleDateString() : 'Never'}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-medium mt-1">Direct Outreach</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="bg-muted/30 p-1">
              <TabsTrigger value="activity" className="text-[10px] font-black uppercase px-4">Activity Log</TabsTrigger>
              <TabsTrigger value="history" className="text-[10px] font-black uppercase px-4">History</TabsTrigger>
              <TabsTrigger value="notes" className="text-[10px] font-black uppercase px-4">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="pt-4">
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    {activity.length > 0 ? activity.map((act: any) => (
                      <div key={act.id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-muted last:before:hidden">
                        <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                        <div className="space-y-1">
                          <p className="text-xs font-black uppercase tracking-tight">{act.description}</p>
                          <p className="text-sm text-muted-foreground">{act.properties?.comment || 'System interaction.'}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase mt-2">
                            {new Date(act.created_at).toLocaleString()} • {act.causer?.name || 'System'}
                          </p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-medium italic">No recent activity logged.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="pt-4">
              <Card className="border-none shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
                        <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest">Date</TableHead>
                        <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest">Event</TableHead>
                        <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest text-right">Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((h: any, i: number) => (
                        <TableRow key={i} className="border-none hover:bg-muted/50 transition-colors">
                          <TableCell className="px-6 py-4 text-xs font-medium">{h.date}</TableCell>
                          <TableCell className="px-6 py-4 text-sm font-bold">{h.event}</TableCell>
                          <TableCell className="px-6 py-4 text-right capitalize text-[10px] font-black tracking-widest text-muted-foreground">{h.type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="pt-4">
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {lead.notes || 'No administrative notes available for this lead.'}
                  </p>
                  <Button variant="outline" size="sm" className="mt-6 font-black text-[10px] uppercase">
                    Edit Notes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
