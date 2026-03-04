"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Building2, 
  ChevronLeft, 
  Loader2, 
  CheckCircle2,
  Globe,
  Mail,
  Zap
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
  slug: z.string().min(2, "Slug must be at least 2 characters.").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens."),
  email: z.string().email("Invalid email address."),
  plan_id: z.string().min(1, "Please select a plan."),
  status: z.string().default("trial"),
});

export default function CreateTenantPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      email: "",
      plan_id: "",
      status: "trial",
    },
  });

  const { data: plansResponse, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["plans-list"],
    queryFn: () => apiClient.get("super-admin/subscriptions/plans").then((res) => res.data),
  });

  const plans = plansResponse?.data || [];

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return apiClient.post("super-admin/tenants", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      router.push("/tenants");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to create tenant. Please try again.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    mutation.mutate(values);
  }

  // Auto-generate slug from name
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    if (!form.getFieldState("slug").isDirty) {
      const slug = name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      form.setValue("slug", slug);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-xl">
          <Link href="/tenants">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Tenant</h1>
          <p className="text-sm text-muted-foreground">Register a new institution on the platform.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-card">
                <CardHeader className="bg-muted/30 pb-6">
                  <div className="flex items-center gap-2 text-primary font-bold mb-1">
                    <Building2 className="h-4 w-4" />
                    <span>Basic Information</span>
                  </div>
                  <CardTitle className="text-xl">Institution Details</CardTitle>
                  <CardDescription>Enter the name and public identifier for this tenant.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-foreground/70">Institution Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Apex Academy" 
                            {...field} 
                            onChange={onNameChange}
                            className="h-11 bg-muted/50 border-none rounded-xl focus-visible:ring-primary shadow-inner"
                          />
                        </FormControl>
                        <FormDescription>The official name of the school or coaching center.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-foreground/70">URL Slug</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="apex-academy" 
                              {...field} 
                              className="h-11 bg-muted/50 border-none rounded-xl focus-visible:ring-primary shadow-inner pl-3"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground bg-background px-2 py-1 rounded-lg border border-border shadow-sm">
                              .testmaster.in
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>Unique identifier used in the URL.</FormDescription>
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
                            placeholder="admin@institution.com" 
                            {...field} 
                            className="h-11 bg-muted/50 border-none rounded-xl focus-visible:ring-primary shadow-inner"
                          />
                        </FormControl>
                        <FormDescription>Primary administrative contact email.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {error && (
                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2 animate-in shake duration-500">
                  <Loader2 className="h-4 w-4 animate-spin hidden" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" asChild className="rounded-xl h-12 px-6 font-bold hover:bg-muted">
                  <Link href="/tenants">Cancel</Link>
                </Button>
                <Button 
                  type="submit" 
                  disabled={mutation.isPending} 
                  className="rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/20"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Create Institution
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-card">
                <CardHeader className="bg-muted/30 pb-6">
                  <div className="flex items-center gap-2 text-primary font-bold mb-1">
                    <Zap className="h-4 w-4" />
                    <span>Plan & Status</span>
                  </div>
                  <CardTitle className="text-xl">Subscription</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="plan_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-foreground/70">Initial Plan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-muted/50 border-none rounded-xl focus:ring-primary shadow-inner">
                              <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl outline-none border-border shadow-xl">
                            {isLoadingPlans ? (
                              <div className="p-2 flex items-center justify-center">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              </div>
                            ) : (
                              plans.map((plan: any) => (
                                <SelectItem key={plan.id} value={plan.id} className="cursor-pointer rounded-lg m-1">
                                  {plan.name}
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
                        <FormLabel className="font-bold text-foreground/70">Initial Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 bg-muted/50 border-none rounded-xl focus:ring-primary shadow-inner">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl outline-none border-border shadow-xl">
                            <SelectItem value="active" className="cursor-pointer rounded-lg m-1">Active</SelectItem>
                            <SelectItem value="trial" className="cursor-pointer rounded-lg m-1">Trial</SelectItem>
                            <SelectItem value="suspended" className="cursor-pointer rounded-lg m-1 text-destructive">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-primary">
                    <Globe className="h-4 w-4" />
                    <span>Platform Setup</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                    Creating a tenant will automatically set up their dedicated database, subdomains, and an initial administrative profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
