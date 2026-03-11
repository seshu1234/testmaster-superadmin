"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  HeartHandshake, 
  TrendingDown, 
  AlertCircle, 
  MessageSquare, 
  Zap,
  ShieldAlert,
  Search,
  Filter,
  Users2,
  CalendarDays,
  LineChart,
  History,
  Activity,
  ArrowUpRight,
  Plus,
  Mail,
  Phone,
  User,
  DollarSign,
  Briefcase,
  X,
  Clock
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type LeadStatus = "New" | "Contacted" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  value: number;
  owner: string;
  lastContacted: string;
  notes: string;
  source: string;
}

const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  status: z.enum(["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"]),
  value: z.coerce.number().min(0),
  source: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export default function CRMPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form for new lead
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "New",
      value: 0,
      source: "Direct",
      notes: "",
    },
  });

  // Mutations
  const createLeadMutation = useMutation({
    mutationFn: (data: LeadFormValues) => apiClient.post("super-admin/crm/leads", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
      queryClient.invalidateQueries({ queryKey: ["crm-stats"] });
      toast.success("Lead created successfully");
      setIsCreateOpen(false);
      form.reset();
    },
    onError: () => toast.error("Failed to create lead"),
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`super-admin/crm/leads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
      queryClient.invalidateQueries({ queryKey: ["crm-stats"] });
      toast.success("Lead deleted successfully");
    },
    onError: () => toast.error("Failed to delete lead"),
  });

  const onSubmit = (data: LeadFormValues) => {
    createLeadMutation.mutate(data);
  };

  // Fetch stats
  const { data: statsResponse, isLoading: isLoadingStats } = useQuery({
    queryKey: ["crm-stats"],
    queryFn: () => apiClient.get("super-admin/crm/stats").then(res => res.data),
  });

  // Fetch leads
  const { data: leadsResponse, isLoading: isLoadingLeads } = useQuery({
    queryKey: ["crm-leads", search],
    queryFn: () => apiClient.get("super-admin/crm/leads", { params: { search } }).then(res => res.data),
  });

  // Fetch tenants health
  const { data: healthResponse, isLoading: isLoadingHealth } = useQuery({
    queryKey: ["crm-tenants"],
    queryFn: () => apiClient.get("super-admin/crm/tenants").then(res => res.data),
  });

  // Fetch billing
  const { data: billingResponse, isLoading: isLoadingBilling } = useQuery({
    queryKey: ["crm-billing"],
    queryFn: () => apiClient.get("super-admin/crm/billing").then(res => res.data),
  });

  const stats = statsResponse?.data || { pipeline_value: 0, active_leads: 0, win_rate: '0%', at_risk: 0 };
  const leads = leadsResponse?.data || [];
  const tenants = healthResponse?.data || [];
  const billingTransactions = billingResponse?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CRM Central</h1>
          <p className="text-sm text-muted-foreground">Manage leads, contacts, and institutional health.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> New Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Lead</DialogTitle>
                <DialogDescription>
                  Enter the details of the new potential client.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                            <Input placeholder="john@example.com" {...field} />
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
                            <Input placeholder="+1..." {...field} />
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
                          <Input placeholder="Institution Name" {...field} />
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
                          <FormLabel>Potential Value ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={createLeadMutation.isPending}>
                      {createLeadMutation.isPending ? "Creating..." : "Save Lead"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Button size="sm">
            <MessageSquare className="mr-2 h-4 w-4" /> Outreach
          </Button>
        </div>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="success">Success</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6 pt-4">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard title="Pipeline" value={`$${stats.pipeline_value.toLocaleString()}`} icon={TrendingDown} loading={isLoadingStats} />
            <MetricCard title="Active Leads" value={stats.active_leads.toString()} icon={User} loading={isLoadingStats} />
            <MetricCard title="Win Rate" value={stats.win_rate} icon={Zap} loading={isLoadingStats} />
            <MetricCard title="At Risk" value={stats.at_risk.toString()} icon={ShieldAlert} loading={isLoadingStats} />
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg">Leads Pipeline</CardTitle>
                <CardDescription>Current active leads and their status.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search leads..." 
                  className="pl-8" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-xl border-none overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest">Contact</TableHead>
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest">Company</TableHead>
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest">Value</TableHead>
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingLeads ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-10">Loading leads...</TableCell></TableRow>
                    ) : leads.map((lead: Lead) => (
                      <TableRow key={lead.id} className="border-none hover:bg-muted/50 transition-colors">
                        <TableCell className="px-6 py-4">
                          <div className="font-bold text-sm">{lead.name}</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-medium">{lead.email}</div>
                        </TableCell>
                        <TableCell className="px-6 py-4">{lead.company}</TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge variant="secondary" className="border-none font-black text-[10px] uppercase px-2 py-0.5">
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4">${Number(lead.value).toLocaleString()}</TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild className="font-black text-[10px] uppercase hover:bg-primary/5 hover:text-primary transition-all">
                              <Link href={`/crm/leads/${lead.id}`}>Details</Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the lead
                                    and remove their data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteLeadMutation.mutate(lead.id)}
                                    className="bg-rose-600 hover:bg-rose-700"
                                  >
                                    Delete Lead
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!isLoadingLeads && leads.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">No leads found.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        <TabsContent value="success" className="space-y-6 pt-4">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Institutional Health</CardTitle>
              <CardDescription>Real-time monitoring of active tenants.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-xl border-none overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest">Institution</TableHead>
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest">Health Score</TableHead>
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest">Activity</TableHead>
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest text-right">Risk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingHealth ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-10">Loading health metrics...</TableCell></TableRow>
                    ) : tenants.map((tenant: any) => (
                      <TableRow key={tenant.id} className="border-none hover:bg-muted/50 transition-colors">
                        <TableCell className="px-6 py-4">
                          <Link href={`/tenants/${tenant.id}`} className="hover:underline">
                            <div className="font-bold text-sm text-primary">{tenant.name}</div>
                          </Link>
                          <div className="text-[10px] text-muted-foreground uppercase font-medium">{tenant.plan?.name || 'Standard'} Plan</div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Progress value={tenant.health_score} className="h-1.5 w-16" />
                            <span className="text-[10px] font-black">{tenant.health_score}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs font-medium text-muted-foreground">
                          {tenant.active_students} active students
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <Badge variant={tenant.churn_risk === 'High' ? 'destructive' : 'outline'} className="border-none font-black text-[10px] uppercase px-2 py-0.5">
                            {tenant.churn_risk}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!isLoadingHealth && tenants.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground text-sm font-medium italic">
                          No active tenant data available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 pt-4">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Billing & Revenue</CardTitle>
              <CardDescription>Overview of recent subscriptions and invoices.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-xl border-none overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest">Invoice</TableHead>
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest">Institution</TableHead>
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest">Amount</TableHead>
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                      <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingBilling ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-10">Loading transactions...</TableCell></TableRow>
                    ) : billingTransactions.map((tx: any) => (
                      <TableRow key={tx.id} className="border-none hover:bg-muted/50 transition-colors">
                        <TableCell className="px-6 py-4 font-bold text-sm">{tx.invoice_no}</TableCell>
                        <TableCell className="px-6 py-4 text-sm font-medium">{tx.institution}</TableCell>
                        <TableCell className="px-6 py-4 text-sm font-black">${Number(tx.amount).toLocaleString()}</TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge className={cn(
                            "border-none font-black text-[10px] uppercase px-2 py-0.5",
                            tx.status === 'Paid' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                          )}>{tx.status}</Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!isLoadingBilling && billingTransactions.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">No billing data found.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, loading }: any) {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
