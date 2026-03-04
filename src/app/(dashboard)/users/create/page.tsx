"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  UserPlus, 
  ChevronLeft, 
  Loader2, 
  CheckCircle2,
  Shield,
  Key,
  Building
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.string().min(1, "Please select a role."),
  tenant_id: z.string().optional(),
  status: z.string().default("active"),
});

export default function CreateUserPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      tenant_id: "",
      status: "active",
    },
  });

  const selectedRole = form.watch("role");

  const { data: tenantsResponse, isLoading: isLoadingTenants } = useQuery({
    queryKey: ["tenants-list-simple"],
    queryFn: () => apiClient.get("super-admin/tenants?limit=100").then((res) => res.data),
  });

  const tenants = tenantsResponse?.data || [];

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Create copy of values to avoid modifying original
      const payload = { ...values };
      if (payload.role === 'super_admin') {
        delete payload.tenant_id;
      }
      return apiClient.post("super-admin/users", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/users");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to create user. Please try again.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    mutation.mutate(values);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-xl">
          <Link href="/users">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Add Global User</h1>
          <p className="text-sm text-muted-foreground">Create administrative or institution users cross-platform.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-card">
                <CardHeader className="bg-muted/30 pb-6">
                  <div className="flex items-center gap-2 text-primary font-bold mb-1">
                    <Shield className="h-4 w-4" />
                    <span>Identity</span>
                  </div>
                  <CardTitle className="text-xl">User Account</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-foreground/70">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              {...field} 
                              className="h-11 bg-muted/50 border-none rounded-xl focus-visible:ring-primary shadow-inner"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-foreground/70">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="john@example.com" 
                              {...field} 
                              className="h-11 bg-muted/50 border-none rounded-xl focus-visible:ring-primary shadow-inner"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-foreground/70">Initial Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="text" 
                              placeholder="Min. 8 characters" 
                              {...field} 
                              className="h-11 bg-muted/50 border-none rounded-xl focus-visible:ring-primary shadow-inner"
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold h-7 rounded-lg"
                              onClick={() => form.setValue('password', Math.random().toString(36).slice(-10))}
                            >
                              Generate
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-foreground/70">System Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-muted/50 border-none rounded-xl focus:ring-primary shadow-inner">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl outline-none border-border shadow-xl">
                              <SelectItem value="super_admin" className="cursor-pointer rounded-lg m-1">Super Admin</SelectItem>
                              <SelectItem value="admin" className="cursor-pointer rounded-lg m-1">Center Admin</SelectItem>
                              <SelectItem value="teacher" className="cursor-pointer rounded-lg m-1">Teacher</SelectItem>
                              <SelectItem value="student" className="cursor-pointer rounded-lg m-1">Student</SelectItem>
                              <SelectItem value="parent" className="cursor-pointer rounded-lg m-1">Parent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-foreground/70">Account Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-muted/50 border-none rounded-xl focus:ring-primary shadow-inner">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl outline-none border-border shadow-xl">
                              <SelectItem value="active" className="cursor-pointer rounded-lg m-1">Active</SelectItem>
                              <SelectItem value="inactive" className="cursor-pointer rounded-lg m-1">Inactive</SelectItem>
                              <SelectItem value="suspended" className="cursor-pointer rounded-lg m-1 text-destructive">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {selectedRole && selectedRole !== 'super_admin' && (
                    <FormField
                      control={form.control}
                      name="tenant_id"
                      render={({ field }) => (
                        <FormItem className="animate-in slide-in-from-top-2 duration-300">
                          <FormLabel className="font-bold text-foreground/70">Assign Tenant</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 bg-muted/50 border-none rounded-xl focus:ring-primary shadow-inner">
                                <SelectValue placeholder="Select an institution" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl outline-none border-border shadow-xl max-h-60">
                              {isLoadingTenants ? (
                                <div className="p-2 flex items-center justify-center">
                                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                              ) : (
                                tenants.map((tenant: any) => (
                                  <SelectItem key={tenant.id} value={tenant.id} className="cursor-pointer rounded-lg m-1">
                                    {tenant.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>The user will only have access to this specific institution.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              {error && (
                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2 animate-in shake duration-500">
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" asChild className="rounded-xl h-12 px-6 font-bold hover:bg-muted">
                  <Link href="/users">Cancel</Link>
                </Button>
                <Button 
                  type="submit" 
                  disabled={mutation.isPending} 
                  className="rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/20"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding User...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Global User
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-card">
                <CardHeader className="bg-muted/30 pb-6">
                  <div className="flex items-center gap-2 text-primary font-bold mb-1">
                    <Key className="h-4 w-4" />
                    <span>Security</span>
                  </div>
                  <CardTitle className="text-xl">Authentication</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4 text-xs text-muted-foreground leading-relaxed">
                  <div className="p-4 rounded-2xl bg-muted/50 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground/80">
                      <Shield className="h-3 w-3" />
                      Permissions
                    </div>
                    <p>Roles determine access levels across the platform and within specific tenants.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/50 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground/80">
                      <Building className="h-3 w-3" />
                      Isolation
                    </div>
                    <p>Tenant users are strictly isolated to their assigned institution's database and assets.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
