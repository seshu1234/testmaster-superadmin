"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Key,
  RefreshCw,
  Plus
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  api_rate_limit: z.coerce.number().min(1, "Rate limit must be at least 1."),
  api_timeout: z.coerce.number().min(1, "Timeout must be at least 1."),
  webhook_retry_limit: z.coerce.number().min(0),
});

export default function APISettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      api_rate_limit: 100,
      api_timeout: 30,
      webhook_retry_limit: 3,
    },
  });

  const { data: settingsResponse, isLoading } = useQuery({
    queryKey: ["settings", "api"],
    queryFn: () => api.get("super-admin/settings/api").then((res) => res.data),
  });

  useEffect(() => {
    if (settingsResponse?.data) {
      const data = settingsResponse.data;
      form.reset({
        api_rate_limit: data.api_rate_limit || 100,
        api_timeout: data.api_timeout || 30,
        webhook_retry_limit: data.webhook_retry_limit || 3,
      });
    }
  }, [settingsResponse, form]);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => 
      api.put("super-admin/settings/api", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "api"] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  // Mock API Keys for now until backend for keys is ready
  const apiKeys = [
    { id: "1", name: "Production App", key: "tm_live_••••••••••••••••", status: "active", created_at: "2024-01-10" },
    { id: "2", name: "Staging Testing", key: "tm_test_••••••••••••••••", status: "active", created_at: "2024-02-15" },
  ];

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
          <h1 className="text-2xl font-bold tracking-tight">API Settings</h1>
          <p className="text-sm text-muted-foreground">Configure developer access and integration parameters.</p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>System API Keys</CardTitle>
              <CardDescription>Global keys for internal and trusted system access.</CardDescription>
            </div>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Create New Key
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Key Prefix</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell className="font-mono text-xs">{key.key}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200">
                        {key.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{key.created_at}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Global limits and defaults for the platform API.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="api_rate_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requests per minute</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormDescription>Global default rate limit for API keys.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="api_timeout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Request Timeout (seconds)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="webhook_retry_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webhook Retry Limit</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormDescription>Number of times to retry failed webhook deliveries.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
    </div>
  );
}
