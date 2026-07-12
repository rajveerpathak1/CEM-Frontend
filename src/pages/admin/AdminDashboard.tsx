import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  ClipboardList,
  PlusCircle,
} from 'lucide-react';

import { eventsApi, registrationsApi } from '../../api';
import { MetricCard } from '../../components/ui';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super-admin';

  // Events Query
  const { data: eventsData } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => eventsApi.getAll({ page: 1, limit: 5 }),
  });

  // Registrations Query
  const { data: registrationsData = [] } = useQuery({
    queryKey: ['admin-registrations'],
    queryFn: registrationsApi.getAll,
  });

  // Users Query
  const { data: usersData = null } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () =>
      api.get('/super-admin/users').then((r) => r.data.data),
    enabled: isSuperAdmin,
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Manage events and registrations
          </p>
        </div>

        <Link
          to="/admin/events/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />

          Create Event
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Events"
          value={eventsData?.total ?? 0}
          icon={Calendar}
          color="emerald"
        />

        <MetricCard
          title="Total Registrations"
          value={registrationsData.length}
          icon={ClipboardList}
          color="blue"
        />

        {isSuperAdmin && usersData && (
          <MetricCard
            title="Total Users"
            value={usersData.length}
            icon={Users}
            color="amber"
          />
        )}

        <MetricCard
          title="Upcoming Events"
          value={
            eventsData?.data?.filter(
              (e: any) =>
                new Date(e.event_date) >= new Date()
            ).length ?? 0
          }
          icon={Calendar}
          color="red"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Recent Events
            </h2>

            <Link
              to="/admin/events"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Manage
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {eventsData?.data?.slice(0, 5).map((event: any) => (
              <div
                key={event.id}
                className="flex items-center gap-4 px-6 py-4"
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
                    {' · '}
                    {event.registeredCount}/{event.capacity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Recent Registrations
            </h2>

            <Link
              to="/admin/registrations"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {registrationsData.slice(0, 5).map((reg: any) => (
              <div
                key={reg.id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-5 h-5 text-sky-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {reg.userName}
                  </p>

                  <p className="text-xs text-gray-500 truncate">
                    {reg.eventTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}