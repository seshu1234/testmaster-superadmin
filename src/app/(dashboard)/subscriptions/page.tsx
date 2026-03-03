"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";

interface Subscription {
  id: string;
  tenant_id: string;
  tenant_name: string;
  plan_id: string;
  plan_name: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  created_at: string;
}

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions", search, status, plan],
    queryFn: () =>
      api
        .get("/admin/subscriptions", { params: { search, status, plan_id: plan } })
        .then((res) => res.data),
  });

  const { data: plans } = useQuery({
    queryKey: ["plans-list"],
    queryFn: () => api.get("/admin/subscriptions/plans").then((res) => res.data),
  });

  const { data: stats } = useQuery({
    queryKey: ["subscription-stats"],
    queryFn: () => api.get("/admin/subscriptions/stats").then((res) => res.data),
  });

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'incomplete':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'past_due':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'canceled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Subscriptions</h1>
        <Link
          href="/subscriptions/plans"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <CurrencyDollarIcon className="mr-2 h-5 w-5" />
          Manage Plans
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Monthly Recurring Revenue</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {formatCurrency(stats?.mrr || 0)}
          </dd>
          <dd className="mt-2 text-sm text-green-600">↑ {stats?.mrr_growth || 0}% from last month</dd>
        </div>
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active Subscriptions</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {stats?.active_subscriptions || 0}
          </dd>
        </div>
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Churn Rate</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {stats?.churn_rate || 0}%
          </dd>
        </div>
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Past Due</dt>
          <dd className="mt-1 text-3xl font-semibold text-yellow-600">
            {stats?.past_due || 0}
          </dd>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by tenant..."
            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="past_due">Past Due</option>
          <option value="trialing">Trialing</option>
          <option value="canceled">Canceled</option>
          <option value="incomplete">Incomplete</option>
        </select>

        <select
          className="rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        >
          <option value="all">All Plans</option>
          {plans?.map((p: any) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Subscriptions Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {subscriptions?.map((sub: Subscription) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {sub.tenant_name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{sub.plan_name}</div>
                    <div className="text-xs text-gray-500 capitalize">{sub.interval}ly</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(sub.status)}
                      <span className={`ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(sub.status)}`}>
                        {sub.status.replace('_', ' ')}
                      </span>
                      {sub.cancel_at_period_end && (
                        <span className="ml-2 text-xs text-gray-500">(cancels at period end)</span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(sub.amount)}/{sub.interval === 'month' ? 'mo' : 'yr'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-xs text-gray-500">
                      {formatDate(sub.current_period_start)} - {formatDate(sub.current_period_end)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {formatDate(sub.created_at)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <Link
                      href={`/subscriptions/${sub.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      View
                    </Link>
                    <Link
                      href={`/subscriptions/${sub.id}/edit`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
