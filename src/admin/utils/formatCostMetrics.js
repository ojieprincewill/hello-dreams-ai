export const formatCostMetrics = (costMetrics) => {
  if (!costMetrics) {
    return {
      label: "Est. AI Cost (USD / NGN)",
      value: "Not available",
      subtext: "Cost tracking requires the latest backend deployment",
      showBreakdownLink: false,
    };
  }

  const usd = Number(costMetrics.totalCostUsd ?? 0);
  const ngn = Number(costMetrics.totalCostNgn ?? 0);
  const tokens = Number(costMetrics.totalTokensUsed ?? 0);

  const value = `$${usd.toFixed(2)} / ₦${ngn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  let subtext;
  if (tokens > 0) {
    subtext = `${tokens.toLocaleString()} tokens across chat, embeddings, images & audio`;
  } else if (usd === 0 && ngn === 0) {
    subtext = "No AI usage in this period";
  } else {
    subtext = "Includes chat, embeddings, images & audio";
  }

  return {
    label: "Est. AI Cost (USD / NGN)",
    value,
    subtext,
    showBreakdownLink: true,
  };
};
