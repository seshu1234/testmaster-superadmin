"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon, PlusIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { api } from "@/lib/api";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  description: string;
  tenant_name: string;
  price: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'featured';
  downloads: number;
  rating: number;
  reviews_count: number;
  created_at: string;
}

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const { data: listings, isLoading } = useQuery({
    queryKey: ["marketplace", search, category, status],
    queryFn: () =>
      api
        .get("/admin/marketplace", { params: { search, category, status } })
        .then((res) => res.data),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/admin/marketplace/categories").then((res) => res.data),
  });

  const getStatusColor = (status: Listing['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'featured':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      i < Math.floor(rating) ? (
        <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarIcon key={i} className="h-4 w-4 text-gray-300" />
      )
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Marketplace</h1>
        <div className="flex space-x-3">
          <Link
            href="/marketplace/categories"
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
          >
            Manage Categories
          </Link>
          <Link
            href="/marketplace/pending"
            className="inline-flex items-center rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700"
          >
            Pending Approvals
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings..."
            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories?.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          className="rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="featured">Featured</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings?.map((listing: Listing) => (
            <div key={listing.id} className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {listing.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      by {listing.tenant_name}
                    </p>
                  </div>
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {listing.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {renderStars(listing.rating)}
                    <span className="ml-1 text-sm text-gray-500">
                      ({listing.reviews_count})
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {listing.downloads} downloads
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ${listing.price}
                  </span>
                  <div className="flex space-x-2">
                    <Link
                      href={`/marketplace/${listing.id}`}
                      className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </Link>
                    <Link
                      href={`/marketplace/${listing.id}/edit`}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </Link>
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
