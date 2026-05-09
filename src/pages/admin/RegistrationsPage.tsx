import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList } from 'lucide-react';

import { registrationsApi } from '../../api';

import {
  Pagination,
  Badge,
  SearchBar,
  EmptyState,
  TableRowSkeleton,
} from '../../components/ui';

export default function RegistrationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const {
    data: registrations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['registrations'],
    queryFn: registrationsApi.getAll,
  });

  // Search optimization
  const searchLower = search.toLowerCase();

  const filtered = registrations.filter(
    (reg: any) =>
      reg.userName?.toLowerCase().includes(searchLower) ||
      reg.eventTitle?.toLowerCase().includes(searchLower) ||
      reg.userEmail?.toLowerCase().includes(searchLower)
  );

  // Frontend pagination
  const limit = 10;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedRegistrations = filtered.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filtered.length / limit);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Registrations
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          View and manage all event registrations
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, or event..."
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>

                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>

                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Date
                </th>

                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {/* Loading */}
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={4} />
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      icon={ClipboardList}
                      title="Failed to load registrations"
                      description="Something went wrong while fetching registrations."
                    />
                  </td>
                </tr>
              ) : !paginatedRegistrations.length ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      icon={ClipboardList}
                      title="No registrations found"
                      description="Registrations will appear here when students sign up for events."
                    />
                  </td>
                </tr>
              ) : (
                paginatedRegistrations.map((reg: any) => (
                  <tr
                    key={reg.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Student */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {reg.userName}
                        </p>

                        <p className="text-xs text-gray-500">
                          {reg.userEmail}
                        </p>
                      </div>
                    </td>

                    {/* Event */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {reg.eventTitle}
                    </td>

                    {/* Event Date */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {reg.eventDate
                        ? new Date(reg.eventDate).toLocaleDateString()
                        : 'N/A'}
                    </td>

                    {/* Registered Date */}
                    <td className="px-6 py-4">
                      <Badge variant="info">
                        {reg.registeredAt
                          ? new Date(reg.registeredAt).toLocaleDateString()
                          : 'N/A'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}