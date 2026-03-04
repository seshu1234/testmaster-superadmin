"use client";

import {
  BuildingOfficeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface StatsCardsProps {
  data?: {
    mrr: number;
    arr: number;
    churn_rate: number;
    total_tenants: number;
    active_tenants: number;
    at_risk_tenants: number;
  };
}

export function StatsCards({ data }: StatsCardsProps) {
  const stats = [
    {
      name: "Monthly Revenue (MRR)",
      value: data?.mrr ? `₹${data.mrr.toLocaleString()}` : "₹0",
      subValue: `Yearly: ₹${(data?.arr || 0).toLocaleString()}`,
      icon: CurrencyDollarIcon,
    },
    {
      name: "Total Tenants",
      value: data?.total_tenants || 0,
      subValue: `${data?.active_tenants || 0} active centre(s)`,
      icon: BuildingOfficeIcon,
    },
    {
      name: "Churn Rate",
      value: data?.churn_rate ? `${data.churn_rate}%` : "0%",
      subValue: "monthly average",
      icon: ChartBarIcon,
    },
    {
      name: "At Risk Tenants",
      value: data?.at_risk_tenants || 0,
      subValue: "expiring in <3 days",
      icon: UsersIcon,
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
