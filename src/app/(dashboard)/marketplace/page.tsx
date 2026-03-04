"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { 
  Search, 
  ShoppingBag, 
  Download,
  Loader2,
  Star,
  CheckCircle,
  XCircle,
  Zap,
  MoreVertical
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const queryClient = useQueryClient();
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
        .get("super-admin/marketplace", { params })
        .then((res) => res.data);
    },
  });

  const listings = response?.data || [];

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.get("super-admin/marketplace/categories").then((res) => res.data),
  });

  const categories = categoriesResponse?.data || [];

  const actionMutation = useMutation({
    mutationFn: ({ id, action }: { id: string, action: 'approve' | 'reject' | 'feature' }) => 
      apiClient.post(`super-admin/marketplace/${id}/${action}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });

  const getStatusBadge = (status: Listing['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none px-2 rounded-lg">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none px-2 rounded-lg">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-none px-2 rounded-lg">Rejected</Badge>;
      case 'featured':
        return <Badge className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-none px-2 rounded-lg animate-pulse">Featured</Badge>;
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
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground uppercase tracking-[0.1em]">Commercial Index</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">Approve and curate listing architectures for the global marketplace.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="rounded-xl bg-card border-none shadow-sm hover:bg-accent transition-all">
            <Link href="/marketplace/categories">Taxonomy</Link>
          </Button>
          <Button asChild className="rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Link href="/marketplace/pending">Review Queue</Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-[2rem] border-none shadow-sm bg-muted/20 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              placeholder="Search assets, blueprints & content..."
              className="pl-11 h-12 bg-card border-none shadow-inner rounded-2xl focus-visible:ring-primary/20 transition-all text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px] h-12 bg-card border-none shadow-inner rounded-2xl font-bold">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-xl">
              <SelectItem value="all">All Tiers</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px] h-12 bg-card border-none shadow-inner rounded-2xl font-bold">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-xl">
              <SelectItem value="all">Total Scope</SelectItem>
              <SelectItem value="approved">Verified Only</SelectItem>
              <SelectItem value="pending">Under Review</SelectItem>
              <SelectItem value="featured">Top Tiers</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-60" />
            <p className="text-xs font-black text-muted-foreground/60 animate-pulse tracking-widest uppercase">Initializing market stream...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {listings.length > 0 && listings.map((listing: Listing) => (
            <Card key={listing.id} className="group border-none bg-card shadow-sm hover:shadow-2xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-500 rounded-[2.5rem] overflow-hidden flex flex-col">
              <CardHeader className="pb-4 pt-8 px-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-black group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                      {listing.title}
                    </CardTitle>
                    <p className="text-[10px] font-black text-muted-foreground/50 flex items-center gap-1.5 uppercase tracking-[0.2em]">
                      <ShoppingBag className="h-3 w-3" />
                      {listing.tenant_name}
                    </p>
                  </div>
                  {getStatusBadge(listing.status)}
                </div>
              </CardHeader>
              <CardContent className="pb-8 px-8 flex-1">
                <p className="text-sm font-semibold text-muted-foreground/70 line-clamp-2 min-h-[40px] leading-relaxed italic">
                  "{listing.description}"
                </p>
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-2xl border border-muted-foreground/5">
                    <div className="flex items-center">
                      {renderStars(listing.rating)}
                    </div>
                    <span className="text-[10px] font-black text-foreground/80">
                      {listing.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                    <Download className="h-4 w-4" />
                    {listing.downloads.toLocaleString()}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 px-8 py-6 flex items-center justify-between border-t border-muted/20">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest leading-none mb-1">Price Point</span>
                  <span className="text-2xl font-black text-foreground tracking-tighter">
                    <span className="text-sm font-bold text-muted-foreground mr-0.5">$</span>
                    {listing.price}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-background shadow-sm border border-transparent hover:border-muted-foreground/10">
                            <MoreVertical className="h-4 w-4" />
                         </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[160px]">
                         <DropdownMenuItem 
                            className="rounded-xl flex items-center gap-3 font-bold text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer"
                            onClick={() => actionMutation.mutate({ id: listing.id, action: 'approve' })}
                         >
                            <CheckCircle className="h-4 w-4" /> Approve Listing
                         </DropdownMenuItem>
                         <DropdownMenuItem 
                            className="rounded-xl flex items-center gap-3 font-bold text-indigo-600 focus:text-indigo-700 focus:bg-indigo-50 cursor-pointer"
                            onClick={() => actionMutation.mutate({ id: listing.id, action: 'feature' })}
                         >
                            <Zap className="h-4 w-4" /> {listing.status === 'featured' ? 'Unfeature' : 'Feature Global'}
                         </DropdownMenuItem>
                         <DropdownMenuItem 
                            className="rounded-xl flex items-center gap-3 font-bold text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer"
                            onClick={() => actionMutation.mutate({ id: listing.id, action: 'reject' })}
                         >
                            <XCircle className="h-4 w-4" /> Reject Request
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                   <Button asChild className="rounded-xl h-10 px-5 font-bold shadow-md shadow-primary/10">
                      <Link href={`/marketplace/${listing.id}`}>Review</Link>
                   </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
          {listings.length === 0 && (
            <div className="col-span-full h-80 flex flex-col items-center justify-center bg-muted/10 rounded-[3rem] border-2 border-dashed border-muted-foreground/20 animate-in zoom-in duration-500">
               <div className="p-6 bg-muted/40 rounded-full mb-4">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
               </div>
               <p className="text-xl font-black text-muted-foreground/60 uppercase tracking-widest">Inventory Static</p>
               <p className="text-xs font-semibold text-muted-foreground/40 mt-1">No assets matched the current filter parameters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
