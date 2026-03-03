export interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'suspended' | 'pending' | 'inactive';
  plan: string;
  users_count: number;
  created_at: string;
  updated_at: string;
  subscription_ends_at: string | null;
  settings: Record<string, any>;
}

export interface TenantStats {
  total_tenants: number;
  active_tenants: number;
  suspended_tenants: number;
  pending_tenants: number;
}

export interface CreateTenantData {
  name: string;
  domain: string;
  plan: string;
  admin_email: string;
  admin_password: string;
  settings?: Record<string, any>;
}

export interface UpdateTenantData {
  name?: string;
  status?: Tenant['status'];
  plan?: string;
  settings?: Record<string, any>;
}
