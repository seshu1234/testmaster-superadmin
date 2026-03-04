"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ChevronLeft, 
  Loader2, 
  CheckCircle2,
  DollarSign,
  Zap,
  Shield,
  Layers,
  Save,
  AlertCircle
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const formSchema = z.z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price_monthly: z.coerce.number().min(0),
  price_annual: z.coerce.number().min(0),
  student_limit: z.coerce.number().min(-1),
  test_limit: z.coerce.number().min(-1),
  ai_grading: z.boolean().default(false),
  api_access: z.boolean().default(false),
  custom_branding: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export default function EditPlanPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price_monthly: 0,
      price_annual: 0,
      student_limit: 100,
      test_limit: 10,
      ai_grading: false,
      api_access: false,
      custom_branding: false,
      is_active: true,
    },
  });

  const { data: planResponse, isLoading: isLoadingPlan } = useQuery({
    queryKey: ["plan-edit", id],
    queryFn: () => apiClient.get(`super-admin/plans/${id}`).then((res) => res.data),
  });

  useEffect(() => {
    if (planResponse?.data) {
      const p = planResponse.data;
      form.reset({
        name: p.name,
        slug: p.slug,
        description: p.description,
        price_monthly: p.price_monthly,
        price_annual: p.price_annual,
        student_limit: p.student_limit,
        test_limit: p.test_limit,
        ai_grading: p.ai_grading,
        api_access: p.api_access,
        custom_branding: p.custom_branding,
        is_active: p.is_active,
      });
    }
  }, [planResponse, form]);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return apiClient.put(`super-admin/plans/${id}`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      router.push("/subscriptions/plans");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to update plan. Please try again.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    mutation.mutate(values);
  }

  if (isLoadingPlan) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-xl">
          <Link href="/subscriptions/plans">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Tier Architecture</h1>
          <p className="text-sm text-muted-foreground">Modify the parameters for {planResponse?.data?.name}.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-card">
                <CardHeader className="bg-muted/30 pb-8 pt-10 px-8">
                  <div className="flex items-center gap-2 text-primary font-bold mb-1 uppercase tracking-widest text-[10px]">
                    <Layers className="h-4 w-4" />
                    <span>Evolution</span>
                  </div>
                  <CardTitle className="text-2xl font-black">Plan Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-foreground/70">Plan Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="h-12 bg-muted/50 border-none rounded-2xl focus-visible:ring-primary shadow-inner px-4 font-bold"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-foreground/70">Internal Slug</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              readOnly
                              className="h-12 bg-muted/20 border-none rounded-2xl focus-visible:ring-none shadow-none px-4 font-mono text-xs cursor-not-allowed opacity-60"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-foreground/70">Public Description</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="h-12 bg-muted/50 border-none rounded-2xl focus-visible:ring-primary shadow-inner px-4"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="bg-muted/50 my-4" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price_monthly"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-foreground/70">Monthly Price ($)</FormLabel>
                          <FormControl>
                            <div className="relative">
                               <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                               <Input 
                                type="number"
                                {...field} 
                                className="h-14 bg-muted/50 border-none rounded-2xl focus-visible:ring-primary shadow-inner pl-10 font-black text-lg"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price_annual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-foreground/70">Annual Price ($)</FormLabel>
                          <FormControl>
                            <div className="relative">
                               <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                               <Input 
                                type="number"
                                {...field} 
                                className="h-14 bg-muted/50 border-none rounded-2xl focus-visible:ring-primary shadow-inner pl-10 font-black text-lg text-emerald-600"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {error && (
                <div className="p-4 rounded-3xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-3 animate-in shake">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" asChild className="rounded-2xl h-14 px-8 font-bold border-2 transition-all">
                  <Link href="/subscriptions/plans">Cancel Changes</Link>
                </Button>
                <Button 
                  type="submit" 
                  disabled={mutation.isPending} 
                  className="rounded-2xl h-14 px-10 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                  {mutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Commit Changes
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-8">
              <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-card">
                <CardHeader className="bg-muted/30 pb-6 px-6">
                  <div className="flex items-center gap-2 text-primary font-bold mb-1 uppercase tracking-widest text-[10px]">
                    <Zap className="h-4 w-4" />
                    <span>Parameters</span>
                  </div>
                  <CardTitle className="text-xl font-black">Limits & Scale</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="student_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Student Capacity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            {...field} 
                            className="h-11 bg-muted/50 border-none rounded-xl focus-visible:ring-primary shadow-inner font-bold"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="test_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Monthly Test Limit</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            {...field} 
                            className="h-11 bg-muted/50 border-none rounded-xl focus-visible:ring-primary shadow-inner font-bold"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 p-3 rounded-2xl bg-muted/30">
                        <div className="space-y-0.5">
                          <FormLabel className="text-xs font-bold leading-none">Market Exposure</FormLabel>
                          <p className="text-[10px] text-muted-foreground">Is this plan currently purchasable?</p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-card">
                <CardHeader className="bg-muted/30 pb-6 px-6">
                   <div className="flex items-center gap-2 text-primary font-bold mb-1 uppercase tracking-widest text-[10px]">
                    <Shield className="h-4 w-4" />
                    <span>Entitlements</span>
                  </div>
                  <CardTitle className="text-xl font-black">Modules</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                   {[
                     { name: 'ai_grading', label: 'AI Smart Grading' },
                     { name: 'api_access', label: 'Strategic API Access' },
                     { name: 'custom_branding', label: 'White-labeling' }
                   ].map((item) => (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name as any}
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-y-0 p-3 rounded-2xl hover:bg-muted/30 transition-colors">
                          <FormLabel className="text-xs font-bold leading-none">{item.label}</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                   ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
