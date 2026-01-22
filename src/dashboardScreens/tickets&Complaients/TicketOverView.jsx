import React from "react";
import LineChartComponent from "../../common/LineChart";
import { ticketStats } from "../../../dummyData";
const LineChartData = [
  { week: "Week 1", revenue: 1000 },
  { week: "Week 2", revenue: 500 },
  { week: "Week 3", revenue: 1600 },
  { week: "Week 4", revenue: 1200 },
];

const TicketOverView = () => {
  return (
    <div className="space-y-4">
      <h1 className="font-vivita text-[24px] font-medium">Tickets Overview</h1>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
        {ticketStats.map((stat, index) => (
          <div
            key={index}
            className="rounded-[20px] global-bg-color box-shadow px-4 py-2 space-y-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-vivita font-[500] my-2">{stat.title}</h3>
              <div className="gap-2 flex items-center">
                <span
                  className="w-4 h-4 rounded inline-block box-shadow"
                  style={{
                    background: `linear-gradient(270deg, ${stat.gradient[0]} 0%, ${stat.gradient[1]} 100%)`, // Gradient for the small color indicator
                  }}
                ></span>
                <span>{stat.count}</span>
              </div>
            </div>
            <span className="text-light">{stat.trend}</span>
            <div className="h-[130px] mt-4 -ml-6">
              <LineChartComponent
                data={stat.chartData}
                color={stat.gradient}
                strokeWidth="6"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketOverView;
