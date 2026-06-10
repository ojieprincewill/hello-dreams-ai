import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import AdminButton from "../components/primitives/AdminButton";
import AdminInput from "../components/primitives/AdminInput";
import AdminSelect from "../components/primitives/AdminSelect";
import AdminModal from "../components/primitives/AdminModal";
import ConfirmModal from "../components/ConfirmModal";
import { RoleBadge } from "../components/Badges";
import { useUsersList } from "../hooks/useAdminQueries";
import { createAdmin, promoteUser, removeAdmin, deleteUser } from "../../api/usersAdminService";
import { useAuth } from "../../auth/authContext";

const AdminManagementPage = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useUsersList({ role: "admin", limit: 50 });
  const { data: superData } = useUsersList({ role: "superuser", limit: 50 });

  const admins = [...(data?.data || []), ...(superData?.data || [])];

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });
  const [promoteTarget, setPromoteTarget] = useState(null);
  const [demoteTarget, setDemoteTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

  const handleCreate = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await createAdmin(form);
      toast.success("Admin created");
      setShowCreate(false);
      setForm({ name: "", email: "", password: "", role: "admin" });
      invalidate();
    } catch (err) {
      toast.error(err.message || "Failed to create admin");
    } finally {
      setBusy(false);
    }
  };

  const handlePromote = async () => {
    if (!promoteTarget) return;
    setBusy(true);
    try {
      await promoteUser(promoteTarget.id, promoteTarget.newRole);
      toast.success("User promoted");
      setPromoteTarget(null);
      invalidate();
    } catch (err) {
      toast.error(err.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const handleDemote = async () => {
    if (!demoteTarget) return;
    setBusy(true);
    try {
      await removeAdmin(demoteTarget.id);
      toast.success("Admin demoted");
      setDemoteTarget(null);
      invalidate();
    } catch (err) {
      toast.error(err.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleteConfirm !== deleteTarget.email) return;
    setBusy(true);
    try {
      await deleteUser(deleteTarget.id);
      toast.success("User deleted");
      setDeleteTarget(null);
      setDeleteConfirm("");
      invalidate();
    } catch (err) {
      toast.error(err.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (row) => <RoleBadge role={row.role} /> },
    {
      key: "actions",
      label: "Actions",
      render: (row) =>
        row.id === currentUser?.id ? (
          <span className="text-[#999] text-sm">You</span>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {row.role === "user" && (
              <AdminButton
                variant="secondary"
                className="text-[12px] py-1 px-2"
                onClick={() => setPromoteTarget({ ...row, newRole: "admin" })}
              >
                Promote to Admin
              </AdminButton>
            )}
            {row.role === "admin" && (
              <>
                <AdminButton
                  variant="secondary"
                  className="text-[12px] py-1 px-2"
                  onClick={() => setPromoteTarget({ ...row, newRole: "superuser" })}
                >
                  Promote to Superuser
                </AdminButton>
                <AdminButton
                  variant="secondary"
                  className="text-[12px] py-1 px-2"
                  onClick={() => setDemoteTarget(row)}
                >
                  Demote
                </AdminButton>
              </>
            )}
            <AdminButton
              variant="danger"
              className="text-[12px] py-1 px-2"
              onClick={() => setDeleteTarget(row)}
            >
              Delete
            </AdminButton>
          </div>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Management"
        description="Create and manage admin accounts (superuser only)"
        actions={
          <AdminButton onClick={() => setShowCreate(true)}>Create Admin</AdminButton>
        }
      />

      {isLoading ? (
        <p className="text-[#999]">Loading…</p>
      ) : (
        <DataTable columns={columns} data={admins} emptyMessage="No admins found" />
      )}

      <AdminModal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Admin">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-[14px] mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Name</label>
            <AdminInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-[14px] mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Email</label>
            <AdminInput type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-[14px] mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Password</label>
            <AdminInput type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="block text-[14px] mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Role</label>
            <AdminSelect value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="superuser">Superuser</option>
            </AdminSelect>
          </div>
          <div className="flex justify-end gap-3">
            <AdminButton variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</AdminButton>
            <AdminButton type="submit" disabled={busy}>{busy ? "Creating…" : "Create"}</AdminButton>
          </div>
        </form>
      </AdminModal>

      <ConfirmModal
        isOpen={!!promoteTarget}
        onClose={() => setPromoteTarget(null)}
        onConfirm={handlePromote}
        title="Promote User"
        message={`Promote ${promoteTarget?.email} to ${promoteTarget?.newRole}?`}
        loading={busy}
      />

      <ConfirmModal
        isOpen={!!demoteTarget}
        onClose={() => setDemoteTarget(null)}
        onConfirm={handleDemote}
        title="Demote Admin"
        message={`Remove admin role from ${demoteTarget?.email}?`}
        loading={busy}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => { setDeleteTarget(null); setDeleteConfirm(""); }}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Type "${deleteTarget?.email}" to confirm permanent deletion.`}
        confirmLabel="Delete"
        variant="danger"
        loading={busy}
      >
        <AdminInput
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          placeholder={deleteTarget?.email}
          className="mt-2"
        />
      </ConfirmModal>
    </div>
  );
};

export default AdminManagementPage;
