import { useEffect, useState } from "react";
import { connectDashboardStream } from "../../api/adminService";

export const useDashboardStream = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const disconnect = connectDashboardStream(
      (event) => {
        if (event.type === "heartbeat") return;
        setEvents((prev) => [event, ...prev].slice(0, 20));
      },
      () => {},
    );
    return disconnect;
  }, []);

  return events;
};
