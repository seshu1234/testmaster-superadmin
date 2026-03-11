"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Building2, 
  ChevronRight, 
  Cog, 
  Flag,
  Key,
  ShieldCheck,
  Mail,
  Database,
  Palette,
  Globe,
  Settings2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/lib/api";
import Link from "next/link";

interface SettingsGroup {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}

const settingsGroups: SettingsGroup[] = [
  {
    title: "General",
    description: "Platform name, logo, branding, and regional settings",
    icon: Cog,
    href: "/settings/general",
    color: "bg-blue-500",
  },
  {
    title: "Feature Flags",
    description: "Enable/disable platform features and A/B testing",
    icon: Flag,
    href: "/settings/features",
    color: "bg-purple-500",
  },
  {
    title: "API Settings",
    description: "API keys, rate limiting, and webhook configuration",
    icon: Key,
    href: "/settings/api",
    color: "bg-green-500",
  },
  {
    title: "Security",
    description: "Authentication, MFA, password policies, and IP whitelisting",
    icon: ShieldCheck,
    href: "/settings/security",
    color: "bg-red-500",
  },
  {
    title: "Email",
    description: "SMTP settings, email templates, and notifications",
    icon: Mail,
    href: "/settings/email",
    color: "bg-amber-500",
  },
  {
    title: "Backup",
    description: "Database backups, restore points, and retention policies",
    icon: Database,
    href: "/settings/backup",
    color: "bg-indigo-500",
  },
  {
    title: "Branding",
    description: "Custom CSS, themes, and white-labeling options",
    icon: Palette,
    href: "/settings/branding",
    color: "bg-pink-500",
  },
  {
    title: "Localization",
    description: "Languages, timezone, currency, and date formats",
    icon: Globe,
    href: "/settings/localization",
    color: "bg-emerald-500",
  },
];

export default function SettingsPage() {
  const { data: response } = useQuery({
    queryKey: ["settings-stats"],
    queryFn: () => api.get("super-admin/settings/stats").then((res) => res.data),
  });
  const stats = response?.data;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Control Center</h1>
          <p className="text-sm text-muted-foreground font-medium">Configure core platform engine and global directives.</p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Registry Health: Nominal</span>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {settingsGroups.map((group) => (
          <Link
            key={group.title}
            href={group.href}
            className="group relative rounded-[2rem] bg-card p-8 shadow-sm hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 overflow-hidden border border-transparent hover:border-primary/10"
          >
            <div className={`absolute -top-4 -right-4 h-24 w-24 rounded-full ${group.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500`} />
            <div className={`inline-flex rounded-2xl ${group.color} p-4 text-white shadow-lg shadow-black/5`}>
              <group.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-8 text-xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary leading-tight">
              {group.title}
            </h3>
            <p className="mt-2 text-xs font-semibold text-muted-foreground leading-relaxed italic opacity-70">
              {group.description}
            </p>
            <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 group-hover:text-primary/60 transition-colors">
               Enter Terminal <ChevronRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Audit Log / Recent Changes */}
      <Card className="rounded-[3rem] border-none shadow-sm bg-muted/20 overflow-hidden">
        <CardHeader className="p-8 pb-0">
           <CardTitle className="text-xl font-bold">Registry Modifications</CardTitle>
           <CardDescription>Recent authoritative changes to platform state.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
           <div className="space-y-4">
              {[
                { icon: Flag, text: "Feature flag 'AI Grading' enabled globally", time: "2h ago", color: "text-purple-500" },
                { icon: Key, text: "New production API key issued for 'Global Edu'", time: "5h ago", color: "text-emerald-500" },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-card border border-primary/5 hover:border-primary/10 transition-colors group">
                   <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl bg-muted/50 ${log.color}`}>
                         <log.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">{log.text}</span>
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{log.time}</span>
                </div>
              ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
