"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Lock
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  enforce_mfa: z.boolean().default(false),
  password_min_length: z.coerce.number().min(8).max(32),
  password_require_special: z.boolean().default(true),
  session_timeout: z.coerce.number().min(15).max(1440),
  max_login_attempts: z.coerce.number().min(1).max(10),
});

export default function SecuritySettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enforce_mfa: false,
      password_min_length: 12,
      password_require_special: true,
      session_timeout: 60,
      max_login_attempts: 5,
    },
  });

  const { data: settingsResponse, isLoading } = useQuery({
    queryKey: ["settings", "security"],
    queryFn: () => api.get("super-admin/settings/security").then((res) => res.data),
  });

  useEffect(() => {
    if (settingsResponse?.data) {
      const data = settingsResponse.data;
      form.reset({
        enforce_mfa: !!data.enforce_mfa,
        password_min_length: data.password_min_length || 12,
        password_require_special: !!data.password_require_special,
        session_timeout: data.session_timeout || 60,
        max_login_attempts: data.max_login_attempts || 5,
      });
    }
  }, [settingsResponse, form]);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => 
      api.put("super-admin/settings/security", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "security"] });
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
          <h1 className="text-2xl font-bold tracking-tight">Security Settings</h1>
          <p className="text-sm text-muted-foreground">Configure authentication policies and platform protection.</p>
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Policy</CardTitle>
              <CardDescription>Secure how administrators and staff access the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="enforce_mfa"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4 border-amber-100 bg-amber-50/30">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                         <FormLabel className="text-base">Enforce MFA</FormLabel>
                         <ShieldAlert className="h-4 w-4 text-amber-600" />
                      </div>
                      <FormDescription>Require Multi-Factor Authentication for all super admin accounts.</FormDescription>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="password_min_length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Password Length</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_login_attempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Login Attempts</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormDescription>Account lock after failed tries.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="password_require_special"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Require Special Characters</FormLabel>
                      <FormDescription>Force users to include symbols and numbers in passwords.</FormDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Control how long users stay logged in.</CardDescription>
            </CardHeader>
            <CardContent>
               <FormField
                  control={form.control}
                  name="session_timeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idle Timeout (minutes)</FormLabel>
                      <FormControl>
                         <Select onValueChange={field.onChange} value={field.value.toString()}>
                           <SelectTrigger>
                             <SelectValue placeholder="Select timeout" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="15">15 minutes</SelectItem>
                             <SelectItem value="30">30 minutes</SelectItem>
                             <SelectItem value="60">1 hour</SelectItem>
                             <SelectItem value="240">4 hours</SelectItem>
                             <SelectItem value="720">12 hours</SelectItem>
                             <SelectItem value="1440">24 hours</SelectItem>
                           </SelectContent>
                         </Select>
                      </FormControl>
                      <FormDescription>Automatically log out inactive users after this period.</FormDescription>
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
  );
}
