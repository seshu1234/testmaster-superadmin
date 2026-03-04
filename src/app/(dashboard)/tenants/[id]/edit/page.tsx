"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Building2, 
  ChevronLeft, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Save
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
  plan_id: z.string().min(1, "Please select a plan."),
  status: z.string(),
});

export default function EditTenantPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      plan_id: "",
      status: "trial",
    },
  });

  const { data: tenantResponse, isLoading: isLoadingTenant } = useQuery({
    queryKey: ["tenant-edit", id],
    queryFn: () => apiClient.get(`super-admin/tenants/${id}`).then((res) => res.data),
  });

  const { data: plansResponse, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["plans-list"],
    queryFn: () => apiClient.get("super-admin/subscriptions/plans").then((res) => res.data),
  });

  useEffect(() => {
    if (tenantResponse?.data) {
      const t = tenantResponse.data;
      form.reset({
        name: t.name,
        email: t.email,
        plan_id: t.plan_id || t.plan?.id || "",
        status: t.status,
      });
    }
  }, [tenantResponse, form]);

  const plans = plansResponse?.data || [];

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return apiClient.put(`super-admin/tenants/${id}`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant", id] });
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      router.push(`/tenants/${id}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to update tenant. Please try again.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    mutation.mutate(values);
  }

  if (isLoadingTenant) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-xl">
          <Link href={`/tenants/${id}`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Institution</h1>
          <p className="text-sm text-muted-foreground">Update details for {tenantResponse?.data?.name || 'this institution'}.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-8 pt-10 px-10">
              <div className="flex items-center gap-2 text-primary font-bold mb-1 uppercase tracking-widest text-xs">
                <Building2 className="h-4 w-4" />
                <span>Configuration</span>
              </div>
              <CardTitle className="text-2xl font-black">Tenant Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-foreground/70">Institution Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-12 bg-muted/50 border-none rounded-2xl focus-visible:ring-primary shadow-inner px-4 font-medium"
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
                      <FormLabel className="font-bold text-foreground/70">Contact Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-12 bg-muted/50 border-none rounded-2xl focus-visible:ring-primary shadow-inner px-4 font-medium"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <FormField
                  control={form.control}
                  name="plan_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-foreground/70">Subscription Plan</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-muted/50 border-none rounded-2xl focus:ring-primary shadow-inner px-4">
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl outline-none border-border shadow-2xl p-2">
                          {isLoadingPlans ? (
                            <div className="p-2 flex items-center justify-center">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            plans.map((plan: any) => (
                              <SelectItem key={plan.id} value={plan.id} className="cursor-pointer rounded-xl m-1 py-3">
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-bold">{plan.name}</span>
                                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">${plan.price_monthly}/mo</span>
                                </div>
                              </SelectItem>
                            ))
                          )}
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
                      <FormLabel className="font-bold text-foreground/70">Operational Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-muted/50 border-none rounded-2xl focus:ring-primary shadow-inner px-4 font-medium">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl outline-none border-border shadow-2xl p-2">
                          <SelectItem value="active" className="cursor-pointer rounded-xl m-1 py-3">Active</SelectItem>
                          <SelectItem value="trial" className="cursor-pointer rounded-xl m-1 py-3">Free Trial</SelectItem>
                          <SelectItem value="suspended" className="cursor-pointer rounded-xl m-1 py-3 text-destructive">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-8">
                <Button variant="outline" type="button" asChild className="rounded-2xl h-14 px-8 font-bold hover:bg-muted transition-all border-2">
                  <Link href={`/tenants/${id}`}>Discard Changes</Link>
                </Button>
                <Button 
                  type="submit" 
                  disabled={mutation.isPending} 
                  className="rounded-2xl h-14 px-10 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Update Intelligence
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
