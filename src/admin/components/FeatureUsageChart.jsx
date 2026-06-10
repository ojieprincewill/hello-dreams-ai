import React, { useEffect, useState } from "react";
import { getChartTheme } from "../constants/designTokens";

const FEATURE_LABELS = {
  resumeBuilder: "Resume Builder",
  careerProfile: "Career Profile",
  documentGenerator: "Documents",
  personaBuilder: "Persona Builder",
  linkedinOptimization: "LinkedIn",
  headshotGenerator: "Headshots",
  jobApplication: "Job Application",
};

const FeatureUsageChart = ({ featureUsage }) => {
  const [Chart, setChart] = useState(null);

  useEffect(() => {
    import("recharts").then((mod) => setChart(mod));
  }, []);

  const data = featureUsage
    ? Object.entries(featureUsage).map(([key, value]) => ({
        name: FEATURE_LABELS[key] || key,
        count: value,
      }))
    : [];

  if (!Chart || !data.length) {
    return (
      <p className="text-[#999] text-sm text-center py-8" style={{ fontFamily: "Inter, sans-serif" }}>
        No feature usage data
      </p>
    );
  }

  const theme = getChartTheme();
  const { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } = Chart;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
        <XAxis type="number" tick={{ fill: theme.text, fontSize: 12 }} />
        <YAxis type="category" dataKey="name" width={120} tick={{ fill: theme.text, fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            background: theme.tooltipBg,
            border: `1px solid ${theme.tooltipBorder}`,
            borderRadius: 8,
            fontFamily: "Inter, sans-serif",
          }}
        />
        <Bar dataKey="count" fill="#1342ff" radius={[0, 4, 4, 0]} name="Uses" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FeatureUsageChart;
