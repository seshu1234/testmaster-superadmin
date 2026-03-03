export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'teacher' | 'student';
  tenant_id: string;
  tenant_name?: string;
  status: 'active' | 'inactive' | 'suspended';
  last_login_at: string | null;
  created_at: string;
  email_verified_at: string | null;
  mfa_enabled: boolean;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  new_today: number;
  by_role: Record<string, number>;
}
