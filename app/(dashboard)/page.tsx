"use client";

import { useQuery } from "@tanstack/react-query";
import { StatsCards } from "@/components/layouts/StatsCards";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get("/admin/stats").then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatsCards data={stats} />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <p className="mt-4 text-gray-500">No recent activity to display.</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">System Status</h2>
          <p className="mt-4 text-gray-500">All systems operational.</p>
        </div>
      </div>
    </div>
  );
}
