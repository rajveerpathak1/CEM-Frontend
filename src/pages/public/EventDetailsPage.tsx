import { useParams, useNavigate, Link } from "react-router-dom";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Calendar,
  Users,
  ArrowLeft,
} from "lucide-react";

import toast from "react-hot-toast";

import { eventsApi } from "../../api";

import { useAuth } from "../../context/AuthContext";

import {
  Button,
  Badge,
  Skeleton,
} from "../../components/ui";

import Navbar from "../../components/layout/Navbar";

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { user } = useAuth();

  const queryClient = useQueryClient();

  /* ================================================= */
  /* QUERY */
  /* ================================================= */

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", id],

    queryFn: () => eventsApi.getById(id!),

    enabled: !!id,
  });

  /* ================================================= */
  /* REGISTER */
  /* ================================================= */

  const registerMutation = useMutation({
    mutationFn: () => eventsApi.register(id!),

    onSuccess: () => {
      toast.success("Registered successfully!");

      queryClient.invalidateQueries({
        queryKey: ["event", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Registration failed"
      );
    },
  });

  /* ================================================= */
  /* UNREGISTER */
  /* ================================================= */

  const unregisterMutation = useMutation({
    mutationFn: () =>
      eventsApi.unregister(id!),

    onSuccess: () => {
      toast.success(
        "Registration cancelled"
      );

      queryClient.invalidateQueries({
        queryKey: ["event", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to unregister"
      );
    },
  });

  /* ================================================= */
  /* LOADING */
  /* ================================================= */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="mx-auto max-w-4xl px-4 py-8">
          <Skeleton className="mb-6 h-8 w-32" />

          <Skeleton className="mb-6 h-72 w-full rounded-2xl" />

          <Skeleton className="mb-4 h-10 w-3/4" />

          <Skeleton className="mb-2 h-5 w-1/2" />

          <Skeleton className="h-5 w-2/3" />
        </div>
      </div>
    );
  }

  /* ================================================= */
  /* ERROR */
  /* ================================================= */

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Event not found
          </h2>

          <p className="mt-3 text-gray-600">
            The event may have been deleted
            or is unavailable.
          </p>

          <button
            onClick={() => navigate("/events")}
            className="mt-6 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  /* ================================================= */
  /* DERIVED */
  /* ================================================= */

  const registeredCount =
    event.registeredCount || 0;

  const isFull =
    registeredCount >= event.capacity;

  const isRegistered =
    event.isRegistered;

  const capacityPercentage = Math.min(
    Math.round(
      (registeredCount /
        event.capacity) *
        100
    ),
    100
  );

  /* ================================================= */
  /* UI */
  /* ================================================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ================================================= */}
        {/* BACK BUTTON */}
        {/* ================================================= */}

        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />

          Back
        </button>

        {/* ================================================= */}
        {/* CARD */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* HERO */}
          <div className="flex h-72 items-center justify-center bg-gradient-to-br from-emerald-100 to-sky-100">
            <Calendar className="h-20 w-20 text-emerald-500" />
          </div>

          {/* CONTENT */}
          <div className="p-6 sm:p-8">
            {/* STATUS */}
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge
                variant={
                  event.status ===
                  "published"
                    ? "success"
                    : event.status ===
                      "draft"
                    ? "warning"
                    : "danger"
                }
              >
                {event.status}
              </Badge>

              {isFull && (
                <Badge variant="danger">
                  Full
                </Badge>
              )}

              {isRegistered && (
                <Badge variant="info">
                  Registered
                </Badge>
              )}
            </div>

            {/* TITLE */}
            <h1 className="mb-5 text-3xl font-bold text-gray-900">
              {event.title}
            </h1>

            {/* META */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="h-5 w-5 text-emerald-600" />

                {new Date(
                  event.event_date
                ).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Users className="h-5 w-5 text-emerald-600" />

                {registeredCount} /{" "}
                {event.capacity} spots filled
              </div>
            </div>

            {/* CAPACITY */}
            <div className="mb-8">
              <div className="mb-2 flex justify-between text-xs text-gray-500">
                <span>Capacity</span>

                <span>
                  {capacityPercentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${capacityPercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-8 border-t border-gray-100 pt-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                About this event
              </h2>

              <p className="whitespace-pre-line leading-relaxed text-gray-600">
                {event.description}
              </p>
            </div>

            {/* ACTIONS */}
            {user ? (
              <div className="flex gap-3">
                {isRegistered ? (
                  <Button
                    variant="danger"
                    onClick={() =>
                      unregisterMutation.mutate()
                    }
                    loading={
                      unregisterMutation.isPending
                    }
                  >
                    Cancel Registration
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      registerMutation.mutate()
                    }
                    loading={
                      registerMutation.isPending
                    }
                    disabled={
                      isFull ||
                      event.status !==
                        "published"
                    }
                  >
                    {isFull
                      ? "Event Full"
                      : "Register Now"}
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-xl bg-gray-50 p-5 text-center">
                <p className="text-sm text-gray-600">
                  Please{" "}
                  <Link
                    to="/login"
                    className="font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    sign in
                  </Link>{" "}
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