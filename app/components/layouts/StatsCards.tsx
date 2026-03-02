"use client";

import {
  BuildingOfficeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface StatsCardsProps {
  data?: {
    total_tenants: number;
    active_tenants: number;
    total_users: number;
    monthly_revenue: number;
    system_uptime: number;
    queue_size: number;
  };
}

export function StatsCards({ data }: StatsCardsProps) {
  const stats = [
    {
      name: "Total Tenants",
      value: data?.total_tenants || 0,
      subValue: `${data?.active_tenants || 0} active`,
      icon: BuildingOfficeIcon,
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Total Users",
      value: data?.total_users || 0,
      subValue: "across all tenants",
      icon: UsersIcon,
      change: "+23%",
      changeType: "positive",
    },
    {
      name: "Monthly Revenue",
      value: data?.monthly_revenue ? `$${data.monthly_revenue.toLocaleString()}` : "$0",
      subValue: "↑ 8% from last month",
      icon: CurrencyDollarIcon,
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "System Health",
      value: data?.system_uptime ? `${data.system_uptime}%` : "99.9%",
      subValue: `Queue: ${data?.queue_size || 0} jobs`,
      icon: ChartBarIcon,
      change: "Healthy",
      changeType: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.name}
          className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  {item.name}
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {item.value}
                  </div>
                </dd>
                <dd className="mt-1">
                  <div className="text-sm text-gray-500">{item.subValue}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
