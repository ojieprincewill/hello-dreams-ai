import { createContext, useContext } from "react";

export const DashboardActionsContext = createContext({
  registerNewChat: () => {},
  navigateToConversation: () => {},
});

export const useDashboardActions = () => useContext(DashboardActionsContext);
