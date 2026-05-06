import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '../../api';
import { SearchBar, Pagination, Badge, Button, EmptyState, TableRowSkeleton } from '../../components/ui';

export default function RolesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users-roles', page, search],
    queryFn: () => usersApi.getAll({ page, limit: 10, search }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => usersApi.updateRole(id, role),
    onSuccess: () => {
      toast.success('Role updated');
      queryClient.invalidateQueries({ queryKey: ['users-roles'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update role'),
  });

  const promote = (id: string, currentRole: string) => {
    const next = currentRole === 'student' ? 'admin' : 'super-admin';
    updateRoleMutation.mutate({ id, role: next });
  };

  const demote = (id: string, currentRole: string) => {
    const next = currentRole === 'super-admin' ? 'admin' : 'student';
    updateRoleMutation.mutate({ id, role: next });
  };

  const roleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super-admin': return 'danger' as const;
      case 'admin': return 'warning' as const;
      default: return 'info' as const;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        <p className="mt-1 text-sm text-gray-600">Promote or demote users between roles</p>
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search users..." />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={3} />)
              ) : !data?.data?.length ? (
                <tr>
                  <td colSpan={3}>
                    <EmptyState
                      icon={Shield}
                      title="No users found"
                      description="Users will appear here when they register."
                    />
                  </td>
                </tr>
              ) : (
                data.data.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-700 font-medium text-xs">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={roleBadgeVariant(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => promote(user.id, user.role)}
                          disabled={user.role === 'super-admin' || updateRoleMutation.isPending}
                          className="text-emerald-600 hover:bg-emerald-50"
                        >
                          <ArrowUp className="w-4 h-4" />
                          Promote
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => demote(user.id, user.role)}
                          disabled={user.role === 'student' || updateRoleMutation.isPending}
                          className="text-amber-600 hover:bg-amber-50"
                        >
                          <ArrowDown className="w-4 h-4" />
                          Demote
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data && (
        <div className="mt-4">
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
