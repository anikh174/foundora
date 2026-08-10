"use client";

import { useEffect, useState } from "react";
import { Users, Trash2 } from "lucide-react";
import { api, extractError } from "@/lib/api";
import Pagination from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, Avatar } from "@/components/ui/Misc";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatCredits, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

const roles = ["supporter", "creator", "admin"];

export default function ManageUsers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams({ page, limit: 10 });
        if (search.trim()) params.append("search", search.trim());
        if (roleFilter !== "All") params.append("role", roleFilter);
        const res = await api.get(`/api/admin/users?${params.toString()}`);
        if (!cancelled) setData(res.data);
      } catch {
        if (!cancelled) setData({ users: [], totalPages: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, search, roleFilter, reloadKey]);

  const applyFilters = () => {
    setLoading(true);
    setPage(1);
    setReloadKey((k) => k + 1);
  };

  const handlePageChange = (next) => {
    setLoading(true);
    setPage(next);
  };

  const reload = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const handleRoleChange = async (user, newRole) => {
    setUpdatingId(user._id);
    try {
      await api.patch(`/api/admin/users/${user._id}/role`, { role: newRole });
      toast.success(`${user.name} is now a ${newRole}`);
      reload();
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/admin/users/${deleteTarget._id}`);
      toast.success("User deleted successfully");
      setDeleteTarget(null);
      reload();
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Manage Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          View every account, change roles, or remove users from the platform.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm bg-white sm:w-44"
        >
          <option>All</option>
          <option>supporter</option>
          <option>creator</option>
          <option>admin</option>
        </select>
        <button
          onClick={applyFilters}
          className="px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
        >
          Apply
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : data?.users?.length === 0 ? (
        <EmptyState icon={<Users className="w-8 h-8" />} title="No users found" description="Try adjusting your search or filters." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Role</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Credits</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Joined</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.users?.map((u) => (
                  <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <Avatar src={u.image} name={u.name} className="w-10 h-10 text-xs" />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{u.name}</p>
                          <p className="text-xs text-slate-500 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={u.role}
                        disabled={updatingId === u._id}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold capitalize bg-white outline-none focus:border-emerald-500 disabled:opacity-60"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">{formatCredits(u.credits)}</td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data?.totalPages > 1 && (
            <div className="p-4 border-t border-slate-100">
              <Pagination page={page} totalPages={data.totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this user?"
        message={`Deleting "${deleteTarget?.name}" (${deleteTarget?.email}) will permanently remove their account, campaigns, contributions, and withdrawals. This cannot be undone.`}
        confirmText="Delete user"
      />
    </div>
  );
}
