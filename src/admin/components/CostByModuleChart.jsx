import React, { useEffect, useState } from "react";
import { getChartTheme } from "../constants/designTokens";

const MODULE_LABELS = {
  "resume-builder": "Resume Builder",
  "career-profile": "Career Profile",
  "document-generator": "Documents",
  "persona-builder": "Persona Builder",
  "linkedin-optimization": "LinkedIn",
  "headshot-generator": "Headshots",
  "job-application": "Job Application",
  shared: "Shared / System",
};

const CostByModuleChart = ({ costByModule }) => {
  const [Chart, setChart] = useState(null);

  useEffect(() => {
    import("recharts").then((mod) => setChart(mod));
  }, []);

  const data = costByModule
    ? Object.entries(costByModule)
        .filter(([, v]) => (v?.costUsd ?? v ?? 0) > 0)
        .map(([key, value]) => ({
          name: MODULE_LABELS[key] || key,
          costUsd: typeof value === "object" ? value.costUsd : value,
        }))
        .sort((a, b) => b.costUsd - a.costUsd)
    : [];

  if (!Chart || !data.length) {
    return (
      <p className="text-[#999] text-sm text-center py-8" style={{ fontFamily: "Inter, sans-serif" }}>
        No module cost data
      </p>
    );
  }

  const theme = getChartTheme();
  const { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } = Chart;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
        <XAxis type="number" tick={{ fill: theme.text, fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
        <YAxis type="category" dataKey="name" width={130} tick={{ fill: theme.text, fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            background: theme.tooltipBg,
            border: `1px solid ${theme.tooltipBorder}`,
            borderRadius: 8,
            fontFamily: "Inter, sans-serif",
          }}
          formatter={(value) => [`$${Number(value).toFixed(4)}`, "Cost"]}
        />
        <Bar dataKey="costUsd" fill="#1342ff" radius={[0, 4, 4, 0]} name="Cost (USD)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CostByModuleChart;
