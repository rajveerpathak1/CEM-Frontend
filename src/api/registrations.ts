import api from './client';
import type { Registration, PaginatedResponse } from '../types';

export const registrationsApi = {
  getMyRegistrations: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Registration>>('/registrations/my', { params }).then((r) => r.data),

  getEventRegistrations: (eventId: string, params?: { page?: number; limit?: number }) =>
    api
      .get<PaginatedResponse<Registration>>(`/registrations/event/${eventId}`, { params })
      .then((r) => r.data),

  getAll: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Registration>>('/registrations', { params }).then((r) => r.data),
};
