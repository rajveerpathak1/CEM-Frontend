export type Role = 'student' | 'admin' | 'super-admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  registeredCount: number;
  image?: string;
  organizerId: string;
  organizerName: string;
  createdAt: string;
  isRegistered?: boolean;
}

export interface Registration {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  registeredAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DashboardMetrics {
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  totalUsers: number;
}
