import { createContext, useState, useContext, useCallback } from "react";

export const PaywallContext = createContext(null);

export const PaywallProvider = ({ children }) => {
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [creditInfo, setCreditInfo] = useState(null);

  const showPaywall = useCallback((info = null) => {
    if (info) setCreditInfo(info);
    setPaywallVisible(true);
  }, []);

  const hidePaywall = useCallback(() => {
    setPaywallVisible(false);
  }, []);

  return (
    <PaywallContext.Provider value={{ paywallVisible, creditInfo, showPaywall, hidePaywall }}>
      {children}
    </PaywallContext.Provider>
  );
};

export const usePaywall = () => {
  const ctx = useContext(PaywallContext);
  if (!ctx) throw new Error("usePaywall must be used inside <PaywallProvider>");
  return ctx;
};
