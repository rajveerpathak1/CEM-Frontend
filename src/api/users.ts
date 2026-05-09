import api from "./client";
import type { User } from "../types";

export const usersApi = {
  getAll: async () => {
    const res = await api.get("/super-admin/users");
    return res.data.data as User[];
  },

  updateRole: async (id: number, role: string) => {
    const res = await api.patch(`/super-admin/users/${id}/role`, {
      role,
    });

    return res.data.data;
  },

  delete: async (id: number) => {
    const res = await api.delete(`/super-admin/users/${id}`);
    return res.data;
  },
};