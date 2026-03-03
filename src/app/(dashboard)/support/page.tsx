"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TicketIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import Link from "next/link";

export default function SupportPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["support-stats"],
    queryFn: () => api.get("/admin/support/stats").then((res) => res.data),
  });

  const { data: recentTickets } = useQuery({
    queryKey: ["recent-tickets"],
    queryFn: () => api.get("/admin/support/tickets?limit=5").then((res) => res.data),
  });

  const metrics = [
    {
      name: "Open Tickets",
      value: stats?.open_tickets || 12,
      icon: TicketIcon,
      color: "bg-yellow-500",
      href: "/support/tickets?status=open",
    },
    {
      name: "Pending Response",
      value: stats?.pending_response || 8,
      icon: ChatBubbleLeftIcon,
      color: "bg-blue-500",
      href: "/support/tickets?status=pending",
    },
    {
      name: "Resolved Today",
      value: stats?.resolved_today || 23,
      icon: CheckCircleIcon,
      color: "bg-green-500",
      href: "/support/tickets?status=resolved",
    },
    {
      name: "Avg Response Time",
      value: stats?.avg_response_time || "2.5h",
      icon: ClockIcon,
      color: "bg-purple-500",
      href: "/support/analytics",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Support</h1>
        <div className="flex space-x-3">
          <Link
            href="/support/announcements"
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            <MegaphoneIcon className="mr-2 h-4 w-4" />
            Announcements
          </Link>
          <Link
            href="/support/faq"
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            <QuestionMarkCircleIcon className="mr-2 h-4 w-4" />
            FAQ
          </Link>
        </div>
      </div>

      {/* Metrics */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <Link
                key={metric.name}
                href={metric.href}
                className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow"
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
                          <div className="text-2xl font-semibold text-gray-900">
                            {metric.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Tickets */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Recent Tickets</h2>
                <Link
                  href="/support/tickets"
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  View All
                </Link>
              </div>
              <div className="mt-4">
                {recentTickets?.length > 0 ? (
                  <div className="space-y-4">
                    {recentTickets.map((ticket: any) => (
                      <div key={ticket.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {ticket.subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            {ticket.tenant_name} • {new Date(ticket.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No recent tickets</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              <div className="mt-4 space-y-3">
                <Link
                  href="/support/tickets/new"
                  className="flex w-full items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  <TicketIcon className="mr-2 h-4 w-4" />
                  Create Ticket
                </Link>
                <Link
                  href="/support/announcements/new"
                  className="flex w-full items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  <MegaphoneIcon className="mr-2 h-4 w-4" />
                  New Announcement
                </Link>
                <Link
                  href="/support/faq/new"
                  className="flex w-full items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  <QuestionMarkCircleIcon className="mr-2 h-4 w-4" />
                  Add FAQ
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
