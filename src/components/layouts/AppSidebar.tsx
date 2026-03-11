"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity,
  BarChart3, 
  Bell, 
  Building2, 
  ClipboardList, 
  CreditCard, 
  Cpu,
  HeartHandshake,
  LayoutDashboard, 
  LogOut, 
  Settings, 
  ShieldCheck, 
  ShoppingBag, 
  Target,
  TrendingUp,
  Users 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tenants", href: "/tenants", icon: Building2 },
  { name: "CRM Central", href: "/crm", icon: HeartHandshake },
  { name: "Users", href: "/users", icon: Users },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Analytics Hub", href: "/analytics", icon: BarChart3 },
  { name: "Marketing Funnels", href: "/analytics/marketing", icon: Target },
  { name: "Revenue", href: "/subscriptions/revenue", icon: TrendingUp },
  { name: "AI Monitoring", href: "/analytics/ai", icon: Cpu },
  { name: "Monitoring", href: "/monitoring", icon: Activity },
  { name: "Audit Logs", href: "/audit-logs", icon: ClipboardList },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-50 flex flex-col transition-all duration-300">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            TestMaster
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        <div>
          <div className="mb-4 px-4 text-[11px] font-bold uppercase tracking-widest text-foreground/40">
            Management
          </div>
          <nav className="space-y-1">
            {navigation.slice(0, 5).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="mb-4 px-4 text-[11px] font-bold uppercase tracking-widest text-foreground/40">
            Intelligence
          </div>
          <nav className="space-y-1">
            {navigation.slice(5, 8).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="mb-4 px-4 text-[11px] font-bold uppercase tracking-widest text-foreground/40">
            System
          </div>
          <nav className="space-y-1">
            {navigation.slice(8).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mt-auto border-t border-border/40 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
