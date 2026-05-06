import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClipboardList, Calendar, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { registrationsApi, eventsApi } from '../../api';
import { Pagination, EmptyState, Badge } from '../../components/ui';

export default function MyRegistrationsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-registrations', page],
    queryFn: () => registrationsApi.getMyRegistrations({ page, limit: 10 }),
  });

  const unregisterMutation = useMutation({
    mutationFn: (eventId: string) => eventsApi.unregister(eventId),
    onSuccess: () => {
      toast.success('Unregistered successfully');
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to unregister'),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No registrations yet"
        description="Browse events and register to attend campus activities."
        action={{ label: 'Browse Events', onClick: () => {} }}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Registrations</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your event registrations</p>
      </div>

      <div className="space-y-3">
        {data.data.map((reg) => {
          const eventDate = new Date(reg.eventDate);
          const isPast = eventDate < new Date();

          return (
            <div
              key={reg.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 hover:border-gray-300 transition-colors"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/events/${reg.eventId}`}
                  className="text-sm font-semibold text-gray-900 hover:text-emerald-700 transition-colors"
                >
                  {reg.eventTitle}
                </Link>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">
                    {eventDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <Badge variant={isPast ? 'default' : 'success'}>
                    {isPast ? 'Past' : 'Upcoming'}
                  </Badge>
                </div>
              </div>
              {!isPast && (
                <button
                  onClick={() => unregisterMutation.mutate(reg.eventId)}
                  disabled={unregisterMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Cancel
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
