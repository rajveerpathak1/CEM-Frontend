import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Shield, Search } from "lucide-react";

import { usersApi } from "../../api/users";
import type { User } from "../../types";

export default function RolesPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getAll,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({
      id,
      role,
    }: {
      id: number;
      role: "admin" | "student";
    }) => usersApi.updateRole(id, role),

    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update role");
    },
  });

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u: User) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  if (isLoading) {
    return (
      <div className="p-6 text-gray-600">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Role Management
        </h1>

        <p className="mt-2 text-gray-600">
          Promote or demote users between roles
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 outline-none focus:border-emerald-500"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                User
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Current Role
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-16 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Shield className="h-12 w-12 text-gray-300" />

                    <p className="text-lg font-medium">
                      No users found
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user: User) => (
                <tr key={user.id}>
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-emerald-100 text-emerald-700"
                          : user.role === "super-admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    {user.role !== "super-admin" && (
                      <button
                        onClick={() =>
                          updateRoleMutation.mutate({
                            id: user.id,
                            role:
                              user.role === "student"
                                ? "admin"
                                : "student",
                          })
                        }
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                      >
                        {user.role === "student"
                          ? "Promote"
                          : "Demote"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}