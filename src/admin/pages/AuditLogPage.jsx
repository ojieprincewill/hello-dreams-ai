import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import AdminInput from "../components/primitives/AdminInput";
import AdminSelect from "../components/primitives/AdminSelect";
import AdminButton from "../components/primitives/AdminButton";
import AdminBadge from "../components/primitives/AdminBadge";
import { useAuditLog } from "../hooks/useAdminQueries";

const ACTION_LABELS = {
  user_activated: "User Activated",
  user_deactivated: "User Deactivated",
  user_promoted: "User Promoted",
  user_demoted: "User Demoted",
  user_deleted: "User Deleted",
  admin_created: "Admin Created",
  user_updated: "User Updated",
};

const AuditLogPage = () => {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [actorSearch, setActorSearch] = useState("");

  const { data, isLoading } = useAuditLog({
    page,
    limit: 20,
    ...(action && { action }),
    ...(actorSearch && { actorSearch }),
  });

  const columns = [
    {
      key: "createdAt",
      label: "Date",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    { key: "actorEmail", label: "Actor" },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <AdminBadge variant="admin">{ACTION_LABELS[row.action] || row.action}</AdminBadge>
      ),
    },
    {
      key: "target",
      label: "Target",
      render: (row) => `${row.targetType || ""} ${row.targetId?.slice(0, 8) || ""}`.trim() || "—",
    },
    {
      key: "metadata",
      label: "Details",
      render: (row) =>
        row.metadata ? (
          <details>
            <summary className="cursor-pointer text-[#1342ff] text-sm">View</summary>
            <pre className="text-[11px] mt-1 p-2 bg-[#efefef] dark:bg-[#2d2d2d] rounded overflow-x-auto">
              {JSON.stringify(row.metadata, null, 2)}
            </pre>
          </details>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <div>
      <PageHeader title="Audit Log" description="Admin action history" />

      <div className="flex flex-wrap gap-3 mb-4">
        <AdminInput
          placeholder="Search by actor email…"
          value={actorSearch}
          onChange={(e) => { setActorSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <AdminSelect value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }}>
          <option value="">All actions</option>
          {Object.entries(ACTION_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </AdminSelect>
      </div>

      {isLoading ? (
        <p className="text-[#999]">Loading…</p>
      ) : (
        <>
          <DataTable columns={columns} data={data?.data} emptyMessage="No audit entries yet" />
          {data?.meta && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-[14px] text-[#667085]" style={{ fontFamily: "Inter, sans-serif" }}>
                Page {data.meta.page} of {data.meta.totalPages}
              </p>
              <div className="flex gap-2">
                <AdminButton variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
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
    </div>
  );
};

export default AuditLogPage;
