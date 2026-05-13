import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  ArrowLeft,
} from 'lucide-react';

import toast from 'react-hot-toast';

import { eventsApi } from '../../api';

import {
  Button,
  Badge,
  EmptyState,
} from '../../components/ui';

export default function EventDetailsPage() {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getById(id!),
    enabled: !!id,
  });

  const registerMutation = useMutation({
    mutationFn: () => eventsApi.register(id!),

    onSuccess: () => {
      toast.success('Registered successfully!');

      queryClient.invalidateQueries({
        queryKey: ['event', id],
      });

      queryClient.invalidateQueries({
        queryKey: ['events'],
      });

      queryClient.invalidateQueries({
        queryKey: ['my-registrations'],
      });

      queryClient.invalidateQueries({
        queryKey: ['student-dashboard'],
      });
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          'Registration failed'
      );
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: () =>
      eventsApi.unregister(id!),

    onSuccess: () => {
      toast.success(
        'Registration cancelled'
      );

      queryClient.invalidateQueries({
        queryKey: ['event', id],
      });

      queryClient.invalidateQueries({
        queryKey: ['events'],
      });

      queryClient.invalidateQueries({
        queryKey: ['my-registrations'],
      });

      queryClient.invalidateQueries({
        queryKey: ['student-dashboard'],
      });
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          'Failed to unregister'
      );
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
          <div className="h-64 bg-gray-200" />

          <div className="p-8 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2" />

            <div className="h-4 bg-gray-200 rounded w-1/3" />

            <div className="h-4 bg-gray-200 rounded w-full" />

            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          icon={Calendar}
          title="Event not found"
          description="The event you are looking for does not exist or may have been removed."
          action={{
            label: 'Browse Events',
            onClick: () => {
              window.location.href = '/events';
            },
          }}
        />
      </div>
    );
  }

  const eventDate = new Date(
    event.event_date
  );

  const isPast =
    eventDate.getTime() < Date.now();

  const isFull =
    (event.registeredCount || 0) >=
    event.capacity;

  const percentage = Math.min(
    Math.round(
      ((event.registeredCount || 0) /
        event.capacity) *
        100
    ),
    100
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to events
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* HERO */}
        <div className="h-64 bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center">
          <Calendar className="w-20 h-20 text-emerald-500" />
        </div>

        <div className="p-8">
          {/* HEADER */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="success">
              {event.status}
            </Badge>

            {isFull && (
              <Badge variant="danger">
                Full
              </Badge>
            )}

            {isPast && (
              <Badge variant="default">
                Past Event
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {event.title}
          </h1>

          {/* META */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Event Date
                </p>

                <p className="font-medium text-gray-900">
                  {eventDate.toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-sky-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-sky-600" />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Registrations
                </p>

                <p className="font-medium text-gray-900">
                  {event.registeredCount || 0}/
                  {event.capacity} spots filled
                </p>
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                Capacity
              </p>

              <p className="text-sm text-gray-600">
                {percentage}%
              </p>
            </div>

            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              About this event
            </h2>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* ACTIONS */}
          <div className="mt-10">
            {event.isRegistered ? (
              <Button
                variant="danger"
                loading={
                  unregisterMutation.isPending
                }
                disabled={isPast}
                onClick={() =>
                  unregisterMutation.mutate()
                }
              >
                Cancel Registration
              </Button>
            ) : (
              <Button
                loading={
                  registerMutation.isPending
                }
                disabled={
                  isFull ||
                  isPast ||
                  event.status !==
                    'published'
                }
                onClick={() =>
                  registerMutation.mutate()
                }
              >
                {isPast
                  ? 'Event Ended'
                  : isFull
                  ? 'Event Full'
                  : 'Register Now'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}