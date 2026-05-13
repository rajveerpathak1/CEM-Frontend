import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Calendar,
  ClipboardList,
  TrendingUp,
} from 'lucide-react';

import {
  eventsApi,
  registrationsApi,
} from '../../api';

import { MetricCard } from '../../components/ui';

import { useAuth } from '../../context/AuthContext';

import type { Event } from '../../types';

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: eventsData } = useQuery({
    queryKey: ['events'],
    queryFn: () =>
      eventsApi.getAll({
        page: 1,
        limit: 5,
      }),
  });

  const { data: registrationsData = [] } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: () =>
      registrationsApi.getMyRegistrations(),
  });

  const upcomingEvents =
    eventsData?.data?.filter(
      (event) =>
        new Date(event.event_date).getTime() >
        Date.now()
    ) || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back,{' '}
          {user?.name?.split(' ')[0]}
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening on campus
        </p>
      </div>

      {/* Metrics */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <MetricCard
          title="Upcoming Events"
          value={upcomingEvents.length}
          icon={Calendar}
          color="emerald"
        />

        <MetricCard
          title="My Registrations"
          value={registrationsData.length}
          icon={ClipboardList}
          color="blue"
        />

        <MetricCard
          title="Available Events"
          value={upcomingEvents.length}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* EVENTS */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Upcoming Events
            </h2>

            <Link
              to="/events"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {upcomingEvents.length ? (
              upcomingEvents
                .slice(0, 5)
                .map((event: Event) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>

                      <p className="text-xs text-gray-500">
                        {new Date(
                          event.event_date
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="text-xs text-gray-400">
                      {event.registeredCount || 0}/
                      {event.capacity}
                    </span>
                  </Link>
                ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                No upcoming events
              </div>
            )}
          </div>
        </div>

        {/* REGISTRATIONS */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              My Registrations
            </h2>

            <Link
              to="/student/registrations"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {registrationsData.length ? (
              registrationsData
                .slice(0, 5)
                .map((reg) => (
                  <div
                    key={reg.registration_id}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="w-5 h-5 text-sky-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {reg.event_title}
                      </p>

                      <p className="text-xs text-gray-500">
                        {new Date(
                          reg.event_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                No registrations yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}