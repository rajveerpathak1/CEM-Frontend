import api from './client';
import type { User } from '../types';

interface UsersResponse {
  success: boolean;
  count: number;
  data: User[];
}

export const usersApi = {
  getAll: async () => {
    const response = await api.get<UsersResponse>('/super-admin/users');
    return response.data.data;
  },

  promote: async (id: string) => {
    const response = await api.patch(`/super-admin/users/${id}/promote`);
    return response.data;
  },

  demote: async (id: string) => {
    const response = await api.patch(`/super-admin/users/${id}/demote`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/super-admin/users/${id}`);
    return response.data;
  },
};