import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import TimeRangePicker from "../components/TimeRangePicker";
import AdminCard from "../components/primitives/AdminCard";
import AdminButton from "../components/primitives/AdminButton";
import AdminSelect from "../components/primitives/AdminSelect";
import DataTable from "../components/DataTable";
import CostTrendChart from "../components/CostTrendChart";
import CostByModuleChart from "../components/CostByModuleChart";
import CostByOperationChart from "../components/CostByOperationChart";
import { useCostSummary, useCostTrend, useCostLedger } from "../hooks/useAdminQueries";
import { exportCostCsv } from "../../api/costsService";

const MODULE_OPTIONS = [
  { value: "", label: "All modules" },
  { value: "resume-builder", label: "Resume Builder" },
  { value: "career-profile", label: "Career Profile" },
  { value: "document-generator", label: "Documents" },
  { value: "persona-builder", label: "Persona Builder" },
  { value: "linkedin-optimization", label: "LinkedIn" },
  { value: "headshot-generator", label: "Headshots" },
  { value: "job-application", label: "Job Application" },
];

const CostsPage = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });
  const [moduleFilter, setModuleFilter] = useState("");
  const [page, setPage] = useState(1);

  const params = {
    timeRange: customDates.start && customDates.end ? "custom" : timeRange,
    ...(customDates.start && { startDate: new Date(customDates.start).toISOString() }),
    ...(customDates.end && { endDate: new Date(customDates.end).toISOString() }),
    ...(moduleFilter && { module: moduleFilter }),
    page,
    limit: 15,
  };

  const { data: summary, isLoading: summaryLoading } = useCostSummary(params);
  const { data: trend, isLoading: trendLoading } = useCostTrend(params);
  const { data: ledger, isLoading: ledgerLoading } = useCostLedger(params);

  const handleExport = async () => {
    try {
      const blob = await exportCostCsv(params);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-costs-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Cost report exported");
    } catch {
      toast.error("Failed to export cost report");
    }
  };

  const ledgerColumns = [
    {
      key: "createdAt",
      label: "Date",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: "userEmail",
      label: "User",
      render: (row) => row.userEmail || row.userId?.slice(0, 8),
    },
    { key: "module", label: "Module" },
    { key: "actionType", label: "Action" },
    {
      key: "operation",
      label: "Operation",
      render: (row) => (
        <span>
          {row.operation || "—"}
          {row.estimated && (
            <span className="ml-1 text-[11px] text-[#999]" title="Estimated cost">
              (Est.)
            </span>
          )}
        </span>
      ),
    },
    {
      key: "costUsd",
      label: "Cost (USD)",
      render: (row) => `$${Number(row.costUsd).toFixed(4)}`,
    },
    { key: "tokensUsed", label: "Tokens" },
  ];

  return (
    <div>
      <PageHeader
        title="AI Costs"
        description="Operational AI spend across all modules"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <TimeRangePicker
              value={timeRange}
              onChange={(v) => {
                setTimeRange(v);
                setCustomDates({ start: "", end: "" });
                setPage(1);
              }}
              customStart={customDates.start}
              customEnd={customDates.end}
              onCustomChange={({ start, end }) => {
                setCustomDates({ start, end });
                if (start && end) setTimeRange("custom");
                setPage(1);
              }}
            />
            <AdminButton onClick={handleExport}>Export CSV</AdminButton>
          </div>
        }
      />

      <div
        className="mb-6 p-4 rounded-lg border border-[#eaecf0] dark:border-[#2d2d2d] bg-[#f9fafb] dark:bg-[#181818] text-[13px] text-[#667085] dark:text-[#aaa]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        Estimated costs use OpenAI published rates. Audio and fallback providers may be approximate.
        Historical data before full tracking deployment may be incomplete.{" "}
        <Link to="/admin/overview" className="text-[#1342ff] hover:underline">
          Back to Overview
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Cost (USD)"
          value={summary ? `$${Number(summary.totalCostUsd).toFixed(2)}` : "—"}
          loading={summaryLoading}
        />
        <StatCard
          label="Total Cost (NGN)"
          value={
            summary
              ? `₦${Number(summary.totalCostNgn).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "—"
          }
          loading={summaryLoading}
        />
        <StatCard
          label="Tokens Used"
          value={summary?.totalTokensUsed?.toLocaleString() ?? "—"}
          loading={summaryLoading}
        />
        <StatCard
          label="API Calls"
          value={summary?.trackedCallCount ?? "—"}
          subtext={
            summary?.estimatedCallCount
              ? `${summary.estimatedCallCount} estimated`
              : undefined
          }
          loading={summaryLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AdminCard>
          <h2 className="text-[18px] font-bold mb-4 text-[#010413] dark:text-[#f7f7f7]">
            Daily Cost Trend
          </h2>
          {trendLoading ? (
            <p className="text-[#999] text-sm text-center py-8">Loading…</p>
          ) : (
            <CostTrendChart data={trend} />
          )}
        </AdminCard>
        <AdminCard>
          <h2 className="text-[18px] font-bold mb-4 text-[#010413] dark:text-[#f7f7f7]">
            Cost by Module
          </h2>
          {summaryLoading ? (
            <p className="text-[#999] text-sm text-center py-8">Loading…</p>
          ) : (
            <CostByModuleChart costByModule={summary?.costByModule} />
          )}
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AdminCard>
          <h2 className="text-[18px] font-bold mb-4 text-[#010413] dark:text-[#f7f7f7]">
            Cost by Operation
          </h2>
          {summaryLoading ? (
            <p className="text-[#999] text-sm text-center py-8">Loading…</p>
          ) : (
            <CostByOperationChart costByOperation={summary?.costByOperation} />
          )}
        </AdminCard>
        <AdminCard>
          <h2 className="text-[18px] font-bold mb-4 text-[#010413] dark:text-[#f7f7f7]">
            Top Users by Cost
          </h2>
          <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar">
            {!summary?.topUsers?.length ? (
              <p className="text-[#999] text-sm text-center py-8" style={{ fontFamily: "Inter, sans-serif" }}>
                No user cost data
              </p>
            ) : (
              summary.topUsers.map((user) => (
                <div
                  key={user.userId}
                  className="flex justify-between items-center text-[13px] p-2 rounded-md border border-[#eaecf0] dark:border-[#2d2d2d]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <span>{user.email || user.userId.slice(0, 8)}</span>
                  <span className="font-medium">${Number(user.costUsd).toFixed(4)}</span>
                </div>
              ))
            )}
          </div>
        </AdminCard>
      </div>

      <AdminCard>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-[18px] font-bold text-[#010413] dark:text-[#f7f7f7]">
            Usage Ledger
          </h2>
          <div className="w-[200px]">
            <AdminSelect
              value={moduleFilter}
              onChange={(e) => {
                setModuleFilter(e.target.value);
                setPage(1);
              }}
            >
              {MODULE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </AdminSelect>
          </div>
        </div>
        <DataTable
          columns={ledgerColumns}
          data={ledger?.data ?? []}
          loading={ledgerLoading}
          page={page}
          totalPages={ledger?.meta?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </AdminCard>
    </div>
  );
};

export default CostsPage;
