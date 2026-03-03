import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Tenant, CreateTenantData, UpdateTenantData } from "@/lib/types/tenant";

export function useTenants(filters?: any) {
  return useQuery({
    queryKey: ["tenants", filters],
    queryFn: () => api.get("/admin/tenants", { params: filters }).then((res) => res.data),
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: ["tenant", id],
    queryFn: () => api.get(`/admin/tenants/${id}`).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTenantData) => api.post("/admin/tenants", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateTenantData) =>
      api.put(`/admin/tenants/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", variables.id] });
    },
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/tenants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
}

export function useImpersonateTenant() {
  return useMutation({
    mutationFn: (tenantId: string) =>
      api.post(`/admin/tenants/${tenantId}/impersonate`),
  });
}
