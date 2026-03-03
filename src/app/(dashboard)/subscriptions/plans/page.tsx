"use client";

import { useQuery } from "@tanstack/react-query";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  features: string[];
  student_limit: number;
  test_limit: number;
  ai_grading: boolean;
  api_access: boolean;
  custom_branding: boolean;
  is_active: boolean;
  subscriber_count: number;
  created_at: string;
}

export default function PlansPage() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: () => api.get("/admin/subscriptions/plans").then((res) => res.data),
  });

  const { data: stats } = useQuery({
    queryKey: ["plan-stats"],
    queryFn: () => api.get("/admin/subscriptions/plans/stats").then((res) => res.data),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pricing Plans</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage subscription plans and features
          </p>
        </div>
        <Link
          href="/subscriptions/plans/create"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Create Plan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Plans</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats?.total_plans || 0}</dd>
        </div>
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active Plans</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">{stats?.active_plans || 0}</dd>
        </div>
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Subscribers</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats?.total_subscribers || 0}</dd>
        </div>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {plans?.map((plan: Plan) => (
            <div
              key={plan.id}
              className={`relative rounded-lg bg-white shadow ${
                !plan.is_active ? 'opacity-75' : ''
              }`}
            >
              {plan.is_active ? (
                <div className="absolute top-0 right-0 mt-4 mr-4">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Active
                  </span>
                </div>
              ) : (
                <div className="absolute top-0 right-0 mt-4 mr-4">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    Inactive
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

                <div className="mt-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatCurrency(plan.price_monthly)}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">/month</span>
                  </div>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-lg font-semibold text-gray-700">
                      {formatCurrency(plan.price_annual)}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">/year (save {Math.round((1 - plan.price_annual/(plan.price_monthly*12)) * 100)}%)</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900">Features</h4>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">•</span>
                      Up to {plan.student_limit} students
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">•</span>
                      {plan.test_limit} tests per month
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">•</span>
                      AI Grading: {plan.ai_grading ? 'Yes' : 'No'}
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">•</span>
                      API Access: {plan.api_access ? 'Yes' : 'No'}
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">•</span>
                      Custom Branding: {plan.custom_branding ? 'Yes' : 'No'}
                    </li>
                  </ul>
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <div className="text-sm text-gray-500">
                    {plan.subscriber_count} subscribers
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/subscriptions/plans/${plan.id}/edit`}
                      className="rounded-md p-2 text-gray-400 hover:text-gray-500"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      className="rounded-md p-2 text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
