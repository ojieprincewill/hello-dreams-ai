import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import TimeRangePicker from "../components/TimeRangePicker";
import AdminCard from "../components/primitives/AdminCard";
import RegistrationChart from "../components/RegistrationChart";
import FeatureUsageChart from "../components/FeatureUsageChart";
import RoleDonutChart from "../components/RoleDonutChart";
import { useDashboardStats } from "../hooks/useAdminQueries";
import { useDashboardStream } from "../hooks/useDashboardStream";
import { formatCostMetrics } from "../utils/formatCostMetrics";

const OverviewPage = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [customDates, setCustomDates] = useState({ start: "", end: "" });

  const params = {
    timeRange: customDates.start && customDates.end ? "custom" : timeRange,
    ...(customDates.start && { startDate: new Date(customDates.start).toISOString() }),
    ...(customDates.end && { endDate: new Date(customDates.end).toISOString() }),
  };

  const { data, isLoading } = useDashboardStats(params);
  const liveEvents = useDashboardStream();

  const um = data?.userMetrics;
  const am = data?.activityMetrics;
  const costDisplay = formatCostMetrics(data?.costMetrics);

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Platform analytics and real-time activity"
        actions={
          <TimeRangePicker
            value={timeRange}
            onChange={(v) => {
              setTimeRange(v);
              setCustomDates({ start: "", end: "" });
            }}
            customStart={customDates.start}
            customEnd={customDates.end}
            onCustomChange={({ start, end }) => {
              setCustomDates({ start, end });
              if (start && end) setTimeRange("custom");
            }}
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={um?.totalUsers ?? "—"} loading={isLoading} />
        <StatCard label="Active Users" value={um?.activeUsers ?? "—"} loading={isLoading} />
        <StatCard
          label="DAU / WAU / MAU"
          value={am ? `${am.dau} / ${am.wau} / ${am.mau}` : "—"}
          loading={isLoading}
        />
        <StatCard
          label="New Signups (24h / 7d)"
          value={um ? `${um.newUsersLast24h} / ${um.newUsersLast7d}` : "—"}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard
          label="Total AI Actions"
          value={data?.usageMetrics?.totalActions ?? "—"}
          loading={isLoading}
        />
        <StatCard
          label={costDisplay.label ?? "Est. AI Cost (USD / NGN)"}
          value={isLoading ? undefined : costDisplay.value}
          subtext={
            isLoading
              ? undefined
              : costDisplay.showBreakdownLink
                ? (
                    <span>
                      {costDisplay.subtext}{" "}
                      <Link to="/admin/costs" className="text-[#1342ff] hover:underline">
                        View cost breakdown →
                      </Link>
                    </span>
                  )
                : costDisplay.subtext
          }
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AdminCard>
          <h2 className="text-[18px] font-bold mb-4 text-[#010413] dark:text-[#f7f7f7]">
            Registration Trend
          </h2>
          <RegistrationChart data={data?.registrationTrend} />
        </AdminCard>
        <AdminCard>
          <h2 className="text-[18px] font-bold mb-4 text-[#010413] dark:text-[#f7f7f7]">
            Feature Adoption
          </h2>
          <FeatureUsageChart featureUsage={data?.featureUsage} />
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <h2 className="text-[18px] font-bold mb-4 text-[#010413] dark:text-[#f7f7f7]">
            Users by Role
          </h2>
          <RoleDonutChart usersByRole={um?.usersByRole} />
        </AdminCard>
        <AdminCard>
          <h2 className="text-[18px] font-bold mb-4 text-[#010413] dark:text-[#f7f7f7]">
            Live Activity
          </h2>
          <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar">
            {!liveEvents.length ? (
              <p className="text-[#999] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                Waiting for events…
              </p>
            ) : (
              liveEvents.map((evt, i) => (
                <div
                  key={i}
                  className="text-[13px] p-2 rounded-md border border-[#eaecf0] dark:border-[#2d2d2d] text-[#010413] dark:text-[#f7f7f7]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <span className="font-medium">{evt.type}</span>
                  {evt.data?.email && ` — ${evt.data.email}`}
                  {evt.data?.module && ` — ${evt.data.module}`}
                  <span className="text-[#999] ml-2">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </AdminCard>
      </div>
    </div>
  );
};

export default OverviewPage;
