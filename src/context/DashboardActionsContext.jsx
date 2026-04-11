import { createContext, useContext } from "react";

export const DashboardActionsContext = createContext({
  registerNewChat: () => {},
});

export const useDashboardActions = () => useContext(DashboardActionsContext);
