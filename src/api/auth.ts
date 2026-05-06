import api from './client';
import type { User } from '../types';

export const authApi = {
  getMe: () => api.get<User>('/auth/me').then((r) => r.data),

  login: (email: string, password: string) =>
    api.post<User>('/auth/login', { email, password }).then((r) => r.data),

  signup: (name: string, email: string, password: string) =>
    api.post<User>('/auth/signup', { name, email, password }).then((r) => r.data),

  logout: () => api.post('/auth/logout').then((r) => r.data),
};
