"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { 
  Search, 
  ShoppingBag, 
  Download,
  Loader2,
  Star
} from "lucide-react";
import apiClient from "@/lib/api/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

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

  const { data: response, isLoading } = useQuery({
    queryKey: ["marketplace", search, category, status],
    queryFn: () => {
      const params: any = { search };
      if (category !== 'all') params.category = category;
      if (status !== 'all') params.status = status;
      
      return apiClient
        .get("/super-admin/marketplace", { params })
        .then((res) => res.data);
    },
  });

  const listings = response?.data || [];

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.get("/super-admin/marketplace/categories").then((res) => res.data),
  });

  const categories = categoriesResponse?.data || [];

  const getStatusBadge = (status: Listing['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none px-2 rounded-lg">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none px-2 rounded-lg">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-none px-2 rounded-lg">Rejected</Badge>;
      case 'featured':
        return <Badge className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-none px-2 rounded-lg">Featured</Badge>;
      default:
        return <Badge variant="outline" className="px-2 rounded-lg">{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={cn(
          "h-3 w-3",
          i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"
        )} 
      />
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Marketplace</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">Approve and manage listings from the global marketplace.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="rounded-xl bg-card border-none shadow-sm hover:bg-accent transition-all">
            <Link href="/marketplace/categories">Categories</Link>
          </Button>
          <Button asChild className="rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Link href="/marketplace/pending">Pending Approvals</Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder="Search listings..."
            className="pl-11 h-12 bg-card border-none shadow-sm rounded-2xl focus-visible:ring-primary/20 transition-all text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px] h-12 bg-card border-none shadow-sm rounded-2xl font-medium">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-none shadow-xl">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px] h-12 bg-card border-none shadow-sm rounded-2xl font-medium">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-none shadow-xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved Only</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="featured">Featured Hits</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="flex h-80 items-center justify-center rounded-3xl bg-card/50 backdrop-blur-sm shadow-sm border border-border/5">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-80" />
            <p className="text-sm font-semibold text-muted-foreground animate-pulse tracking-wide uppercase">Syncing marketplace...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.length > 0 && listings.map((listing: Listing) => (
            <Card key={listing.id} className="group border-none bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-[32px] overflow-hidden">
              <CardHeader className="pb-4 pt-7 px-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                      {listing.title}
                    </CardTitle>
                    <p className="text-xs font-bold text-muted-foreground/60 flex items-center gap-1.5 uppercase tracking-wider">
                      <ShoppingBag className="h-3 w-3" />
                      {listing.tenant_name}
                    </p>
                  </div>
                  {getStatusBadge(listing.status)}
                </div>
              </CardHeader>
              <CardContent className="pb-7 px-7">
                <p className="text-sm font-medium text-muted-foreground/80 line-clamp-2 min-h-[40px] leading-relaxed">
                  {listing.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-accent/50 px-2.5 py-1 rounded-full">
                    <div className="flex items-center">
                      {renderStars(listing.rating)}
                    </div>
                    <span className="text-[10px] font-black text-foreground/70">
                      {listing.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.1em]">
                    <Download className="h-3.5 w-3.5" />
                    {listing.downloads.toLocaleString()}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 px-7 py-5 flex items-center justify-between border-t border-border/5">
                <span className="text-2xl font-black text-foreground tracking-tight">
                  <span className="text-sm font-bold text-muted-foreground mr-0.5">$</span>
                  {listing.price}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild className="rounded-xl h-9 px-4 text-xs font-bold text-primary hover:bg-primary/10 transition-colors">
                    <Link href={`/marketplace/${listing.id}`}>Review</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="rounded-xl h-9 px-4 text-xs font-bold text-muted-foreground hover:bg-foreground hover:text-background transition-all">
                    <Link href={`/marketplace/${listing.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
          {listings.length === 0 && (
            <div className="col-span-full h-80 flex flex-col items-center justify-center bg-card rounded-[40px] shadow-sm border-2 border-dashed border-border/40 animate-in zoom-in duration-500">
               <ShoppingBag className="h-12 w-12 text-muted-foreground/20 mb-4" />
               <p className="text-base font-bold text-muted-foreground/60">No listings found matching your search</p>
               <p className="text-xs font-medium text-muted-foreground/40 mt-1">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
