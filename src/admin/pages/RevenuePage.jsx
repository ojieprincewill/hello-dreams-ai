import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import TimeRangePicker from "../components/TimeRangePicker";
import DataTable from "../components/DataTable";
import AdminCard from "../components/primitives/AdminCard";
import RevenueChart from "../components/RevenueChart";
import { PaymentStatusBadge } from "../components/Badges";
import { usePaymentStats, usePaymentsList, useSubscriptionsList } from "../hooks/useAdminQueries";

const RevenuePage = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [tab, setTab] = useState("payments");
  const [page, setPage] = useState(1);

  const params = { timeRange };
  const { data: stats, isLoading: statsLoading } = usePaymentStats(params);
  const { data: payments, isLoading: paymentsLoading } = usePaymentsList({ page, limit: 15 });
  const { data: subscriptions, isLoading: subsLoading } = useSubscriptionsList({ page, limit: 15 });

  const paymentColumns = [
    {
      key: "userEmail",
      label: "User",
      render: (row) => row.userEmail || row.userId?.slice(0, 8),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => `${row.currency} ${row.amount}`,
    },
    { key: "type", label: "Type" },
    {
      key: "status",
      label: "Status",
      render: (row) => <PaymentStatusBadge status={row.status} />,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  const subColumns = [
    {
      key: "userEmail",
      label: "User",
      render: (row) => row.userEmail || row.userId?.slice(0, 8),
    },
    { key: "planId", label: "Plan" },
    { key: "status", label: "Status" },
    { key: "billingCycle", label: "Billing" },
    {
      key: "currentPeriodEnd",
      label: "Period End",
      render: (row) => new Date(row.currentPeriodEnd).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Revenue"
        description="Payments and subscription analytics"
        actions={
          <TimeRangePicker value={timeRange} onChange={setTimeRange} />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Revenue"
          value={stats ? `₦${stats.totalRevenue?.toLocaleString()}` : "—"}
          loading={statsLoading}
        />
        <StatCard
          label="Success Rate"
          value={stats ? `${stats.successRate}%` : "—"}
          subtext={stats ? `${stats.successfulPayments} successful` : undefined}
          loading={statsLoading}
        />
        <StatCard
          label="Active Subscriptions"
          value={stats?.activeSubscriptions ?? "—"}
          loading={statsLoading}
        />
        <StatCard
          label="MRR Estimate"
          value={stats ? `₦${stats.mrrEstimate?.toLocaleString()}` : "—"}
          loading={statsLoading}
        />
      </div>

      <AdminCard className="mb-6">
        <h2 className="text-[18px] font-bold mb-4">Revenue Trend</h2>
        <RevenueChart data={stats?.revenueTrend} />
      </AdminCard>

      <div className="flex gap-2 mb-4">
        {["payments", "subscriptions"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setPage(1); }}
            className={`px-4 py-2 rounded-md text-[14px] capitalize transition-colors ${
              tab === t
                ? "bg-[#1342ff] text-white"
                : "border border-[#eaecf0] dark:border-[#2d2d2d] text-[#010413] dark:text-[#f7f7f7]"
            }`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "payments" ? (
        paymentsLoading ? (
          <p className="text-[#999]">Loading…</p>
        ) : (
          <DataTable columns={paymentColumns} data={payments?.data} emptyMessage="No payments yet" />
        )
      ) : subsLoading ? (
        <p className="text-[#999]">Loading…</p>
      ) : (
        <DataTable columns={subColumns} data={subscriptions?.data} emptyMessage="No subscriptions yet" />
      )}
    </div>
  );
};

export default RevenuePage;
