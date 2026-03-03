"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Cog6ToothIcon,
  FlagIcon,
  KeyIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  ArchiveBoxIcon,
  PaintBrushIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import Link from "next/link";

interface SettingsGroup {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}

const settingsGroups: SettingsGroup[] = [
  {
    title: "General",
    description: "Platform name, logo, branding, and regional settings",
    icon: Cog6ToothIcon,
    href: "/settings/general",
    color: "bg-blue-500",
  },
  {
    title: "Feature Flags",
    description: "Enable/disable platform features and A/B testing",
    icon: FlagIcon,
    href: "/settings/features",
    color: "bg-purple-500",
  },
  {
    title: "API Settings",
    description: "API keys, rate limiting, and webhook configuration",
    icon: KeyIcon,
    href: "/settings/api",
    color: "bg-green-500",
  },
  {
    title: "Security",
    description: "Authentication, MFA, password policies, and IP whitelisting",
    icon: ShieldCheckIcon,
    href: "/settings/security",
    color: "bg-red-500",
  },
  {
    title: "Email",
    description: "SMTP settings, email templates, and notifications",
    icon: EnvelopeIcon,
    href: "/settings/email",
    color: "bg-yellow-500",
  },
  {
    title: "Backup",
    description: "Database backups, restore points, and retention policies",
    icon: ArchiveBoxIcon,
    href: "/settings/backup",
    color: "bg-indigo-500",
  },
  {
    title: "Branding",
    description: "Custom CSS, themes, and white-labeling options",
    icon: PaintBrushIcon,
    href: "/settings/branding",
    color: "bg-pink-500",
  },
  {
    title: "Localization",
    description: "Languages, timezone, currency, and date formats",
    icon: GlobeAltIcon,
    href: "/settings/localization",
    color: "bg-teal-500",
  },
];

export default function SettingsPage() {
  const { data: stats } = useQuery({
    queryKey: ["settings-stats"],
    queryFn: () => api.get("/admin/settings/stats").then((res) => res.data),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure platform-wide settings and preferences
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active Features</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {stats?.active_features || 12}
          </dd>
        </div>
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">API Keys</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {stats?.api_keys || 8}
          </dd>
        </div>
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Email Templates</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {stats?.email_templates || 15}
          </dd>
        </div>
        <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Last Backup</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {stats?.last_backup || '2h ago'}
          </dd>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {settingsGroups.map((group) => (
          <Link
            key={group.title}
            href={group.href}
            className="group relative rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow"
          >
            <div className={`absolute top-0 right-0 h-20 w-20 -translate-y-8 translate-x-8 transform rounded-full ${group.color} opacity-10`} />
            <div className={`inline-flex rounded-lg ${group.color} p-3 text-white`}>
              <group.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 group-hover:text-indigo-600">
              {group.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {group.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Audit Log Summary */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Recent Configuration Changes</h2>
        <div className="mt-4 flow-root">
          <ul className="-mb-8">
            <li className="relative pb-8">
              <div className="relative flex space-x-3">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <Cog6ToothIcon className="h-4 w-4 text-blue-600" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      Feature flag <span className="font-medium text-gray-900">AI Grading</span> enabled for all tenants
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime="2024-01-15">2 hours ago</time>
                  </div>
                </div>
              </div>
            </li>
            <li className="relative pb-8">
              <div className="relative flex space-x-3">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                    <KeyIcon className="h-4 w-4 text-yellow-600" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      New API key generated for <span className="font-medium text-gray-900">Acme Corp</span>
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime="2024-01-15">5 hours ago</time>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="mt-4">
          <Link
            href="/audit-logs"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all audit logs →
          </Link>
        </div>
      </div>
    </div>
  );
}
