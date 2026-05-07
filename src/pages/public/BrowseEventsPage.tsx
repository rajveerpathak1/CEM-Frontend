import { useState } from "react";

import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import {
  Calendar,
  Users,
} from "lucide-react";

import { eventsApi } from "../../api";

import {
  SearchBar,
  Pagination,
  EventCardSkeleton,
  EmptyState,
} from "../../components/ui";

import Navbar from "../../components/layout/Navbar";

import type { Event } from "../../types";

export default function BrowseEventsPage() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  /* ================================================= */
  /* QUERY */
  /* ================================================= */

  const { data, isLoading, error } = useQuery({
    queryKey: ["events", page, search],

    queryFn: () =>
      eventsApi.getAll({
        page,
        limit: 9,
        search,
      }),
  });

  /* ================================================= */
  /* PAGINATION */
  /* ================================================= */

  const totalPages = data
    ? Math.ceil(data.total / data.limit)
    : 1;

  /* ================================================= */
  /* UI */
  /* ================================================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Browse Events
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Discover and join campus events
          </p>
        </div>

        {/* ================================================= */}
        {/* SEARCH */}
        {/* ================================================= */}

        <div className="mb-8">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search events..."
            className="max-w-xl"
          />
        </div>

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <EventCardSkeleton key={index} />
              )
            )}
          </div>
        ) : error ? (
          /* ================================================= */
          /* ERROR */
          /* ================================================= */

          <EmptyState
            icon={Calendar}
            title="Failed to load events"
            description="Something went wrong while fetching events."
          />
        ) : !data?.data?.length ? (
          /* ================================================= */
          /* EMPTY */
          /* ================================================= */

          <EmptyState
            icon={Calendar}
            title="No events found"
            description="Try adjusting your search."
          />
        ) : (
          <>
            {/* ================================================= */}
            {/* EVENTS GRID */}
            {/* ================================================= */}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((event: Event) => {
                const isFull =
                  (event.registeredCount || 0) >=
                  event.capacity;

                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="group"
                  >
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                      {/* ================================================= */}
                      {/* TOP */}
                      {/* ================================================= */}

                      <div className="flex h-44 items-center justify-center bg-gradient-to-br from-emerald-100 to-sky-100">
                        <Calendar className="h-12 w-12 text-emerald-500" />
                      </div>

                      {/* ================================================= */}
                      {/* CONTENT */}
                      {/* ================================================= */}

                      <div className="p-5">
                        {/* STATUS */}
                        <div className="mb-3 flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              event.status ===
                              "published"
                                ? "bg-emerald-50 text-emerald-700"
                                : event.status ===
                                  "draft"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {event.status}
                          </span>

                          {isFull && (
                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                              Full
                            </span>
                          )}
                        </div>

                        {/* TITLE */}
                        <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-emerald-700">
                          {event.title}
                        </h3>

                        {/* DESCRIPTION */}
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {event.description}
                        </p>

                        {/* META */}
                        <div className="mt-5 flex flex-wrap gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />

                            {new Date(
                              event.event_date
                            ).toLocaleDateString()}
                          </span>

                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />

                            {event.registeredCount || 0}
                            /{event.capacity}
                          </span>
                        </div>

                        {/* REGISTERED BADGE */}
                        {event.isRegistered && (
                          <div className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                            Registered
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ================================================= */}
            {/* PAGINATION */}
            {/* ================================================= */}

            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}