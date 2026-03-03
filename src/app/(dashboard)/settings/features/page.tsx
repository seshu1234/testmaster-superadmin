"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FlagIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import Link from "next/link";

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  enabled_for_all: boolean;
  enabled_tenants: string[];
  enabled_percentage: number | null;
  type: 'boolean' | 'percentage' | 'tenant_list';
  created_at: string;
  updated_at: string;
}

export default function FeatureFlagsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const queryClient = useQueryClient();

  const { data: flags, isLoading } = useQuery({
    queryKey: ["feature-flags"],
    queryFn: () => api.get("/admin/settings/features").then((res) => res.data),
  });

  const { data: tenants } = useQuery({
    queryKey: ["tenants-list"],
    queryFn: () => api.get("/admin/tenants?limit=100").then((res) => res.data),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      api.patch(`/admin/settings/features/${id}`, { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/settings/features/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Feature Flags</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enable/disable features and control rollout
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          New Feature Flag
        </button>
      </div>

      {/* Flags List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {flags?.map((flag: FeatureFlag) => (
            <div
              key={flag.id}
              className="rounded-lg bg-white p-6 shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <FlagIcon className={`h-5 w-5 ${flag.enabled ? 'text-green-500' : 'text-gray-400'}`} />
                    <h3 className="ml-2 text-lg font-medium text-gray-900">
                      {flag.name}
                    </h3>
                    <span className="ml-3 text-sm text-gray-500">
                      ({flag.key})
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {flag.description}
                  </p>
                  
                  <div className="mt-4 flex items-center space-x-4">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={flag.enabled}
                        onChange={(e) => toggleMutation.mutate({ id: flag.id, enabled: e.target.checked })}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>

                    {flag.type === 'percentage' && (
                      <span className="text-sm text-gray-600">
                        Rollout: {flag.enabled_percentage}%
                      </span>
                    )}

                    {flag.type === 'tenant_list' && !flag.enabled_for_all && (
                      <span className="text-sm text-gray-600">
                        Enabled for {flag.enabled_tenants.length} tenants
                      </span>
                    )}

                    {flag.enabled_for_all && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        <GlobeAltIcon className="mr-1 h-3 w-3" />
                        All Tenants
                      </span>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex items-start space-x-2">
                  <button
                    onClick={() => setEditingFlag(flag)}
                    className="rounded-md p-2 text-gray-400 hover:text-gray-500"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(flag.id)}
                    className="rounded-md p-2 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal would go here - simplified for brevity */}
    </div>
  );
}
