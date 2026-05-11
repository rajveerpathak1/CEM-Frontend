import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Calendar, Plus, Search } from "lucide-react";

import { eventsApi } from "../../api/events";

import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import { TableRowSkeleton } from "../../components/ui/Skeleton";

const ManageEventsPage = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  /* ==================== FETCH EVENTS ==================== */
  const { data, isLoading } = useQuery({
    queryKey: ["admin-events", search],

    queryFn: () =>
      eventsApi.getAdminEvents({
        page: 1,
        limit: 20,
        search,
      }),
  });

  /* ==================== DELETE ==================== */
  const deleteMutation = useMutation({
    mutationFn: (id: number) => eventsApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-events"],
      });
    },
  });

  /* ==================== PUBLISH ==================== */
  const publishMutation = useMutation({
    mutationFn: (id: number) => eventsApi.publish(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-events"],
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Events
          </h1>

          <p className="text-gray-600 mt-1">
            Create, edit, and delete campus events
          </p>
        </div>

        <Button
          onClick={() => navigate("/admin/create-event")}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Create Event
        </Button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                EVENT
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                DATE
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                STATUS
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                CAPACITY
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={5} />
              ))
            ) : !data?.data?.length ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState
                    icon={Calendar}
                    title="No events found"
                    description="Create your first event to get started."
                  />
                </td>
              </tr>
            ) : (
              data.data.map((event: any) => (
                <tr
                  key={event.id}
                  className="hover:bg-gray-50 transition"
                >
                  {/* EVENT */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {event.title}
                      </p>

                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {event.description}
                      </p>
                    </div>
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(
                      event.event_date
                    ).toLocaleDateString()}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        event.status === "published"
                          ? "success"
                          : event.status === "draft"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {event.status}
                    </Badge>
                  </td>

                  {/* CAPACITY */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {event.registered_count || 0}/
                    {event.capacity}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Publish */}
                      {event.status === "draft" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            publishMutation.mutate(event.id)
                          }
                        >
                          Publish
                        </Button>
                      )}

                      {/* Edit */}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/admin/events/${event.id}/edit`
                          )
                        }
                      >
                        Edit
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          deleteMutation.mutate(event.id)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEventsPage;