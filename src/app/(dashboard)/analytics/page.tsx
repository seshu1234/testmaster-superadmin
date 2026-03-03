"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ChartBarIcon,
  CpuChipIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function AnalyticsPage() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: () => api.get("/admin/analytics/overview").then((res) => res.data),
  });

  const { data: trends } = useQuery({
    queryKey: ["analytics-trends"],
    queryFn: () => api.get("/admin/analytics/trends").then((res) => res.data),
  });

  const metrics = [
    {
      name: "Total Tests Taken",
      value: formatNumber(overview?.total_tests || 12543),
      change: "+12.3%",
      icon: AcademicCapIcon,
      color: "bg-blue-500",
    },
    {
      name: "Active Students",
      value: formatNumber(overview?.active_students || 8923),
      change: "+8.1%",
      icon: UserGroupIcon,
      color: "bg-green-500",
    },
    {
      name: "AI Grading Usage",
      value: formatNumber(overview?.ai_grading_usage || 3456),
      change: "+23.5%",
      icon: CpuChipIcon,
      color: "bg-purple-500",
    },
    {
      name: "Avg. Score",
      value: `${overview?.avg_score || 78}%`,
      change: "+2.1%",
      icon: ChartBarIcon,
      color: "bg-yellow-500",
    },
    {
      name: "Completion Rate",
      value: `${overview?.completion_rate || 87}%`,
      change: "+1.2%",
      icon: ArrowTrendingUpIcon,
      color: "bg-indigo-500",
    },
    {
      name: "Revenue (MTD)",
      value: formatCurrency(overview?.revenue_mtd || 45678),
      change: "+15.3%",
      icon: CurrencyDollarIcon,
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <div className="flex space-x-3">
          <Link
            href="/analytics/ai"
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            <CpuChipIcon className="mr-2 h-4 w-4" />
            AI Analytics
          </Link>
          <Link
            href="/analytics/predictive"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <ArrowTrendingUpIcon className="mr-2 h-4 w-4" />
            Predictive Analytics
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.name}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md ${metric.color} p-3`}>
                      <metric.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="truncate text-sm font-medium text-gray-500">
                          {metric.name}
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {metric.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-green-600">{metric.change}</span>
                    <span className="text-gray-500"> vs last month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-medium text-gray-900">Usage Trends</h2>
              <div className="mt-4 h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Chart will be displayed here</p>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-medium text-gray-900">Performance Metrics</h2>
              <div className="mt-4 h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Chart will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Top Tenants */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Top Performing Tenants</h2>
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Tests Taken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Active Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Avg. Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trends?.top_tenants?.map((tenant: any, idx: number) => (
                    <tr key={idx}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {tenant.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">{tenant.tests_taken}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">{tenant.active_students}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-500">{tenant.avg_score}%</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="text-sm text-green-600">+{tenant.growth}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
