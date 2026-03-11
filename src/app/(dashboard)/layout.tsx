"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppSidebar from "@/components/layouts/AppSidebar"; // Original import
import Header from "@/components/layouts/Header";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <div className="flex flex-1 flex-col pl-64 transition-all duration-300">
        <Header />
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl rounded-3xl bg-card p-8 shadow-sm min-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
