"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import Link from "next/link";

interface Webhook {
  id: string;
  name: string;
  url: string;
  tenant_name: string;
  events: string[];
  status: 'active' | 'inactive' | 'failing';
  last_delivery_at: string | null;
  last_delivery_status: 'success' | 'failed' | null;
  created_at: string;
}

export default function WebhooksPage() {
  const [tenant, setTenant] = useState("all");

  const { data: webhooks, isLoading } = useQuery({
    queryKey: ["webhooks", tenant],
    queryFn: () =>
      api
        .get("/admin/webhooks", { params: { tenant } })
        .then((res) => res.data),
  });

  const { data: tenants } = useQuery({
    queryKey: ["tenants-list"],
    queryFn: () => api.get("/admin/tenants?limit=100").then((res) => res.data),
  });

  const { data: stats } = useQuery({
    queryKey: ["webhook-stats"],
    queryFn: () => api.get("/admin/webhooks/stats").then((res) => res.data),
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'inactive':
        return <XCircleIcon className="h-5 w-5 text-gray-400" />;
      case 'failing':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Webhook['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'failing':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Webhooks</h1>
        <Link
          href="/webhooks/create"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Create Webhook
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Endpoints</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {stats?.total || 0}
          </dd>
        </div>
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">
            {stats?.active || 0}
          </dd>
        </div>
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Failing</dt>
          <dd className="mt-1 text-3xl font-semibold text-red-600">
            {stats?.failing || 0}
          </dd>
        </div>
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Deliveries (24h)</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {stats?.deliveries_24h || 0}
          </dd>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-end">
        <select
          className="rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
          value={tenant}
          onChange={(e) => setTenant(e.target.value)}
        >
          <option value="all">All Tenants</option>
          {tenants?.map((t: any) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Webhooks Table */}
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Events
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {webhooks?.map((webhook: Webhook) => (
                <tr key={webhook.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(webhook.status)}
                      <span className={`ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(webhook.status)}`}>
                        {webhook.status}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {webhook.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {webhook.url}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{webhook.tenant_name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.slice(0, 2).map((event) => (
                        <span
                          key={event}
                          className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800"
                        >
                          {event}
                        </span>
                      ))}
                      {webhook.events.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{webhook.events.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {webhook.last_delivery_at ? (
                      <div className="flex items-center">
                        <ClockIcon className="mr-1 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(webhook.last_delivery_at).toLocaleString()}
                        </span>
                        {webhook.last_delivery_status === 'success' ? (
                          <CheckCircleIcon className="ml-2 h-4 w-4 text-green-500" />
                        ) : webhook.last_delivery_status === 'failed' ? (
                          <XCircleIcon className="ml-2 h-4 w-4 text-red-500" />
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Never</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <Link
                      href={`/webhooks/${webhook.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      View
                    </Link>
                    <Link
                      href={`/webhooks/deliveries?webhook=${webhook.id}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Deliveries
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Link to Deliveries */}
      <div className="flex justify-end">
        <Link
          href="/webhooks/deliveries"
          className="text-sm text-indigo-600 hover:text-indigo-900"
        >
          View All Deliveries →
        </Link>
      </div>
    </div>
  );
}
