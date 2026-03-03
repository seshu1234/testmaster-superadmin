"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ChartBarIcon,
  ClockIcon,
  ServerIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CpuChipIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import { useWebSocket } from "@/lib/hooks/useWebSocket";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  queue_size: number;
  failed_jobs: number;
  requests_per_minute: number;
  avg_response_time: number;
  uptime: number;
}

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const { socket, isConnected, lastMessage } = useWebSocket();

  const { data: initialMetrics } = useQuery({
    queryKey: ["system-metrics"],
    queryFn: () => api.get("/admin/monitoring/metrics").then((res) => res.data),
  });

  useEffect(() => {
    if (initialMetrics) {
      setMetrics(initialMetrics);
    }
  }, [initialMetrics]);

  useEffect(() => {
    if (socket) {
      socket.on("metrics:update", (data: SystemMetrics) => {
        setMetrics(data);
      });

      socket.emit("subscribe:metrics");

      return () => {
        socket.off("metrics:update");
        socket.emit("unsubscribe:metrics");
      };
    }
  }, [socket]);

  const { data: recentErrors } = useQuery({
    queryKey: ["recent-errors"],
    queryFn: () => api.get("/admin/monitoring/errors?limit=5").then((res) => res.data),
    refetchInterval: 30000,
  });

  const metricsCards = [
    {
      name: "CPU Usage",
      value: metrics?.cpu ? `${metrics.cpu}%` : "0%",
      icon: CpuChipIcon,
      color: metrics?.cpu && metrics.cpu > 80 ? "text-red-600" : "text-green-600",
      bgColor: metrics?.cpu && metrics.cpu > 80 ? "bg-red-100" : "bg-green-100",
    },
    {
      name: "Memory Usage",
      value: metrics?.memory ? `${metrics.memory}%` : "0%",
      icon: ServerIcon,
      color: metrics?.memory && metrics.memory > 80 ? "text-red-600" : "text-green-600",
      bgColor: metrics?.memory && metrics.memory > 80 ? "bg-red-100" : "bg-green-100",
    },
    {
      name: "Disk Usage",
      value: metrics?.disk ? `${metrics.disk}%` : "0%",
      icon: CircleStackIcon,
      color: metrics?.disk && metrics.disk > 85 ? "text-red-600" : "text-green-600",
      bgColor: metrics?.disk && metrics.disk > 85 ? "bg-red-100" : "bg-green-100",
    },
    {
      name: "Queue Size",
      value: metrics?.queue_size?.toString() || "0",
      icon: ClockIcon,
      color: metrics?.queue_size && metrics.queue_size > 100 ? "text-yellow-600" : "text-blue-600",
      bgColor: metrics?.queue_size && metrics.queue_size > 100 ? "bg-yellow-100" : "bg-blue-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">System Monitoring</h1>
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <span className={`mr-2 h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-500">
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
          </span>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            <ArrowPathIcon className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metricsCards.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md ${item.bgColor} p-3`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
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
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Requests per Minute</h2>
          <div className="mt-4 h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Chart will be displayed here</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Current RPM</p>
              <p className="text-xl font-semibold text-gray-900">
                {metrics?.requests_per_minute || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Response Time</p>
              <p className="text-xl font-semibold text-gray-900">
                {metrics?.avg_response_time || 0}ms
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">System Uptime</h2>
          <div className="mt-4 h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Chart will be displayed here</p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Uptime</p>
            <p className="text-xl font-semibold text-gray-900">
              {metrics?.uptime ? `${Math.floor(metrics.uptime / 24)} days` : '0 days'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Errors and Quick Links */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Errors</h2>
            <Link href="/monitoring/logs" className="text-sm text-indigo-600 hover:text-indigo-900">
              View All
            </Link>
          </div>
          <div className="mt-4">
            {recentErrors?.length > 0 ? (
              <div className="space-y-3">
                {recentErrors.map((error: any, idx: number) => (
                  <div key={idx} className="flex items-start space-x-3 rounded-md bg-red-50 p-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-red-800">{error.message}</p>
                      <p className="text-xs text-red-600">
                        {new Date(error.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent errors</p>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Quick Links</h2>
          <div className="mt-4 space-y-3">
            <Link
              href="/monitoring/logs"
              className="flex items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ChartBarIcon className="mr-3 h-5 w-5 text-gray-400" />
              Error Logs
            </Link>
            <Link
              href="/monitoring/queue"
              className="flex items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ClockIcon className="mr-3 h-5 w-5 text-gray-400" />
              Queue Management
            </Link>
            <Link
              href="/monitoring/webhooks"
              className="flex items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ArrowPathIcon className="mr-3 h-5 w-5 text-gray-400" />
              Webhook Deliveries
            </Link>
            <Link
              href="/monitoring/database"
              className="flex items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <CircleStackIcon className="mr-3 h-5 w-5 text-gray-400" />
              Database Performance
            </Link>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700">System Alerts</h3>
            <div className="mt-2">
              {metrics?.failed_jobs && metrics.failed_jobs > 0 ? (
                <div className="rounded-md bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-800">
                    {metrics.failed_jobs} failed jobs need attention
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No active alerts</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
