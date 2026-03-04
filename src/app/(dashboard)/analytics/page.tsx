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
import apiClient from "@/lib/api/client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/utils";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["super-admin-analytics"],
    queryFn: () => apiClient.get("super-admin/dashboard").then((res: any) => res.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const { overview, plan_distribution, signup_trend, platform_activity, recent_tenants } = data;

  const metrics = [
    {
      name: "Total Tenants",
      value: formatNumber(overview.total_tenants),
      change: `+${overview.active_tenants} active`,
      icon: UserGroupIcon,
      color: "bg-blue-500",
    },
    {
      name: "Monthly MRR",
      value: formatCurrency(overview.mrr),
      change: formatCurrency(overview.arr) + " ARR",
      icon: CurrencyDollarIcon,
      color: "bg-emerald-500",
    },
    {
      name: "Gross Churn MRR",
      value: formatCurrency(overview.churned_mrr),
      change: `${overview.gross_churn_rate}% rate`,
      icon: ChartBarIcon,
      color: "bg-rose-500",
    },
    {
      name: "Conversion Rate",
      value: `${overview.conversion_rate}%`,
      change: "Trial to Paid",
      icon: ArrowTrendingUpIcon,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-sm text-gray-500">Real-time metrics and growth trends across the platform.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-lg ${metric.color} p-3`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {metric.name}
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {metric.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-600">
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Trends Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Activity & Growth Trends */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Global Platform Activity</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={platform_activity}>
                  <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="count" name="Activity" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Tenant Signup Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={signup_trend}>
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <XAxis dataKey="date" hide />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Market Share (Plans)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={plan_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {plan_distribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {plan_distribution.map((plan: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-gray-500">{plan.name}</span>
                  </div>
                  <span className="text-gray-900">{plan.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Tenant Activity</h2>
            <div className="space-y-4">
              {recent_tenants.slice(0, 5).map((tenant: any) => (
                <div key={tenant.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{tenant.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{tenant.plan?.name || "Trial"}</p>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    tenant.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {tenant.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
