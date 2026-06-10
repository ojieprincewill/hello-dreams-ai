import React, { useEffect, useState } from "react";
import { getChartTheme } from "../constants/designTokens";

const RevenueChart = ({ data }) => {
  const [Chart, setChart] = useState(null);

  useEffect(() => {
    import("recharts").then((mod) => setChart(mod));
  }, []);

  if (!Chart || !data?.length) {
    return (
      <p className="text-[#999] text-sm text-center py-8" style={{ fontFamily: "Inter, sans-serif" }}>
        No revenue data for this period
      </p>
    );
  }

  const theme = getChartTheme();
  const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } = Chart;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1342ff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1342ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
        <XAxis dataKey="date" tick={{ fill: theme.text, fontSize: 12 }} />
        <YAxis tick={{ fill: theme.text, fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: theme.tooltipBg,
            border: `1px solid ${theme.tooltipBorder}`,
            borderRadius: 8,
            fontFamily: "Inter, sans-serif",
          }}
        />
        <Area type="monotone" dataKey="amount" stroke="#1342ff" fill="url(#revenueGrad)" name="Revenue" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
