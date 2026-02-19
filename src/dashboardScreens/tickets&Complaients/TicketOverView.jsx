import React, { useState, useEffect } from "react";
import { ticketService } from "../../services/ticket.service";
import TicketScatterChart from "../../common/TicketScatterChart";

const CARD_CONFIG = [
  { key: "totalTickets", title: "Total Tickets", trend: "All tickets", gradient: ["#59AFB2", "#59AFB2"] },
  { key: "complaints", title: "Complaints Received", trend: "Type: Complaint", gradient: ["#0060A9", "#0060A9"] },
  { key: "resolvedTickets", title: "Resolved Tickets", trendKey: "resolutionRate", gradient: ["#9FFFAE", "#9FFFAE"] },
  { key: "pendingTickets", title: "Pending Tickets", trend: "New, Pending, In Progress", gradient: ["#DB1C1C", "#DB1C1C"] },
];

const TicketOverView = ({ rightAction }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ticketService.getStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.status === 403 ? "You don't have permission to view stats" : "Failed to load stats");
          setStats(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStats();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col w-40 md:w-full sm:flex-row justify-between items-center sm:items-center whitespace-nowrap mb-5 gap-3">
          <h1 className="font-vivita text-2xl font-medium text-black">Tickets Overview</h1>
          {rightAction && <div className="flex justify-end md:w-[25%] w-full">{rightAction}</div>}
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-[20px] global-bg-color box-shadow px-4 py-2 h-[200px] flex items-center justify-center">
              <span className="text-gray-500">Loading...</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col w-40 md:w-full sm:flex-row justify-between items-center sm:items-center whitespace-nowrap mb-5 gap-3">
          <h1 className="font-vivita text-2xl font-medium text-black">Tickets Overview</h1>
          {rightAction && <div className="flex justify-end md:w-[25%] w-full">{rightAction}</div>}
        </div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  const resolutionRate = stats?.resolutionRate != null ? `${stats.resolutionRate}% resolution rate` : "";

  return (
    <div className="space-y-4">
      <div className="flex flex-col w-40 md:w-full sm:flex-row justify-between items-center sm:items-center whitespace-nowrap mb-5 gap-3">
        <h1 className="font-vivita text-2xl font-medium text-black">Tickets Overview</h1>
        {rightAction && <div className="flex justify-end md:w-[25%] w-full">{rightAction}</div>}
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
        {CARD_CONFIG.map((config, index) => {
          const count = stats?.[config.key] ?? 0;
          const trend = config.trendKey === "resolutionRate" ? resolutionRate : config.trend;
          return (
            <div
              key={index}
              className="rounded-[20px] global-bg-color box-shadow px-4 py-2 space-y-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-vivita font-[500] my-2">{config.title}</h3>
                <div className="gap-2 flex items-center">
                  <span
                    className="w-4 h-4 rounded inline-block box-shadow"
                    style={{
                      background: `linear-gradient(270deg, ${config.gradient[0]} 0%, ${config.gradient[1]} 100%)`,
                    }}
                  />
                  <span>{count}</span>
                </div>
              </div>
              <span className="text-light">{trend}</span>
              <div className="h-[130px] mt-4 -ml-6">
                <TicketScatterChart value={count} color={config.gradient[0]} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TicketOverView;
