import React, { useRef, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ReferenceLine,
} from "recharts";

const COLORS = { pink: "#f7b6c9", gray: "#cfcfcf" };

const MONTHLY = [
  { name: "JAN", sales: 1200, revenue: 1100 },
  { name: "FEB", sales: 1700, revenue: 1400 },
  { name: "MAR", sales: 900, revenue: 1500 },
  { name: "APR", sales: 2000, revenue: 1700 },
  { name: "MAY", sales: 3000, revenue: 2200 },
  { name: "JUN", sales: 2600, revenue: 2300 },
  { name: "JUL", sales: 3100, revenue: 2400 },
  { name: "AUG", sales: 3300, revenue: 2700 },
  { name: "SEP", sales: 3500, revenue: 2900 },
  { name: "OCT", sales: 2900, revenue: 2700 },
  { name: "NOV", sales: 1500, revenue: 1800 },
  { name: "DEC", sales: 4700, revenue: 2800 },
];

const WEEKLY = [
  { name: "W1", sales: 800, revenue: 600 },
  { name: "W2", sales: 1200, revenue: 1000 },
  { name: "W3", sales: 900, revenue: 1100 },
  { name: "W4", sales: 1400, revenue: 1300 },
];

const DAILY = [
  { name: "Mon", sales: 200, revenue: 180 },
  { name: "Tue", sales: 300, revenue: 250 },
  { name: "Wed", sales: 250, revenue: 220 },
  { name: "Thu", sales: 400, revenue: 360 },
  { name: "Fri", sales: 450, revenue: 400 },
  { name: "Sat", sales: 600, revenue: 520 },
  { name: "Sun", sales: 520, revenue: 480 },
];

export default function OverviewChart() {
  const [range, setRange] = useState("Monthly");
  const wrapperRef = useRef(null);
  const data =
    range === "Monthly" ? MONTHLY : range === "Weekly" ? WEEKLY : DAILY;

  const handleExport = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const svg = wrapper.querySelector("svg");
    if (!svg) return alert("Chart not found for export");
    const serializer = new XMLSerializer();
    let svgStr = serializer.serializeToString(svg);
    if (!svgStr.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgStr = svgStr.replace(
        "<svg",
        '<svg xmlns="http://www.w3.org/2000/svg"'
      );
    }
    const svgWithBg = svgStr.replace("<svg", '<svg style="background:#242627"');
    const blob = new Blob([svgWithBg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#242627";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `overview-${range.toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert("Export failed");
    };
    img.src = url;
  };

  return (
    <div className=" " style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="bg-[#242627] rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between px-8">
          <div className="">
            <h2 className="text-2xl font-semibold">Overview</h2>

            {/* legend */}
            <div className="flex items-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-3 rounded-full inline-block"
                  style={{ background: COLORS.pink }}
                />
                <span className="text-sm opacity-80">Sales</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-3 rounded-full inline-block"
                  style={{ background: COLORS.gray }}
                />
                <span className="text-sm opacity-80">Revenue</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 ">
            {/* toggles */}
            <div className="flex sm:items-center gap-3 sm:py-10 items-start ">
              {["Monthly", "Daily", "Weekly"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-3 rounded-lg text-[16px] font-medium cursor-pointer ${
                    range === r ? "text-black" : "text-gray-300"
                  }`}
                  style={{
                    background: range === r ? COLORS.pink : "transparent",
                    minWidth: 68,
                    textAlign: "center",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            <button
              onClick={handleExport}
              className="px-6 py-3 rounded-lg text-sm border cursor-pointer"
              style={{ borderColor: COLORS.pink, color: COLORS.pink }}
            >
              ⤓ Export
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-6 " ref={wrapperRef} style={{ height: 380 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 12, right: 0, left: 0, bottom: 24 }}
            >
              <CartesianGrid
                horizontal={true}
                vertical={false}
                stroke="#2f3031"
                strokeWidth={1}
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#bdbdbd", fontSize: 13, fontWeight: 600 }}
                padding={{ left: 16, right: 16 }}
                tickMargin={12}
              />

              <YAxis
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#bdbdbd", fontSize: 12 }}
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                domain={[0, 6000]}
                ticks={[0, 1500, 3000, 4500, 6000]}
              />

              <Tooltip
                contentStyle={{
                  background: "#333335",
                  border: "none",
                  color: "#fff",
                }}
              />

              <Area
                type="monotone"
                dataKey="sales"
                stroke="transparent"
                fill={COLORS.pink}
                fillOpacity={0.06}
                isAnimationActive={false}
              />

              {/* Sales line */}
              <Line
                type="monotone"
                dataKey="sales"
                stroke={COLORS.pink}
                strokeWidth={3.5}
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: "#fff",
                  strokeWidth: 2,
                  fill: COLORS.pink,
                }}
                isAnimationActive={false}
              />

              {/* Revenue line */}
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={COLORS.gray}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />

              {range === "Monthly" && (
                <ReferenceLine
                  x="SEP"
                  stroke={COLORS.pink}
                  strokeWidth={1}
                  opacity={0.18}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
