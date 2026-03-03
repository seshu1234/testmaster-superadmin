"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, XMarkIcon, EyeIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";

export default function PendingApprovalsPage() {
  const [selectedListing, setSelectedListing] = useState(null);
  const queryClient = useQueryClient();

  const { data: pendingListings, isLoading } = useQuery({
    queryKey: ["pending-listings"],
    queryFn: () => api.get("/admin/marketplace/pending").then((res) => res.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.post(`/admin/marketplace/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-listings"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
      setSelectedListing(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.post(`/admin/marketplace/${id}/reject`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-listings"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
      setSelectedListing(null);
    },
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Pending Approvals</h1>
        <Link
          href="/marketplace"
          className="text-sm text-indigo-600 hover:text-indigo-900"
        >
          Back to Marketplace
        </Link>
      </div>

      {pendingListings?.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <CheckIcon className="mx-auto h-12 w-12 text-green-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">All caught up!</h3>
          <p className="mt-2 text-sm text-gray-500">
            No pending listings require approval.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingListings?.map((listing: any) => (
            <div key={listing.id} className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {listing.title}
                    </h3>
                    <span className="ml-3 inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
                      Pending Review
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Submitted by {listing.tenant_name} • {listing.category}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {listing.description}
                  </p>
                  <div className="mt-4 flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">
                      Price: ${listing.price}
                    </span>
                    <span className="text-gray-500">
                      Submitted: {new Date(listing.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={() => setSelectedListing(listing)}
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
                  >
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Review Listing
                </h3>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900">{selectedListing.title}</h4>
                  <p className="mt-2 text-sm text-gray-500">
                    {selectedListing.description}
                  </p>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none sm:text-sm"
                      placeholder="Enter reason for rejection..."
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => approveMutation.mutate(selectedListing.id)}
                  className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                >
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => rejectMutation.mutate({ id: selectedListing.id, reason: "Test" })}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:mt-0 sm:w-auto"
                >
                  <XMarkIcon className="mr-2 h-4 w-4" />
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedListing(null)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
