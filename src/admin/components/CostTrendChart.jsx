import React, { useEffect, useState } from "react";
import { getChartTheme } from "../constants/designTokens";

const CostTrendChart = ({ data }) => {
  const [Chart, setChart] = useState(null);

  useEffect(() => {
    import("recharts").then((mod) => setChart(mod));
  }, []);

  const points = data?.dailyTrend ?? [];

  if (!Chart || !points.length) {
    return (
      <p className="text-[#999] text-sm text-center py-8" style={{ fontFamily: "Inter, sans-serif" }}>
        No cost trend data
      </p>
    );
  }

  const theme = getChartTheme();
  const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } = Chart;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={points}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
        <XAxis dataKey="date" tick={{ fill: theme.text, fontSize: 11 }} />
        <YAxis tick={{ fill: theme.text, fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
        <Tooltip
          contentStyle={{
            background: theme.tooltipBg,
            border: `1px solid ${theme.tooltipBorder}`,
            borderRadius: 8,
            fontFamily: "Inter, sans-serif",
          }}
          formatter={(value) => [`$${Number(value).toFixed(4)}`, "Cost"]}
        />
        <Area type="monotone" dataKey="costUsd" stroke="#1342ff" fill="#1342ff33" name="Cost (USD)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CostTrendChart;
