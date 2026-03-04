"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft,
  Loader2, 
  AlertCircle,
  Save,
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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  phone: z.string().optional().nullable(),
  plan_id: z.string().min(1, "Please select a plan."),
  status: z.string(),
  trial_ends_at: z.string().optional().nullable(),
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
      slug: "",
      phone: "",
      plan_id: "",
      status: "trial",
      trial_ends_at: "",
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
        slug: t.slug,
        phone: t.phone || "",
        plan_id: t.plan_id || t.plan?.id || "",
        status: t.status,
        trial_ends_at: t.trial_ends_at ? new Date(t.trial_ends_at).toISOString().split('T')[0] : "",
      });
    }
  }, [tenantResponse, form]);

  const plans = plansResponse?.data || [];

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      const payload = {
        ...values,
        phone: values.phone === "" ? null : values.phone,
        trial_ends_at: values.trial_ends_at === "" ? null : values.trial_ends_at,
      };
      return apiClient.put(`super-admin/tenants/${id}`, payload);
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
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href={`/tenants/${id}`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to institution
          </Link>
        </Button>
        
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit institution</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update institution details and settings
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-medium">Basic information</h2>
              <p className="text-sm text-muted-foreground">
                Primary identification and contact details
              </p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., TestMaster Academy" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subdomain</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="academy" />
                      </FormControl>
                      <FormDescription>
                        {field.value || "academy"}.testmaster.in
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="admin@academy.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="+1 234 567 890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="my-8" />

          {/* Subscription & Status */}
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-medium">Subscription & status</h2>
              <p className="text-sm text-muted-foreground">
                Manage service level and account state
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="plan_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                        </FormControl>
                        {/* Fixed: Added position fixing props to SelectContent */}
                        <SelectContent 
                          position="popper" 
                          className="z-50 max-h-[300px] overflow-y-auto"
                          sideOffset={4}
                        >
                          {isLoadingPlans ? (
                            <SelectItem value="loading" disabled>Loading plans...</SelectItem>
                          ) : (
                            plans.map((plan: any) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name} (${plan.price_monthly}/mo)
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
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        {/* Fixed: Added position fixing props to SelectContent */}
                        <SelectContent 
                          position="popper" 
                          className="z-50"
                          sideOffset={4}
                        >
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="trial">Free trial</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="trial_ends_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trial end date</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value || ""} 
                        type="date" 
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      Only applicable for trial accounts
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-4">
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/tenants/${id}`)}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="min-w-[100px]"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Simple separator component
function Separator({ className }: { className?: string }) {
  return <hr className={cn("border-t", className)} />;
}

import { cn } from "@/lib/utils";