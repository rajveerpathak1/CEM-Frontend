import api from "./client";

import type {
  Event,
  PaginatedResponse,
  Registration,
} from "../types";

/* ================================================= */
/* RESPONSE TYPES */
/* ================================================= */

interface EventResponse {
  success: boolean;
  data: Event;
}

interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

/* ================================================= */
/* EVENTS API */
/* ================================================= */

export const eventsApi = {
  /* ---------------- GET ALL EVENTS ---------------- */

  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Event>> => {
    const response = await api.get<
      PaginatedResponse<Event>
    >("/events", {
      params,
    });

    return response.data;
  },


    /* ---------------- ADMIN GET ALL EVENTS ---------------- */

  getAdminEvents: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Event>> => {
    const response = await api.get<
      PaginatedResponse<Event>
    >("/admin/events", {
      params,
    });

    return response.data;
  },

  
  /* ---------------- GET SINGLE EVENT ---------------- */

  getById: async (
    id: string | number
  ): Promise<Event> => {
    const response = await api.get<EventResponse>(
      `/events/${id}`
    );

    return response.data.data;
  },

  /* ---------------- REGISTER ---------------- */

  register: async (
    id: string | number
  ): Promise<RegistrationResponse> => {
    const response =
      await api.post<RegistrationResponse>(
        `/events/${id}/register`
      );

    return response.data;
  },

  /* ---------------- UNREGISTER ---------------- */

  unregister: async (
    id: string | number
  ): Promise<RegistrationResponse> => {
    const response =
      await api.delete<RegistrationResponse>(
        `/events/${id}/unregister`
      );

    return response.data;
  },

  /* ================================================= */
  /* ADMIN EVENTS */
  /* ================================================= */

  /* ---------------- CREATE EVENT ---------------- */

  create: async (
    data: Partial<Event>
  ): Promise<Event> => {
    const response = await api.post<EventResponse>(
      "/admin/events",
      data
    );

    return response.data.data;
  },

  /* ---------------- UPDATE EVENT ---------------- */

  update: async (
    id: string | number,
    data: Partial<Event>
  ): Promise<Event> => {
    const response = await api.put<EventResponse>(
      `/admin/events/${id}`,
      data
    );

    return response.data.data;
  },

  /* ---------------- DELETE EVENT ---------------- */

  delete: async (
    id: string | number
  ): Promise<void> => {
    await api.delete(`/admin/events/${id}`);
  },

  /* ---------------- PUBLISH EVENT ---------------- */

  publish: async (
    id: string | number
  ) => {
    const response = await api.post(
      `/admin/events/${id}/publish`
    );

    return response.data;
  },

  /* ---------------- UNPUBLISH EVENT ---------------- */

  unpublish: async (
    id: string | number
  ) => {
    const response = await api.post(
      `/admin/events/${id}/unpublish`
    );

    return response.data;
  },

  /* ---------------- CANCEL EVENT ---------------- */

  cancel: async (
    id: string | number
  ) => {
    const response = await api.post(
      `/admin/events/${id}/cancel`
    );

    return response.data;
  },

  /* ================================================= */
  /* REGISTRATIONS */
  /* ================================================= */

  /* ---------------- MY REGISTRATIONS ---------------- */

  getMyRegistrations: async (): Promise<
    Registration[]
  > => {
    const response = await api.get<{
      success: boolean;
      data: Registration[];
    }>("/events/my-registrations");

    return response.data.data;
  },

  /* ---------------- ADMIN REGISTRATIONS ---------------- */

  getAllRegistrations: async (params?: {
    page?: number;
    limit?: number;
    eventId?: number;
  }): Promise<Registration[]> => {
    const response = await api.get<{
      success: boolean;
      data: Registration[];
    }>("/admin/registrations", {
      params,
    });

    return response.data.data;
  },
};