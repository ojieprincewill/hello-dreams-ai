export const colors = {
  primary: "#1342ff",
  accent: "#ff00e6",
  textPrimary: "#010413",
  textPrimaryDark: "#f7f7f7",
  textSecondary: "#667085",
  textSecondaryDark: "#aaa",
  textMuted: "#999",
  surfacePage: "#ffffff",
  surfacePageDark: "#212121",
  surfaceSidebar: "#f9f9f9",
  surfaceSidebarDark: "#181818",
  surfaceCard: "#f6f6f6",
  surfaceCardInner: "#efefef",
  surfaceCardDark: "#181818",
  surfaceCardDarkAlt: "#2d2d2d",
  border: "#eaecf0",
  borderDark: "#2d2d2d",
  borderModalDark: "#565757",
  inputText: "#101828",
};

export const fonts = {
  heading: "Darker Grotesque, sans-serif",
  body: "Inter, sans-serif",
  modalTitle: "Poppins, sans-serif",
};

export const chartColors = {
  primary: colors.primary,
  accent: colors.accent,
  gridLight: colors.border,
  gridDark: colors.borderDark,
};

export const isDarkMode = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

export const getChartTheme = () => ({
  grid: isDarkMode() ? chartColors.gridDark : chartColors.gridLight,
  text: isDarkMode() ? colors.textPrimaryDark : colors.textSecondary,
  tooltipBg: isDarkMode() ? colors.surfaceCardDark : colors.surfaceCard,
  tooltipBorder: isDarkMode() ? colors.borderDark : colors.border,
});
