import React, { useState, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import calendar from "../assets/calendar.svg";

const ACTIVE_COLOR = "#FAC1D9";
const DIVIDER_COLOR = "rgba(255,255,255,0.06)";
const COLORS = ["#FFB6D2", "#FF89B8", "#FF5CA8", "#FF2B7A"];

/* DATA (unchanged) */
const DONUT = {
  reservation: [
    { name: "Confirmed", value: 110 },
    { name: "Awaited", value: 30 },
    { name: "Cancelled", value: 32 },
    { name: "Failed", value: 20 },
  ],
  revenue: [
    { name: "Confirmed", value: 620 },
    { name: "Awaited", value: 180 },
    { name: "Cancelled", value: 240 },
    { name: "Failed", value: 120 },
  ],
  staff: [
    { name: "Confirmed", value: 28 },
    { name: "Awaitated", value: 7 },
    { name: "Cancelled", value: 8 },
    { name: "Failed", value: 7 },
  ],
};

const LINE_BY_REPORT = {
  reservation: [
    { month: "JAN", confirmed: 2000, other: 1200 },
    { month: "FEB", confirmed: 3000, other: 1600 },
    { month: "MAR", confirmed: 2100, other: 1500 },
    { month: "APR", confirmed: 3500, other: 1700 },
    { month: "MAY", confirmed: 4300, other: 2500 },
    { month: "JUN", confirmed: 3800, other: 2400 },
    { month: "JUL", confirmed: 4300, other: 2600 },
    { month: "AUG", confirmed: 4200, other: 2700 },
    { month: "SEP", confirmed: 5100, other: 2900 },
    { month: "OCT", confirmed: 3600, other: 2300 },
    { month: "NOV", confirmed: 3100, other: 2400 },
    { month: "DEC", confirmed: 4900, other: 2600 },
  ],
  revenue: [
    { month: "JAN", confirmed: 1200, other: 800 },
    { month: "FEB", confirmed: 1600, other: 900 },
    { month: "MAR", confirmed: 2200, other: 1100 },
    { month: "APR", confirmed: 3000, other: 1500 },
    { month: "MAY", confirmed: 4200, other: 2100 },
    { month: "JUN", confirmed: 3800, other: 2000 },
    { month: "JUL", confirmed: 4500, other: 2300 },
    { month: "AUG", confirmed: 4100, other: 2200 },
    { month: "SEP", confirmed: 5200, other: 2600 },
    { month: "OCT", confirmed: 3900, other: 2100 },
    { month: "NOV", confirmed: 3600, other: 2000 },
    { month: "DEC", confirmed: 5400, other: 2700 },
  ],
  staff: [
    { month: "JAN", confirmed: 10, other: 6 },
    { month: "FEB", confirmed: 12, other: 7 },
    { month: "MAR", confirmed: 11, other: 7 },
    { month: "APR", confirmed: 14, other: 8 },
    { month: "MAY", confirmed: 16, other: 9 },
    { month: "JUN", confirmed: 15, other: 8 },
    { month: "JUL", confirmed: 17, other: 10 },
    { month: "AUG", confirmed: 16, other: 9 },
    { month: "SEP", confirmed: 18, other: 11 },
    { month: "OCT", confirmed: 15, other: 9 },
    { month: "NOV", confirmed: 14, other: 9 },
    { month: "DEC", confirmed: 19, other: 11 },
  ],
};

const ROWS_BY_REPORT = {
  reservation: new Array(6).fill(0).map((_, i) => ({
    reservationId: `#12345${64 + i}`,
    customer: "Watson Joyce",
    phone: "+1 (123) 123 4654",
    reservationDate: "28. 03. 2024",
    checkIn: "03 : 18 PM",
    checkOut: "05 : 00 PM",
    total: "$250.00",
  })),
  revenue: new Array(6).fill(0).map((_, i) => ({
    sno: (i + 1).toString().padStart(2, "0"),
    topSelling: "Chicken Permeson",
    revenueDate: "28. 03. 2024",
    sellPrice: "$55.00",
    profit: "$7,985.00",
    profitMargin: "15.00%",
    totalRevenue: "$8000.00",
  })),
  staff: new Array(6).fill(0).map((_, i) => ({
    staffId: `S${100 + i}`,
    name: `Employee ${i + 1}`,
    role: i % 2 === 0 ? "Waiter" : "Chef",
    workHours: "08 : 00",
    joinedDate: "12. 01. 2023",
    salary: "$350.00",
  })),
};
function Pill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer"
      style={{
        background: active ? ACTIVE_COLOR : "transparent",
        color: active ? "black" : "#d9d9d9",
      }}
    >
      {children}
    </button>
  );
}
async function exportElementToPDF(el, filename = "report.pdf") {
  if (!el) return;
  const canvas = await html2canvas(el, { scale: 2 });
  const img = canvas.toDataURL("image/jpeg", 1);

  const pdf = new jsPDF("p", "pt", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(img, "JPEG", 0, 0, width, height);
  pdf.save(filename);
}
export default function ReportPage() {
  const [activeReport, setActiveReport] = useState("reservation");
  const [activeStatus, setActiveStatus] = useState("Confirmed");
  const exportRef = useRef();

  const donutData = DONUT[activeReport];
  const total = donutData.reduce((s, v) => s + v.value, 0);
  const rows = ROWS_BY_REPORT[activeReport];
  const lineData = LINE_BY_REPORT[activeReport];

  const dividerCell = {
    borderRight: `1px solid ${DIVIDER_COLOR}`,
    paddingRight: 20,
  };

  return (
    <div className="min-h-screen bg-black text-[#d9d9d9] px-4 sm:px-10 pb-10 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Pill
            active={activeReport === "reservation"}
            onClick={() => setActiveReport("reservation")}
          >
            Reservation Report
          </Pill>
          <Pill
            active={activeReport === "revenue"}
            onClick={() => setActiveReport("revenue")}
          >
            Revenue Report
          </Pill>
          <Pill
            active={activeReport === "staff"}
            onClick={() => setActiveReport("staff")}
          >
            Staff Report
          </Pill>
        </div>

        <div className="flex gap-3 items-center w-full sm:w-auto">
          <div className="flex-1 sm:flex-none flex gap-3">
            <div className="bg-[#3D4142] px-3 py-2 rounded-lg flex items-center gap-2">
              <img src={calendar} alt="" className="w-4 h-4" />
              <span className="text-xs text-gray-300 whitespace-nowrap">
                01/04/2024 — 08/04/2024
              </span>
            </div>
            <button
              onClick={() => exportElementToPDF(exportRef.current)}
              className="px-3 py-2 rounded-lg font-semibold text-black whitespace-nowrap cursor-pointer"
              style={{ background: ACTIVE_COLOR }}
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>
      <div ref={exportRef}>
        <div className="grid grid-cols-1 md:[grid-template-columns:4fr_5fr] gap-6 mb-6">
          <div className="bg-[#232425] p-4 sm:p-6 rounded-xl">
            <h2 className="text-[20px] sm:text-[26px] font-semibold mb-4">
              {activeReport === "reservation"
                ? "Total Reservation"
                : activeReport === "revenue"
                ? "Total Revenue"
                : "Total Staff"}
            </h2>

            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div
                className="relative w-full max-w-[300px] mx-auto md:mx-0 md:flex-shrink-0"
                style={{ height: 260 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {donutData.map((d, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-[22px] sm:text-[30px] font-bold">Total</p>
                  <p className="text-[18px] sm:text-[26px]">{total}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:ml-auto md:justify-center">
                {donutData.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-6 h-3 rounded-full"
                      style={{ background: COLORS[i] }}
                    />
                    <span className="text-sm">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-[#232425] p-4 sm:p-6 rounded-xl">
            <div className="flex gap-2 overflow-x-auto mb-3">
              {["Confirmed", "Awaited", "Cancelled", "Failed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer"
                  style={{
                    background:
                      activeStatus === s ? ACTIVE_COLOR : "transparent",
                    color: activeStatus === s ? "black" : "#cfcfcf",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid stroke="#1f1f1f" vertical={false} />
                  <XAxis dataKey="month" stroke="#7b7b7b" />
                  <YAxis stroke="#7b7b7b" />
                  <Tooltip />
                  <Line
                    dataKey="confirmed"
                    stroke={ACTIVE_COLOR}
                    strokeWidth={3}
                    dot
                  />
                  <Line
                    dataKey="other"
                    stroke="#8b8b8b"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden space-y-3">
          {rows.map((row, i) => {
            const bg = i % 2 === 0 ? "#292C2D" : "#3D4142";

            return (
              <div key={i}>
                <div className="md:hidden px-4 py-4" style={{ background: bg }}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="text-[12px] text-pink-300 mb-1">
                        Reservation ID
                      </div>
                      <div className="text-sm">
                        {row.reservationId ?? row.sno ?? row.staffId}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="text-[12px] text-pink-300 mb-1">
                        Customer Name
                      </div>
                      <div className="text-sm">
                        {row.customer ?? row.topSelling ?? row.name}
                      </div>
                    </div>

                    <div className="flex-1 text-right">
                      <div className="text-[12px] text-pink-300 mb-1">
                        Phone number
                      </div>
                      <div className="text-sm">
                        {row.phone ??
                          row.totalRevenue ??
                          row.salary ??
                          row.phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="hidden md:grid px-5 py-4 items-center"
                  style={{
                    background: bg,
                    gridTemplateColumns: "repeat(6, 1fr) auto",
                    alignItems: "center",
                    columnGap: 24,
                  }}
                >
                  {activeReport === "reservation" && (
                    <>
                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Reservation ID
                        </span>
                        <span className="text-sm">{row.reservationId}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Customer Name
                        </span>
                        <span className="text-sm">{row.customer}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Phone number
                        </span>
                        <span className="text-sm">{row.phone}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Reservation Date
                        </span>
                        <span className="text-sm">{row.reservationDate}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Check In
                        </span>
                        <span className="text-sm">{row.checkIn}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Check Out
                        </span>
                        <span className="text-sm">{row.checkOut}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[12px] text-pink-300 block">
                          Total
                        </span>
                        <span className="text-sm">{row.total}</span>
                      </div>
                    </>
                  )}

                  {activeReport === "revenue" && (
                    <>
                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          S.No
                        </span>
                        <span className="text-sm">{row.sno}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Top Selling Food
                        </span>
                        <span className="text-sm">{row.topSelling}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Revenue Date
                        </span>
                        <span className="text-sm">{row.revenueDate}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Sell Price
                        </span>
                        <span className="text-sm">{row.sellPrice}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Profit
                        </span>
                        <span className="text-sm">{row.profit}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Profit Margin
                        </span>
                        <span className="text-sm">{row.profitMargin}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[12px] text-pink-300 block">
                          Total Revenue
                        </span>
                        <span className="text-sm">{row.totalRevenue}</span>
                      </div>
                    </>
                  )}

                  {activeReport === "staff" && (
                    <>
                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Staff ID
                        </span>
                        <span className="text-sm">{row.staffId}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Name
                        </span>
                        <span className="text-sm">{row.name}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Role
                        </span>
                        <span className="text-sm">{row.role}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Work Hours
                        </span>
                        <span className="text-sm">{row.workHours}</span>
                      </div>

                      <div style={dividerCell}>
                        <span className="text-[12px] text-pink-300 block">
                          Joined Date
                        </span>
                        <span className="text-sm">{row.joinedDate}</span>
                      </div>

                      <div style={{ paddingRight: 24 }}>
                        <span className="text-[12px] text-pink-300 block">
                          Salary
                        </span>
                        <span className="text-sm">{row.salary}</span>
                      </div>

                      <div className="text-right">
                        <span />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
