"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { 
  EnvelopeIcon, 
  CalendarIcon, 
  ShieldCheckIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  KeyIcon,
  NoSymbolIcon
} from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.get(`/admin/users/${userId}`).then((res) => res.data),
  });

  const { data: activity } = useQuery({
    queryKey: ["user-activity", userId],
    queryFn: () => api.get(`/admin/users/${userId}/activity`).then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/users"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back to Users
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`/users/${userId}/edit`}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit User
          </Link>
          <button className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* User Info Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="col-span-2 rounded-lg bg-white p-6 shadow">
          <div className="flex items-start space-x-4">
            <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-2xl font-medium text-indigo-600">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.status}
                </span>
                <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6">
            <div>
              <p className="text-sm text-gray-500">Tenant</p>
              <p className="font-medium">{user.tenant_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="font-medium">
                {user.last_login_at ? formatDate(user.last_login_at) : 'Never'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">{formatDate(user.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Verified</p>
              <p className="font-medium">
                {user.email_verified_at ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <div className="mt-4 space-y-3">
            <button className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <EnvelopeIcon className="mr-3 h-5 w-5 text-gray-400" />
              Send Email
            </button>
            <button className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <KeyIcon className="mr-3 h-5 w-5 text-gray-400" />
              Reset Password
            </button>
            <button className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <ShieldCheckIcon className="mr-3 h-5 w-5 text-gray-400" />
              Enable MFA
            </button>
            <button className="flex w-full items-center rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50">
              <NoSymbolIcon className="mr-3 h-5 w-5" />
              Suspend User
            </button>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <div className="mt-4">
          {activity?.length > 0 ? (
            <div className="flow-root">
              <ul className="-mb-8">
                {activity.map((item: any, idx: number) => (
                  <li key={idx}>
                    <div className="relative pb-8">
                      {idx !== activity.length - 1 && (
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={item.created_at}>
                              {formatDate(item.created_at)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
