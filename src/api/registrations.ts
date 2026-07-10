import api from "./client";
import type { Registration } from "../types";

export const registrationsApi = {
  getAll: async () => {
    const res = await api.get("/admin/registrations");
    const data = res.data.data || [];
    return data.map((reg: any) => ({
      id: reg.registration_id,
      userName: reg.user_name,
      userEmail: reg.user_email,
      eventTitle: reg.event_title,
      eventDate: reg.event_date,
      registeredAt: reg.registered_at,
    })) as any[];
  },

  getMyRegistrations: async () => {
    const res = await api.get("/students/registrations");

    return res.data.data as Registration[];
  },
};