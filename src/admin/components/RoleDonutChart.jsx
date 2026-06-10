import React, { useEffect, useState } from "react";
import { getChartTheme } from "../constants/designTokens";

const ROLE_COLORS = {
  user: "#1342ff",
  admin: "#ff00e6",
  superuser: "#8a2be2",
};

const RoleDonutChart = ({ usersByRole }) => {
  const [Chart, setChart] = useState(null);

  useEffect(() => {
    import("recharts").then((mod) => setChart(mod));
  }, []);

  const data = usersByRole
    ? Object.entries(usersByRole).map(([role, count]) => ({ name: role, value: count }))
    : [];

  if (!Chart || !data.length) {
    return (
      <p className="text-[#999] text-sm text-center py-8" style={{ fontFamily: "Inter, sans-serif" }}>
        No role data
      </p>
    );
  }

  const theme = getChartTheme();
  const { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } = Chart;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          dataKey="value"
          nameKey="name"
          label={({ name, value }) => `${name}: ${value}`}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={ROLE_COLORS[entry.name] || "#667085"} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: theme.tooltipBg,
            border: `1px solid ${theme.tooltipBorder}`,
            borderRadius: 8,
            fontFamily: "Inter, sans-serif",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RoleDonutChart;
