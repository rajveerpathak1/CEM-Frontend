import api from './client';
import type { Event, PaginatedResponse } from '../types';

export const eventsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; category?: string }) =>
    api.get<PaginatedResponse<Event>>('/events', { params }).then((r) => r.data),

  getById: (id: string) => api.get<Event>(`/events/${id}`).then((r) => r.data),

  create: (data: Partial<Event>) => api.post<Event>('/events', data).then((r) => r.data),

  update: (id: string, data: Partial<Event>) =>
    api.put<Event>(`/events/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/events/${id}`).then((r) => r.data),

  register: (id: string) => api.post(`/events/${id}/register`).then((r) => r.data),

  unregister: (id: string) => api.delete(`/events/${id}/register`).then((r) => r.data),
};
