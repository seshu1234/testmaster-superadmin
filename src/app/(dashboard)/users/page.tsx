"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  UserPlus, 
  Filter, 
  MoreVertical,
  Mail,
  Calendar,
  Shield,
  User as UserIcon,
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
  TableRow,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenant_name: string;
  status: 'active' | 'inactive' | 'suspended';
  last_login_at: string | null;
  created_at: string;
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [tenant, setTenant] = useState("all");

  const { data: response, isLoading } = useQuery({
    queryKey: ["users", search, role, status, tenant],
    queryFn: () => {
      const params: any = { search };
      if (role !== 'all') params.role = role;
      if (status !== 'all') params.status = status;
      if (tenant !== 'all') params.tenant = tenant;
      
      return apiClient
        .get("super-admin/users", { params })
        .then((res) => res.data);
    },
  });

  const users = response?.data || [];

  const { data: tenantsResponse } = useQuery({
    queryKey: ["tenants-list"],
    queryFn: () => apiClient.get("super-admin/tenants?limit=100").then((res) => res.data),
  });

  const tenants = tenantsResponse?.data || [];

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-none">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-none">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleName = role.replace('_', ' ');
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-none capitalize">{roleName}</Badge>;
      case 'admin':
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-none capitalize">{roleName}</Badge>;
      case 'teacher':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none capitalize">{roleName}</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{roleName}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage administrative and tenant users across the platform.</p>
        </div>
        <Button asChild className="rounded-xl shadow-md shadow-primary/20">
          <Link href="/users/create">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9 h-11 bg-card border-none shadow-sm rounded-xl focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-[160px] h-11 bg-card border-none shadow-sm rounded-xl">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px] h-11 bg-card border-none shadow-sm rounded-xl">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tenant} onValueChange={setTenant}>
          <SelectTrigger className="w-[180px] h-11 bg-card border-none shadow-sm rounded-xl">
            <SelectValue placeholder="All Tenants" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tenants</SelectItem>
            {tenants.map((t: any) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl bg-card shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">Syncing user data...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-card shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-6 h-14 font-bold text-foreground/70">User</TableHead>
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Role</TableHead>
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Tenant</TableHead>
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Status</TableHead>
                <TableHead className="px-6 h-14 font-bold text-foreground/70">Activity</TableHead>
                <TableHead className="px-6 h-14 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? users.map((user: User) => (
                <TableRow key={user.id} className="group hover:bg-muted/50 border-none transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {user.name}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium text-foreground/80">
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                      {user.tenant_name || "Central Admin"}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                        <Calendar className="h-3 w-3" />
                        Last: {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem asChild>
                          <Link href={`/users/${user.id}`} className="cursor-pointer">View Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/users/${user.id}/edit`} className="cursor-pointer">Edit User</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                          Suspect User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                    No users found matching your criteria.
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
