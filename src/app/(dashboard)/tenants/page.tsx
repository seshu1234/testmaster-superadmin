"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Building2, 
  Plus, 
  Search, 
  Pause, 
  Play, 
  UserCircle, 
  Eye, 
  MoreVertical,
  Globe,
  Loader2
} from "lucide-react";
import apiClient from "@/lib/api/client";
import Link from "next/link";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'suspended' | 'trial';
  plan: { name: string } | null;
  created_at: string;
}

export default function TenantsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ["tenants", search, status],
    queryFn: () => {
      const params: any = { search };
      if (status !== 'all') params.status = status;
      
      return apiClient
        .get("super-admin/tenants", { params })
        .then((res) => res.data);
    },
  });

  const tenants = response?.data || [];

  const suspendMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`super-admin/tenants/${id}/suspend`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`super-admin/tenants/${id}/reactivate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  const impersonateMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`super-admin/tenants/${id}/impersonate`),
    onSuccess: (res: any) => {
      const { token, tenant } = res.data.data;
      const tenantDomain = `http://${tenant.slug}.localhost:3000/login/callback?token=${token}`;
      window.open(tenantDomain, "_blank");
    },
  });

  const getStatusBadge = (status: Tenant['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none">Active</Badge>;
      case 'suspended':
        return <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-none">Suspended</Badge>;
      case 'trial':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none">Free Trial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tenant Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Monitor and manage all educational institutions on the platform.</p>
        </div>
        <Button asChild className="rounded-xl shadow-md shadow-primary/20">
          <Link href="/tenants/create">
            <Plus className="mr-2 h-4 w-4" />
            Add New Tenant
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, slug or email..."
            className="pl-9 h-11 bg-card border-none shadow-sm rounded-xl focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px] h-11 bg-card border-none shadow-sm rounded-xl">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="suspended">Suspended Only</SelectItem>
            <SelectItem value="trial">Free Trial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl bg-card shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">Syncing platform tenants...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-card shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Tenant</TableHead>
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Slug / Domain</TableHead>
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Status</TableHead>
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Plan</TableHead>
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Joined</TableHead>
                <TableHead className="px-6 h-14 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.length > 0 ? tenants.map((tenant: Tenant) => (
                <TableRow key={tenant.id} className="group hover:bg-muted/50 border-none transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                        {tenant.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {tenant.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-mono text-muted-foreground">
                        {tenant.slug}.testmaster.in
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-primary/60 font-medium">
                        <Globe className="h-3 w-3" />
                        HTTPS Active
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getStatusBadge(tenant.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium text-foreground/80">
                    <div className="flex items-center gap-2">
                       <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                       {tenant.plan?.name || "No Plan"}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(tenant.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10"
                        onClick={() => impersonateMutation.mutate(tenant.id)}
                        disabled={impersonateMutation.isPending}
                        title="Impersonate"
                      >
                        <UserCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                        asChild
                      >
                        <Link href={`/tenants/${tenant.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          {tenant.status === 'suspended' ? (
                            <DropdownMenuItem
                              className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-500/10"
                              onClick={() => reactivateMutation.mutate(tenant.id)}
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Reactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              onClick={() => suspendMutation.mutate(tenant.id)}
                            >
                              <Pause className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem asChild>
                            <Link href={`/tenants/${tenant.id}/edit`}>Edit Details</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                    No tenants found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
