import api from './client';
import type { User, PaginatedResponse } from '../types';

export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResponse<User>>('/users', { params }).then((r) => r.data),

  updateRole: (id: string, role: string) =>
    api.put<User>(`/users/${id}/role`, { role }).then((r) => r.data),

  delete: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
};
