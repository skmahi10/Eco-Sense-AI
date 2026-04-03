import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchGraph } from "../services/api";

ChartJS.register(
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
);

const activeGlowPlugin = {
  id: "activeGlowPlugin",
  afterDatasetsDraw(chart) {
    const activeItems = chart.tooltip?.getActiveElements?.() || [];
    if (!activeItems.length) return;

    const { ctx } = chart;
    activeItems.forEach((item) => {
      const point = item.element;
      if (!point) return;
      const colors = [
        "rgba(251,146,60,0.18)",
        "rgba(14,165,233,0.18)",
        "rgba(34,197,94,0.18)",
        "rgba(168,85,247,0.18)",
      ];

      ctx.save();
      ctx.beginPath();
      ctx.arc(point.x, point.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = colors[item.datasetIndex] || "rgba(255,255,255,0.12)";
      ctx.fill();
      ctx.restore();
    });
  },
};

export default function GraphPanel() {
  const [graphData, setGraphData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    fetchGraph()
      .then((res) => {
        const payload = res.data.graph_data || {};
        setGraphData(payload);
        setSelectedRegion(Object.keys(payload)[0] || "");
      })
      .catch(() => setGraphData({}));
  }, []);

  const regionList = useMemo(
    () => (graphData ? Object.keys(graphData) : []),
    [graphData],
  );

  const region = selectedRegion || regionList[0] || null;
  const series = region && graphData ? graphData[region] : null;

  return (
    <div className="sentinel-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="sentinel-title">Environmental Trends</h2>
          <p className="mt-2 text-sm text-slate-400">
            Temperature, water quality, NDVI, and chlorophyll movement by timestamp.
          </p>
        </div>

        {regionList.length > 0 && (
          <select
            value={region}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="max-w-[180px] rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-200 outline-none"
          >
            {regionList.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-3xl border border-orange-400/15 bg-orange-400/5 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-orange-300/80">Temp</p>
          <p className="mt-2 text-2xl font-semibold text-white">{series?.temperature?.at(-1) ?? "--"}</p>
          <p className="text-xs text-slate-400">deg C</p>
        </div>
        <div className="rounded-3xl border border-cyan-400/15 bg-cyan-400/5 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300/80">Water Quality</p>
          <p className="mt-2 text-2xl font-semibold text-white">{series?.water_quality?.at(-1) ?? "--"}</p>
          <p className="text-xs text-slate-400">0-100</p>
        </div>
        <div className="rounded-3xl border border-emerald-400/15 bg-emerald-400/5 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-300/80">NDVI</p>
          <p className="mt-2 text-2xl font-semibold text-white">{series?.ndvi?.at(-1) ?? "--"}</p>
          <p className="text-xs text-slate-400">proxy index</p>
        </div>
        <div className="rounded-3xl border border-purple-400/15 bg-purple-400/5 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-purple-300/80">Chlorophyll</p>
          <p className="mt-2 text-2xl font-semibold text-white">{series?.chlorophyll?.at(-1) ?? "--"}</p>
          <p className="text-xs text-slate-400">pigment index</p>
        </div>
      </div>

      <div className="mt-5 h-[340px] rounded-[24px] border border-white/10 bg-gradient-to-b from-slate-950/60 to-slate-950/20 p-4">
        {!series ? (
          <p className="text-sm text-slate-500">Loading chart data...</p>
        ) : (
          <Line
            plugins={[activeGlowPlugin]}
            data={{
              labels: series.timestamps,
              datasets: [
                {
                  label: "Temperature",
                  data: series.temperature || [],
                  borderColor: "#fb923c",
                  backgroundColor: "rgba(251,146,60,0.12)",
                  borderWidth: 3,
                  pointBackgroundColor: "#fb923c",
                  pointBorderColor: "#0f172a",
                  pointRadius: 4,
                  pointHoverRadius: 9,
                  fill: true,
                  tension: 0.5,
                },
                {
                  label: "Water Quality",
                  data: series.water_quality || [],
                  borderColor: "#0ea5e9",
                  backgroundColor: "rgba(14,165,233,0.08)",
                  borderWidth: 3,
                  pointBackgroundColor: "#0ea5e9",
                  pointBorderColor: "#0f172a",
                  pointRadius: 4,
                  pointHoverRadius: 9,
                  fill: true,
                  tension: 0.5,
                },
                {
                  label: "NDVI",
                  data: series.ndvi || [],
                  borderColor: "#22c55e",
                  backgroundColor: "rgba(34,197,94,0.1)",
                  borderWidth: 3,
                  pointBackgroundColor: "#22c55e",
                  pointBorderColor: "#0f172a",
                  pointRadius: 4,
                  pointHoverRadius: 9,
                  fill: true,
                  tension: 0.5,
                },
                {
                  label: "Chlorophyll",
                  data: series.chlorophyll || series.ndvi || [],
                  borderColor: "#a855f7",
                  backgroundColor: "rgba(168,85,247,0.1)",
                  borderWidth: 3,
                  pointBackgroundColor: "#a855f7",
                  pointBorderColor: "#0f172a",
                  pointRadius: 4,
                  pointHoverRadius: 9,
                  fill: true,
                  tension: 0.5,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: { mode: "index", intersect: false },
              animation: { duration: 900, easing: "easeOutQuart" },
              plugins: {
                legend: {
                  labels: { color: "#cbd5e1", usePointStyle: true, boxWidth: 8, padding: 18 },
                },
                tooltip: {
                  backgroundColor: "rgba(15,23,42,0.97)",
                  borderColor: "rgba(56,189,248,0.28)",
                  borderWidth: 1,
                  padding: 14,
                  cornerRadius: 18,
                  titleColor: "#f8fafc",
                  bodyColor: "#cbd5e1",
                  displayColors: true,
                  boxPadding: 6,
                  callbacks: {
                    title: (items) => `${region.replaceAll("_", " ")} | Sample ${items[0].label}`,
                    footer: () => "1 point = 1 timestamped sample",
                  },
                },
              },
              scales: {
                x: {
                  grid: { color: "rgba(148,163,184,0.08)" },
                  ticks: { color: "#94a3b8" },
                  border: { color: "rgba(148,163,184,0.12)" },
                },
                y: {
                  grid: { color: "rgba(148,163,184,0.08)" },
                  ticks: { color: "#94a3b8" },
                  border: { color: "rgba(148,163,184,0.12)" },
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
