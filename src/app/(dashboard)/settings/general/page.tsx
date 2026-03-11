"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { api } from "@/lib/api";
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

const formSchema = z.object({
  platform_name: z.string().min(2, "Platform name must be at least 2 characters."),
  support_email: z.string().email("Invalid email address."),
  enable_registration: z.boolean().default(true),
  terms_url: z.string().url().optional().or(z.string().length(0)),
  privacy_url: z.string().url().optional().or(z.string().length(0)),
});

export default function GeneralSettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform_name: "",
      support_email: "",
      enable_registration: true,
      terms_url: "",
      privacy_url: "",
    },
  });

  const { data: settingsResponse, isLoading } = useQuery({
    queryKey: ["settings", "general"],
    queryFn: () => api.get("super-admin/settings/general").then((res) => res.data),
  });

  useEffect(() => {
    if (settingsResponse?.data) {
      const data = settingsResponse.data;
      form.reset({
        platform_name: data.platform_name || "",
        support_email: data.support_email || "",
        enable_registration: !!data.enable_registration,
        terms_url: data.terms_url || "",
        privacy_url: data.privacy_url || "",
      });
    }
  }, [settingsResponse, form]);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => 
      api.put("super-admin/settings/general", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "general"] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">General Settings</h1>
          <p className="text-sm text-muted-foreground">Manage platform identity and basic configurations.</p>
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Identity</CardTitle>
              <CardDescription>How your platform appears to users and in emails.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="platform_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="TestMaster Platform" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="support_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="support@testmaster.in" />
                    </FormControl>
                    <FormDescription>Main contact email for system notifications and support.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access & Policies</CardTitle>
              <CardDescription>Control how users interact with the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="enable_registration"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Public Registration</FormLabel>
                      <FormDescription>Allow anyone to create a new tenant account.</FormDescription>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="terms_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms of Service URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="privacy_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Privacy Policy URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {success && (
                <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium animate-in fade-in slide-in-from-left-2">
                  <CheckCircle2 className="h-4 w-4" /> Settings saved successfully
                </div>
              )}
              {mutation.isError && (
                <div className="flex items-center gap-1.5 text-sm text-destructive font-medium">
                  <AlertCircle className="h-4 w-4" /> Failed to save settings
                </div>
              )}
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
