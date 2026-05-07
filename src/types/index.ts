export type Role =
  | "student"
  | "admin"
  | "super-admin";

/* ================================================= */
/* USER */
/* ================================================= */

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

/* ================================================= */
/* EVENT */
/* ================================================= */

export interface Event {
  id: number;

  title: string;
  description: string;

  event_date: string;

  capacity: number;

  status:
    | "draft"
    | "published"
    | "cancelled";

  registeredCount?: number;

  isRegistered?: boolean;
}

/* ================================================= */
/* REGISTRATION */
/* ================================================= */

export interface Registration {
  registration_id: number;

  registered_at: string;

  event_id: number;
  event_title: string;

  event_date: string;

  event_status: string;

  user_id?: number;
  user_name?: string;
  user_email?: string;
}

/* ================================================= */
/* API RESPONSE */
/* ================================================= */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/* ================================================= */
/* PAGINATION */
/* ================================================= */

export interface PaginatedResponse<T> {
  success: boolean;

  data: T[];

  total: number;

  page: number;

  limit: number;

  count: number;
}

/* ================================================= */
/* DASHBOARD */
/* ================================================= */

export interface DashboardMetrics {
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  totalUsers: number;
}