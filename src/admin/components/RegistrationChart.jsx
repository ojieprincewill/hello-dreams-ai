import React, { useEffect, useState } from "react";
import { getChartTheme } from "../constants/designTokens";

const RegistrationChart = ({ data }) => {
  const [Chart, setChart] = useState(null);

  useEffect(() => {
    import("recharts").then((mod) => setChart(mod));
  }, []);

  if (!Chart || !data?.length) {
    return (
      <p className="text-[#999] text-sm text-center py-8" style={{ fontFamily: "Inter, sans-serif" }}>
        No registration data for this period
      </p>
    );
  }

  const theme = getChartTheme();
  const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } = Chart;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
        <XAxis dataKey="date" tick={{ fill: theme.text, fontSize: 12 }} />
        <YAxis tick={{ fill: theme.text, fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: theme.tooltipBg,
            border: `1px solid ${theme.tooltipBorder}`,
            borderRadius: 8,
            fontFamily: "Inter, sans-serif",
          }}
        />
        <Line type="monotone" dataKey="count" stroke="#1342ff" strokeWidth={2} dot={false} name="Signups" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RegistrationChart;
