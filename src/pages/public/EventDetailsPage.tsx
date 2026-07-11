import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { eventsApi } from '../../api';
import {
  Button,
  EmptyState,
} from '../../components/ui';

export default function EventDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [animatedWidth, setAnimatedWidth] = useState(0);

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getById(id!),
    enabled: !!id,
  });

  const getGradientClass = (title: string) => {
    const gradients = [
      "from-violet-500 to-indigo-600",
      "from-emerald-400 to-teal-600",
      "from-amber-400 to-orange-500",
      "from-sky-400 to-blue-600",
      "from-pink-500 to-rose-600",
    ];
    let sum = 0;
    for (let i = 0; i < title.length; i++) {
      sum += title.charCodeAt(i);
    }
    return gradients[sum % gradients.length];
  };

  const registerMutation = useMutation({
    mutationFn: () => eventsApi.register(id!),
    onSuccess: () => {
      toast.success('Registered successfully!');
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Registration failed');
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: () => eventsApi.unregister(id!),
    onSuccess: () => {
      toast.success('Registration cancelled');
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to unregister');
    },
  });

  const percentage = event
    ? Math.min(Math.round(((event.registeredCount || 0) / event.capacity) * 100), 100)
    : 0;

  useEffect(() => {
    if (event) {
      const timer = setTimeout(() => {
        setAnimatedWidth(percentage);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [event, percentage]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden animate-pulse">
          <div className="h-64 bg-slate-200" />
          <div className="p-8 space-y-5">
            <div className="h-8 bg-slate-200 rounded-xl w-1/2 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded-lg w-1/3 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded-lg w-full animate-pulse" />
            <div className="h-4 bg-slate-200 rounded-lg w-5/6 animate-pulse" />
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

  const eventDate = new Date(event.event_date);
  const isPast = eventDate.getTime() < Date.now();
  const isFull = (event.registeredCount || 0) >= event.capacity;
  const gradientClass = getGradientClass(event.title);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Events
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className={`h-64 bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center relative overflow-hidden`}>
          <div className="absolute top-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-white/10 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-black/20 blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          
          <div className="relative z-10 bg-black/25 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold text-white tracking-widest uppercase">
            {eventDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold border ${
                event.status === "published"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                  : event.status === "draft"
                  ? "bg-amber-50 border-amber-100 text-amber-700"
                  : "bg-rose-50 border-rose-100 text-rose-700"
              }`}
            >
              {event.status}
            </span>

            {isFull && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold bg-rose-50 border border-rose-100 text-rose-700">
                Full Capacity
              </span>
            )}

            {isPast && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold bg-slate-100 border border-slate-200 text-slate-500">
                Past Event
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8 font-display">
            {event.title}
          </h1>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3.5 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="w-11 h-11 bg-emerald-50 border border-emerald-100/50 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">
                  {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="w-11 h-11 bg-sky-50 border border-sky-100/50 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Spots</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">
                  {event.registeredCount || 0} / {event.capacity} filled
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filling Progress</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/40">
                {percentage}% Filled
              </span>
            </div>

            <div className="w-full h-3 bg-slate-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-out shadow-inner"
                style={{
                  width: `${animatedWidth}%`,
                }}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 font-display">
              About this Event
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 pt-8">
            {event.isRegistered ? (
              <Button
                variant="danger"
                loading={unregisterMutation.isPending}
                disabled={isPast}
                className="px-6 py-3 font-bold rounded-xl active:scale-95 duration-150 shadow-sm"
                onClick={() => unregisterMutation.mutate()}
              >
                Cancel Registration
              </Button>
            ) : (
              <Button
                loading={registerMutation.isPending}
                disabled={isFull || isPast || event.status !== 'published'}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold rounded-xl active:scale-95 duration-150 shadow-md shadow-emerald-600/10"
                onClick={() => registerMutation.mutate()}
              >
                {isPast
                  ? 'Event Ended'
                  : isFull
                  ? 'Event Full'
                  : 'Register for this Event'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}