import React, { useEffect, useMemo, useState } from "react";
import { Eye, ShieldOff, ShieldCheck, Users, Mail, Building2, X, Trash2 } from "lucide-react";
import { DataTable } from "../../components/common/DataTable";
import { useAppState } from "../../context/AppContext";
import { contentApi } from "../../services/contentApi";
import type { AdminUser } from "../../types";

export const AdminUserManagement: React.FC = () => {
  const { showToast, deleteUser } = useAppState();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await contentApi.getUsers();
        setUsers(data);
      } catch {
        showToast("Unable to load users right now.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [showToast]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return users.filter((user) =>
      [user.name, user.email, user.startupId || "", user.dept || ""].join(" ").toLowerCase().includes(query)
    );
  }, [searchQuery, users]);

  const toggleUser = async (user: AdminUser) => {
    try {
      const updated = await contentApi.updateUserStatus(user.id, { isActive: !user.isActive });
      setUsers((prev) => prev.map((item) => (item.id === user.id ? updated : item)));
      setSelectedUser((prev) => (prev?.id === user.id ? updated : prev));
      showToast(`User ${updated.isActive ? "activated" : "deactivated"} successfully.`, "success");
    } catch {
      showToast("Unable to update user status.", "error");
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((item) => item.id !== userToDelete.id));
      if (selectedUser?.id === userToDelete.id) {
        setSelectedUser(null);
      }
      setUserToDelete(null);
    } catch {
      // Error handled in AppContext toast
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: "User",
      accessor: (item: AdminUser) => (
        <div>
          <p className="font-bold text-[#0B2A5B]">{item.name}</p>
          <p className="text-[11px] text-slate-500">{item.email}</p>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (item: AdminUser) => (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
          {item.role}
        </span>
      ),
    },
    {
      header: "Program",
      accessor: (item: AdminUser) => <span className="text-slate-600">{item.selectedProgram || "Not set"}</span>,
    },
    {
      header: "Status",
      accessor: (item: AdminUser) => (
        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
          item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
        }`}>
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (item: AdminUser) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedUser(item)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
          <button
            type="button"
            onClick={() => toggleUser(item)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-colors ${
              item.isActive ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {item.isActive ? <ShieldOff className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
            {item.isActive ? "Deactivate" : "Activate"}
          </button>
          <button
            type="button"
            onClick={() => setUserToDelete(item)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 hover:border-red-300 transition-colors"
            title="Delete User"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-600" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" id="admin-user-management">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-md font-bold text-[#0B2A5B]">User Management</h3>
          <p className="text-[11px] text-slate-500">Manage, activate, deactivate, or delete user accounts and founder profiles.</p>
        </div>
        <div className="rounded-full bg-[#0B2A5B] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white">
          {users.length} users
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name, email, startup ID, or department..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#0B2A5B]"
            />
          </div>

          <DataTable
            columns={columns}
            data={filteredUsers}
            emptyMessage={loading ? "Loading users..." : "No users found."}
            id="admin-users-table"
          />
        </div>

        <aside className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          {selectedUser ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <X className="h-3.5 w-3.5" />
                Close
              </button>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Name</p>
                <p className="mt-1 text-lg font-black text-[#0B2A5B]">{selectedUser.name}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#F05A28]" />
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#F05A28]" />
                    <span>{selectedUser.role}</span>
                  </div>
                  {selectedUser.startupId && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#F05A28]" />
                      <span>{selectedUser.startupId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Application Access</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {selectedUser.isActive
                    ? "Allowed to log in and apply for programs."
                    : "Login blocked. User profile is under review."}
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleUser(selectedUser)}
                  className={`w-full rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-colors ${
                    selectedUser.isActive ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {selectedUser.isActive ? "Deactivate User" : "Activate User"}
                </button>
                <button
                  type="button"
                  onClick={() => setUserToDelete(selectedUser)}
                  className="w-full rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete User
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-500">
              Select a user to view details and control access.
            </div>
          )}
        </aside>
      </div>

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Delete User Account</h4>
                <p className="text-xs text-slate-500 font-medium">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete user <strong className="text-slate-900">{userToDelete.name}</strong> (<span className="font-mono text-slate-700">{userToDelete.email}</span>)?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

