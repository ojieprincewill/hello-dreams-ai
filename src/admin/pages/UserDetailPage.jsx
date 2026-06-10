import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import AdminCard from "../components/primitives/AdminCard";
import AdminButton from "../components/primitives/AdminButton";
import { RoleBadge, StatusBadge } from "../components/Badges";
import { useUserDetail, useUserDailyStats } from "../hooks/useAdminQueries";
import { updateUserStatus, promoteUser } from "../../api/usersAdminService";
import { useAuth } from "../../auth/authContext";
import { isSuperuser } from "../../auth/roleUtils";
import RegistrationChart from "../components/RegistrationChart";

const UserDetailPage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useUserDetail(id);
  const { data: stats } = useUserDailyStats(id, {});
  const [busy, setBusy] = useState(false);

  const handlePromote = async (role) => {
    if (!user) return;
    setBusy(true);
    try {
      await promoteUser(user.id, role);
      toast.success(`User promoted to ${role}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "user", id] });
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await updateUserStatus(user.id, !user.isActive);
      toast.success(user.isActive ? "User deactivated" : "User activated");
      queryClient.invalidateQueries({ queryKey: ["admin", "user", id] });
    } catch (e) {
      toast.error(e.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const chartData = stats?.dailyStats?.map((d) => ({
    date: d.date,
    count: d.tokensUsed,
  }));

  if (isLoading) return <p className="text-[#999]">Loading…</p>;
  if (!user) return <p className="text-[#999]">User not found</p>;

  return (
    <div>
      <PageHeader
        title={user.name}
        description={user.email}
        actions={
          <>
            <Link to="/admin/users">
              <AdminButton variant="secondary">← Back to list</AdminButton>
            </Link>
            <AdminButton variant="secondary" onClick={handleToggleStatus} disabled={busy}>
              {user.isActive ? "Deactivate" : "Activate"}
            </AdminButton>
            {isSuperuser(currentUser) && user.role === "user" && (
              <AdminButton onClick={() => handlePromote("admin")} disabled={busy}>
                Promote to Admin
              </AdminButton>
            )}
            {isSuperuser(currentUser) && user.role === "admin" && (
              <AdminButton onClick={() => handlePromote("superuser")} disabled={busy}>
                Promote to Superuser
              </AdminButton>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <AdminCard>
          <p className="text-[14px] text-[#667085] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Role</p>
          <RoleBadge role={user.role} />
        </AdminCard>
        <AdminCard>
          <p className="text-[14px] text-[#667085] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Status</p>
          <StatusBadge isActive={user.isActive} />
        </AdminCard>
        <AdminCard>
          <p className="text-[14px] text-[#667085] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Joined</p>
          <p className="text-[16px] font-medium">{new Date(user.createdAt).toLocaleString()}</p>
        </AdminCard>
      </div>

      {stats?.totals && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <AdminCard padding="p-4">
            <p className="text-[12px] text-[#667085]">Tokens Used</p>
            <p className="text-[22px] font-bold">{stats.totals.tokensUsed?.toLocaleString()}</p>
          </AdminCard>
          <AdminCard padding="p-4">
            <p className="text-[12px] text-[#667085]">Cost USD</p>
            <p className="text-[22px] font-bold">${stats.totals.costUsd}</p>
          </AdminCard>
          <AdminCard padding="p-4">
            <p className="text-[12px] text-[#667085]">Cost NGN</p>
            <p className="text-[22px] font-bold">₦{stats.totals.costNgn}</p>
          </AdminCard>
          <AdminCard padding="p-4">
            <p className="text-[12px] text-[#667085]">Actions</p>
            <p className="text-[22px] font-bold">{stats.totals.actionsCount}</p>
          </AdminCard>
        </div>
      )}

      <AdminCard>
        <h2 className="text-[18px] font-bold mb-4">Daily Token Usage</h2>
        <RegistrationChart data={chartData} />
      </AdminCard>
    </div>
  );
};

export default UserDetailPage;
