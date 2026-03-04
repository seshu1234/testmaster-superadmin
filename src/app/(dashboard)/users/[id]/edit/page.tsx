"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  User as UserIcon,
  ChevronLeft, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Save,
  Shield,
  Key
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
import { Separator } from "@/components/ui/separator";

const formSchema = z.z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().optional(),
  role: z.string(),
  status: z.string(),
});

export default function EditUserPage() {
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
      password: "",
      role: "",
      status: "active",
    },
  });

  const { data: userResponse, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user-edit", id],
    queryFn: () => apiClient.get(`super-admin/users/${id}`).then((res) => res.data),
  });

  useEffect(() => {
    if (userResponse?.data) {
      const u = userResponse.data;
      form.reset({
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
      });
    }
  }, [userResponse, form]);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Only send password if it's filled
      const payload = { ...values };
      if (!payload.password) delete payload.password;
      return apiClient.put(`super-admin/users/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push(`/users/${id}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to update user. Please try again.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    mutation.mutate(values);
  }

  if (isLoadingUser) {
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
          <Link href={`/users/${id}`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Global User</h1>
          <p className="text-sm text-muted-foreground">Modify account details and access levels.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 pb-8 pt-10 px-10">
              <div className="flex items-center gap-2 text-primary font-bold mb-1 uppercase tracking-widest text-xs">
                <Shield className="h-4 w-4" />
                <span>Identification</span>
              </div>
              <CardTitle className="text-2xl font-black">Account Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-foreground/70">Full Name</FormLabel>
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
                      <FormLabel className="font-bold text-foreground/70">Email Address</FormLabel>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-foreground/70">Platform Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-muted/50 border-none rounded-2xl focus:ring-primary shadow-inner px-4 font-medium">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl outline-none border-border shadow-2xl p-2">
                          <SelectItem value="super_admin" className="cursor-pointer rounded-xl m-1 py-3">Super Admin</SelectItem>
                          <SelectItem value="admin" className="cursor-pointer rounded-xl m-1 py-3">Center Admin</SelectItem>
                          <SelectItem value="teacher" className="cursor-pointer rounded-xl m-1 py-3">Teacher</SelectItem>
                          <SelectItem value="student" className="cursor-pointer rounded-xl m-1 py-3">Student</SelectItem>
                          <SelectItem value="parent" className="cursor-pointer rounded-xl m-1 py-3">Parent</SelectItem>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-muted/50 border-none rounded-2xl focus:ring-primary shadow-inner px-4 font-medium">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl outline-none border-border shadow-2xl p-2">
                          <SelectItem value="active" className="cursor-pointer rounded-xl m-1 py-3 text-emerald-600">Active</SelectItem>
                          <SelectItem value="inactive" className="cursor-pointer rounded-xl m-1 py-3">Inactive</SelectItem>
                          <SelectItem value="suspended" className="cursor-pointer rounded-xl m-1 py-3 text-destructive">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-muted-foreground/10" />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <Key className="h-3 w-3" />
                  Security Reset
                </div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="max-w-md">
                      <FormLabel className="font-bold text-foreground/70">New Password (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Leave blank to keep existing" 
                          {...field} 
                          className="h-12 bg-muted/50 border-none rounded-2xl focus-visible:ring-primary shadow-inner px-4 font-medium"
                        />
                      </FormControl>
                      <FormDescription>Only enter if you wish to force a password update for this user.</FormDescription>
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

              <div className="flex justify-end gap-3 pt-6">
                <Button variant="outline" type="button" asChild className="rounded-2xl h-14 px-8 font-bold hover:bg-muted transition-all border-2">
                  <Link href={`/users/${id}`}>Discard Changes</Link>
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
                      Update Account
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
