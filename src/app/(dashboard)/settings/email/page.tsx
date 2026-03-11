"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Mail,
  Send
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
  mail_host: z.string().min(1, "Mail host is required."),
  mail_port: z.coerce.number(),
  mail_username: z.string(),
  mail_password: z.string(),
  mail_encryption: z.string(),
  mail_from_address: z.string().email(),
  mail_from_name: z.string(),
});

export default function EmailSettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mail_host: "smtp.mailtrap.io",
      mail_port: 2525,
      mail_username: "",
      mail_password: "",
      mail_encryption: "tls",
      mail_from_address: "notifications@testmaster.in",
      mail_from_name: "TestMaster Platform",
    },
  });

  const { data: settingsResponse, isLoading } = useQuery({
    queryKey: ["settings", "email"],
    queryFn: () => api.get("super-admin/settings/email").then((res) => res.data),
  });

  useEffect(() => {
    if (settingsResponse?.data) {
      const data = settingsResponse.data;
      form.reset({
        mail_host: data.mail_host || "smtp.mailtrap.io",
        mail_port: data.mail_port || 2525,
        mail_username: data.mail_username || "",
        mail_password: data.mail_password || "",
        mail_encryption: data.mail_encryption || "tls",
        mail_from_address: data.mail_from_address || "notifications@testmaster.in",
        mail_from_name: data.mail_from_name || "TestMaster Platform",
      });
    }
  }, [settingsResponse, form]);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => 
      api.put("super-admin/settings/email", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "email"] });
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
          <h1 className="text-2xl font-bold tracking-tight">Email Settings</h1>
          <p className="text-sm text-muted-foreground">Configure SMTP and outgoing email parameters.</p>
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Connection details for your email service provider.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="mail_host"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="smtp.provider.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mail_port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="587" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mail_username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mail_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mail_encryption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Encryption</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select encryption" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sender Information</CardTitle>
              <CardDescription>Default "From" details for outgoing platform emails.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mail_from_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="TestMaster Support" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mail_from_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="noreply@testmaster.in" />
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
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" className="gap-2">
                <Send className="h-4 w-4" /> Send Test Email
              </Button>
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
          </div>
        </form>
      </Form>
    </div>
  );
}
