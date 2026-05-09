import api from "./client";
import type { Registration } from "../types";

export const registrationsApi = {
  getAll: async () => {
    const res = await api.get("/admin/registrations");

    return res.data.data as Registration[];
  },

  getMyRegistrations: async () => {
    const res = await api.get("/students/registrations");

    return res.data.data as Registration[];
  },
};