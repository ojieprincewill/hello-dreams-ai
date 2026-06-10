import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import AdminInput from "../components/primitives/AdminInput";
import AdminSelect from "../components/primitives/AdminSelect";
import AdminButton from "../components/primitives/AdminButton";
import { RoleBadge, StatusBadge } from "../components/Badges";
import ConfirmModal from "../components/ConfirmModal";
import { useUsersList } from "../hooks/useAdminQueries";
import { updateUserStatus, deleteUser } from "../../api/usersAdminService";
import { useAuth } from "../../auth/authContext";
import { isSuperuser } from "../../auth/roleUtils";

const UsersListPage = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const params = {
    page,
    limit: 15,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(role && { role }),
    ...(isActive !== "" && { isActive: isActive === "true" }),
  };

  const { data, isLoading } = useUsersList(params);

  const handleToggleStatus = async (u) => {
    try {
      await updateUserStatus(u.id, !u.isActive);
      toast.success(u.isActive ? "User deactivated" : "User activated");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (e) {
      toast.error(e.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await deleteUser(deleteTarget.id);
      toast.success("User deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setDeleteTarget(null);
    } catch (e) {
      toast.error(e.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <Link to={`/admin/users/${row.id}`} className="text-[#1342ff] hover:underline">
          {row.name}
        </Link>
      ),
    },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (row) => <RoleBadge role={row.role} /> },
    {
      key: "isActive",
      label: "Status",
      render: (row) => <StatusBadge isActive={row.isActive} />,
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2 flex-wrap">
          <AdminButton
            variant="secondary"
            className="text-[12px] py-1 px-2"
            onClick={() => handleToggleStatus(row)}
            aria-label={row.isActive ? "Deactivate user" : "Activate user"}
          >
            {row.isActive ? "Deactivate" : "Activate"}
          </AdminButton>
          {isSuperuser(currentUser) && row.id !== currentUser?.id && (
            <AdminButton
              variant="danger"
              className="text-[12px] py-1 px-2"
              onClick={() => setDeleteTarget(row)}
              aria-label="Delete user"
            >
              Delete
            </AdminButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Users" description="Manage platform users" />

      <div className="flex flex-wrap gap-3 mb-4">
        <AdminInput
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <AdminSelect value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superuser">Superuser</option>
        </AdminSelect>
        <AdminSelect value={isActive} onChange={(e) => { setIsActive(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </AdminSelect>
      </div>

      {isLoading ? (
        <p className="text-[#999]">Loading users…</p>
      ) : (
        <>
          <DataTable columns={columns} data={data?.data} />
          {data?.meta && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-[14px] text-[#667085]" style={{ fontFamily: "Inter, sans-serif" }}>
                Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
              </p>
              <div className="flex gap-2">
                <AdminButton
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </AdminButton>
                <AdminButton
                  variant="secondary"
                  disabled={page >= data.meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </AdminButton>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Permanently delete ${deleteTarget?.email}? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={loading}
      />
    </div>
  );
};

export default UsersListPage;
