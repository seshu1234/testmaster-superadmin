"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Globe
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  default_language: z.string(),
  default_timezone: z.string(),
  default_currency: z.string(),
  date_format: z.string(),
  time_format: z.string(),
});

export default function LocalizationSettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      default_language: "en",
      default_timezone: "UTC",
      default_currency: "USD",
      date_format: "YYYY-MM-DD",
      time_format: "12h",
    },
  });

  const { data: settingsResponse, isLoading } = useQuery({
    queryKey: ["settings", "localization"],
    queryFn: () => api.get("super-admin/settings/localization").then((res) => res.data),
  });

  useEffect(() => {
    if (settingsResponse?.data) {
      const data = settingsResponse.data;
      form.reset({
        default_language: data.default_language || "en",
        default_timezone: data.default_timezone || "UTC",
        default_currency: data.default_currency || "USD",
        date_format: data.date_format || "YYYY-MM-DD",
        time_format: data.time_format || "12h",
      });
    }
  }, [settingsResponse, form]);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => 
      api.put("super-admin/settings/localization", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "localization"] });
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
          <h1 className="text-2xl font-bold tracking-tight">Localization</h1>
          <p className="text-sm text-muted-foreground">Manage regional preferences and display formats.</p>
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Preferences</CardTitle>
              <CardDescription>Default language and timezone for the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="default_language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Language</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">English (US)</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="default_timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Timezone</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                          <SelectItem value="Asia/Kolkata">IST (Indian Standard Time)</SelectItem>
                          <SelectItem value="America/New_York">EST (Eastern Standard Time)</SelectItem>
                          <SelectItem value="Europe/London">GMT (Greenwich Mean Time)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="default_currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reporting Currency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                        <SelectItem value="INR">INR - Indian Rupee (₹)</SelectItem>
                        <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound (£)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Global default currency for administrative reports.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Date & Time Formats</CardTitle>
              <CardDescription>How dates and times are displayed throughout the platform.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date_format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Format</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="YYYY-MM-DD">2024-03-04 (ISO)</SelectItem>
                          <SelectItem value="DD/MM/YYYY">04/03/2024 (UK)</SelectItem>
                          <SelectItem value="MM/DD/YYYY">03/04/2024 (US)</SelectItem>
                          <SelectItem value="MMM D, YYYY">Mar 4, 2024</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time_format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Format</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="12h">12-hour (1:00 PM)</SelectItem>
                          <SelectItem value="24h">24-hour (13:00)</SelectItem>
                        </SelectContent>
                      </Select>
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
