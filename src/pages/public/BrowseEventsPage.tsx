import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, Filter, Sparkles, MapPin, Tag } from "lucide-react";
import { eventsApi } from "../../api";
import {
  SearchBar,
  Pagination,
  EventCardSkeleton,
  EmptyState,
} from "../../components/ui";
import Navbar from "../../components/layout/Navbar";
import type { Event } from "../../types";

const CATEGORY_TAGS = ["All", "Workshop", "Seminar", "Hackathon", "Social", "Sports", "Orientation"];

export default function BrowseEventsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  /* ================================================= */
  /* QUERY */
  /* ================================================= */

  const { data, isLoading, error } = useQuery({
    queryKey: ["events", page, search, activeTag],
    queryFn: () => {
      // If active tag is not "All", search by tag
      const searchTerm = activeTag === "All" ? search : activeTag;
      return eventsApi.getAll({
        page,
        limit: 9,
        search: searchTerm,
      });
    },
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

  /* ================================================= */
  /* PAGINATION */
  /* ================================================= */

  const totalPages = data
    ? Math.ceil(data.total / data.limit)
    : 1;

  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    setSearch("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-in-up">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              Browse Events
            </h1>
            <p className="mt-2 text-slate-500 text-sm">
              Discover workshops, hackathons, and gatherings across campus
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm max-w-xs md:max-w-none">
            <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">
              {data?.total || 0} Events Available
            </span>
          </div>
        </div>

        {/* ================================================= */}
        {/* FILTERS & SEARCH */}
        {/* ================================================= */}

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 mb-10 shadow-sm animate-fade-in-up">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              <div className="flex-1">
                <SearchBar
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setActiveTag("All");
                    setPage(1);
                  }}
                  placeholder="Search events by title or keyword..."
                  className="w-full"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 my-1"></div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter By Topic</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {CATEGORY_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 border ${
                      activeTag === tag
                        ? "bg-gradient-to-r from-emerald-600 to-teal-500 border-transparent text-white shadow-md shadow-emerald-600/10 scale-102"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <EventCardSkeleton key={index} />
              )
            )}
          </div>
        ) : error ? (
          <EmptyState
            icon={Calendar}
            title="Failed to load events"
            description="Something went wrong while fetching events. Please refresh the page."
          />
        ) : !data?.data?.length ? (
          <EmptyState
            icon={Calendar}
            title="No events found"
            description="Try adjusting your filter or search terms."
          />
        ) : (
          <>
            {/* ================================================= */}
            {/* EVENTS GRID */}
            {/* ================================================= */}

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
              {data.data.map((event: Event) => {
                const isFull = (event.registeredCount || 0) >= event.capacity;
                const gradientClass = getGradientClass(event.title);

                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="group"
                  >
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-slate-300/80">
                      {/* CARD TOP GRADIENT */}
                      <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${gradientClass} relative overflow-hidden transition-transform duration-500 group-hover:scale-103`}>
                        {/* Soft geometric design circle overlay */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-black/15 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="relative text-center flex flex-col items-center">
                          <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner mb-3">
                            <Calendar className="h-6 w-6 text-white" />
                          </div>
                          
                          <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest bg-black/20 px-2.5 py-1 rounded-full border border-white/10">
                            {new Date(event.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {/* CARD CONTENT */}
                      <div className="p-6">
                        <div className="mb-4 flex items-center justify-between">
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

                          {isFull ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold bg-rose-50 border border-rose-100 text-rose-700">
                              Full
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold bg-emerald-50 border border-emerald-100 text-emerald-700">
                              Open
                            </span>
                          )}
                        </div>

                        <h3 className="line-clamp-1 text-lg font-bold text-slate-900 font-display transition-colors group-hover:text-emerald-600 mb-2">
                          {event.title}
                        </h3>

                        <p className="line-clamp-2 text-sm text-slate-500 leading-relaxed mb-5">
                          {event.description}
                        </p>

                        <div className="border-t border-slate-100 my-4"></div>

                        {/* CARD META */}
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-slate-350" />
                            <span className="truncate max-w-[120px]">Campus Hub</span>
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-slate-350" />
                            <span>
                              {event.registeredCount || 0} / {event.capacity}
                            </span>
                          </span>
                        </div>

                        {/* REGISTERED BADGE */}
                        {event.isRegistered && (
                          <div className="mt-4 flex w-full items-center justify-center py-2 bg-emerald-50 border border-emerald-100/50 rounded-xl text-xs font-bold text-emerald-700">
                            Registered for Event
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
              <div className="mt-12 flex justify-center">
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