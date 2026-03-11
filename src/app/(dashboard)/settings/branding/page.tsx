"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Palette, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCcw
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

const formSchema = z.object({
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color."),
  logo_url: z.string().url("Invalid logo URL."),
  favicon_url: z.string().url("Invalid favicon URL."),
  platform_tagline: z.string().min(5),
});

export default function BrandingSettingsPage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primary_color: "#6366f1",
      logo_url: "",
      favicon_url: "",
      platform_tagline: "",
    },
  });

  const { data: brandingResponse, isLoading } = useQuery({
    queryKey: ["settings", "branding"],
    queryFn: () => apiClient.get("super-admin/settings/branding").then((res) => res.data),
  });

  useEffect(() => {
    if (brandingResponse?.data) {
      form.reset(brandingResponse.data);
    }
  }, [brandingResponse, form]);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => 
      apiClient.put("super-admin/settings/branding", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "branding"] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl">
            <Link href="/settings">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-glow-primary">Aura & Visuals</h1>
            <p className="text-sm text-muted-foreground font-medium">Define the core aesthetic and brand identity of the platform.</p>
          </div>
        </div>
        {success && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Brand Synchronized
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden md:col-span-2">
              <CardHeader className="bg-muted/30 p-8 pt-10 px-10">
                 <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-2">
                    <Palette className="h-4 w-4" />
                    <span>Visual Core</span>
                 </div>
                 <CardTitle className="text-2xl font-black italic">Platform Chroma</CardTitle>
                 <CardDescription>The primary signature color used across the entire ecosystem.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                 <FormField
                    control={form.control}
                    name="primary_color"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-sm font-black uppercase tracking-wider opacity-60">Primary Brand Hex</FormLabel>
                        <FormControl>
                           <div className="flex items-center gap-4">
                              <div 
                                className="h-20 w-20 rounded-[2rem] shadow-xl border-4 border-white ring-1 ring-black/5" 
                                style={{ backgroundColor: field.value }}
                              />
                              <Input {...field} className="h-14 rounded-2xl border-none bg-muted/50 shadow-inner px-6 font-mono text-lg font-black" />
                           </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                 />
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-sm p-8">
               <CardHeader className="p-0 mb-6">
                   <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-1">
                      <ImageIcon className="h-4 w-4" />
                      <span>Assets</span>
                   </div>
                   <CardTitle className="text-xl font-black italic">Logo Synthesis</CardTitle>
               </CardHeader>
               <CardContent className="p-0 space-y-6">
                  <FormField
                    control={form.control}
                    name="logo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase opacity-50">Global Logo URL</FormLabel>
                        <FormControl>
                          <Input {...field} className="rounded-xl h-12 bg-muted/40 border-none shadow-inner" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="favicon_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase opacity-50">Favicon (32x32)</FormLabel>
                        <FormControl>
                          <Input {...field} className="rounded-xl h-12 bg-muted/40 border-none shadow-inner" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-sm p-8">
               <CardHeader className="p-0 mb-6">
                   <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-1">
                      <RefreshCcw className="h-4 w-4" />
                      <span>Messaging</span>
                   </div>
                   <CardTitle className="text-xl font-black italic">Manifesto</CardTitle>
               </CardHeader>
               <CardContent className="p-0 space-y-6">
                  <FormField
                    control={form.control}
                    name="platform_tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase opacity-50">Brand Tagline</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="The future of coaching..." className="rounded-xl h-12 bg-muted/40 border-none shadow-inner" />
                        </FormControl>
                        <FormDescription className="text-[10px]">Displayed on landing pages and portal headers.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-end gap-4 pt-10">
             <Button variant="ghost" type="button" asChild className="h-14 px-8 rounded-2xl font-bold">
                <Link href="/settings">Discard Changes</Link>
             </Button>
             <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="h-14 px-12 rounded-2xl font-black italic shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
             >
                {mutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Propagate Brand Update</span>}
             </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
