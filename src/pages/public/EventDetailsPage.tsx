import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, MapPin, Users, Clock, ArrowLeft, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { eventsApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Button, Badge, Skeleton } from '../../components/ui';
import Navbar from '../../components/layout/Navbar';

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getById(id!),
    enabled: !!id,
  });

  const registerMutation = useMutation({
    mutationFn: () => eventsApi.register(id!),
    onSuccess: () => {
      toast.success('Registered successfully!');
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Registration failed'),
  });

  const unregisterMutation = useMutation({
    mutationFn: () => eventsApi.unregister(id!),
    onSuccess: () => {
      toast.success('Unregistered successfully');
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Unregistration failed'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-64 w-full mb-6 rounded-xl" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">Event not found.</p>
        </div>
      </div>
    );
  }

  const isFull = event.registeredCount >= event.capacity;
  const isRegistered = event.isRegistered;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Hero image */}
          <div className="h-64 sm:h-80 bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center">
            {event.image ? (
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <Calendar className="w-20 h-20 text-emerald-400" />
            )}
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="success">{event.category}</Badge>
              {isFull && <Badge variant="danger">Full</Badge>}
              {isRegistered && <Badge variant="info">Registered</Badge>}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="w-5 h-5 text-emerald-600" />
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-5 h-5 text-emerald-600" />
                {event.time}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="w-5 h-5 text-emerald-600" />
                {event.location}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Users className="w-5 h-5 text-emerald-600" />
                {event.registeredCount} / {event.capacity} spots filled
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <User className="w-5 h-5 text-emerald-600" />
                Organized by {event.organizerName}
              </div>
            </div>

            {/* Capacity bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Capacity</span>
                <span>{Math.round((event.registeredCount / event.capacity) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About this event</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>

            {user && (
              <div className="flex gap-3">
                {isRegistered ? (
                  <Button
                    variant="danger"
                    onClick={() => unregisterMutation.mutate()}
                    loading={unregisterMutation.isPending}
                  >
                    Cancel Registration
                  </Button>
                ) : (
                  <Button
                    onClick={() => registerMutation.mutate()}
                    loading={registerMutation.isPending}
                    disabled={isFull}
                  >
                    {isFull ? 'Event is Full' : 'Register Now'}
                  </Button>
                )}
              </div>
            )}
            {!user && (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">
                  Please{' '}
                  <a href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
                    sign in
                  </a>{' '}
                  to register for this event.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
