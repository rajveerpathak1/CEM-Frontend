import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, ClipboardList, TrendingUp } from 'lucide-react';
import { eventsApi, registrationsApi } from '../../api';
import { MetricCard } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import type { Event } from '../../types';

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: eventsData } = useQuery({
    queryKey: ['events', 1],
    queryFn: () => eventsApi.getAll({ page: 1, limit: 5 }),
  });

  const { data: registrationsData } = useQuery({
    queryKey: ['my-registrations', 1],
    queryFn: () => registrationsApi.getMyRegistrations({ page: 1, limit: 5 }),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-gray-600">Here's what's happening on campus</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <MetricCard
          title="Upcoming Events"
          value={eventsData?.total ?? 0}
          icon={Calendar}
          color="emerald"
        />
        <MetricCard
          title="My Registrations"
          value={registrationsData?.total ?? 0}
          icon={ClipboardList}
          color="blue"
        />
        <MetricCard
          title="Available Events"
          value={eventsData?.total ?? 0}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Upcoming Events</h2>
            <Link to="/events" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {eventsData?.data?.length ? (
              eventsData.data.slice(0, 5).map((event: Event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleDateString()} &middot; {event.location}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {event.registeredCount}/{event.capacity}
                  </span>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-gray-500">No upcoming events</div>
            )}
          </div>
        </div>

        {/* My Registrations */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">My Registrations</h2>
            <Link to="/student/registrations" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {registrationsData?.data?.length ? (
              registrationsData.data.slice(0, 5).map((reg) => (
                <div key={reg.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{reg.eventTitle}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(reg.eventDate).toLocaleDateString()}
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
