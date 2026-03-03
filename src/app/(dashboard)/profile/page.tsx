"use client";

import { useQuery } from "@tanstack/react-query";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  KeyIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/admin/profile").then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <Link
          href="/profile/edit"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <PencilIcon className="mr-2 h-4 w-4" />
          Edit Profile
        </Link>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow">
          <div className="flex items-start space-x-4">
            <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600">
                {profile?.name?.charAt(0) || user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile?.name || user?.name}
              </h2>
              <p className="text-gray-500">{profile?.email || user?.email}</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800">
                  Super Admin
                </span>
                <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <div className="mt-1 flex items-center">
                <EnvelopeIcon className="mr-2 h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">
                  {profile?.email || user?.email}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <div className="mt-1 flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(profile?.created_at || new Date())}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <div className="mt-1 flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">
                  {profile?.last_login_at ? formatDate(profile.last_login_at) : 'Today'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">MFA Status</p>
              <div className="mt-1 flex items-center">
                <ShieldCheckIcon className="mr-2 h-4 w-4 text-green-500" />
                <p className="text-sm font-medium text-gray-900">
                  {profile?.mfa_enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <div className="mt-4 space-y-3">
            <Link
              href="/profile/security"
              className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ShieldCheckIcon className="mr-3 h-5 w-5 text-gray-400" />
              Security Settings
            </Link>
            <Link
              href="/profile/api-keys"
              className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <KeyIcon className="mr-3 h-5 w-5 text-gray-400" />
              API Keys
            </Link>
            <Link
              href="/profile/activity"
              className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
              Activity Log
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <div className="mt-4 flow-root">
          <ul className="-mb-8">
            <li className="relative pb-8">
              <div className="relative flex space-x-3">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      Two-factor authentication was enabled
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime="2024-01-15">2 days ago</time>
                  </div>
                </div>
              </div>
            </li>
            <li className="relative pb-8">
              <div className="relative flex space-x-3">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <KeyIcon className="h-4 w-4 text-green-600" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      New API key was generated
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime="2024-01-14">3 days ago</time>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
