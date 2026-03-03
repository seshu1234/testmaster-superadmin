export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  tenant_id: string;
  tenant_name: string;
  price: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'featured';
  downloads: number;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface PendingListing {
  id: string;
  title: string;
  tenant_name: string;
  submitted_at: string;
  category: string;
  requires_review: boolean;
}
