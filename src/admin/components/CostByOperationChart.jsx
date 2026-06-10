import React, { useEffect, useState } from "react";
import { getChartTheme } from "../constants/designTokens";

const OPERATION_LABELS = {
  chat: "Chat",
  extraction: "Extraction",
  embedding: "Embeddings",
  image: "Images",
  speech_to_text: "Speech-to-text",
  unknown: "Other",
};

const CostByOperationChart = ({ costByOperation }) => {
  const [Chart, setChart] = useState(null);

  useEffect(() => {
    import("recharts").then((mod) => setChart(mod));
  }, []);

  const data = costByOperation
    ? Object.entries(costByOperation).map(([key, value]) => ({
        name: OPERATION_LABELS[key] || key,
        costUsd: value.costUsd ?? 0,
      }))
    : [];

  if (!Chart || !data.length) {
    return (
      <p className="text-[#999] text-sm text-center py-8" style={{ fontFamily: "Inter, sans-serif" }}>
        No operation cost data
      </p>
    );
  }

  const theme = getChartTheme();
  const { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } = Chart;
  const colors = ["#1342ff", "#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#94a3b8"];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="costUsd" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: theme.tooltipBg,
            border: `1px solid ${theme.tooltipBorder}`,
            borderRadius: 8,
            fontFamily: "Inter, sans-serif",
          }}
          formatter={(value) => `$${Number(value).toFixed(4)}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CostByOperationChart;
