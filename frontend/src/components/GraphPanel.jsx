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

const TREND_DAYS = 10;

const metricConfig = [
  {
    key: "temperature",
    label: "Temperature",
    lineColor: "#fb923c",
    fillColor: "rgba(251,146,60,0.08)",
    cardBorder: "border-orange-400/15",
    cardBg: "bg-orange-400/5",
    cardText: "text-orange-300/80",
    unit: "deg C",
    axis: "y",
    min: 0,
    max: 45,
  },
  {
    key: "water_quality",
    label: "Water Quality",
    lineColor: "#0ea5e9",
    fillColor: "rgba(14,165,233,0.06)",
    cardBorder: "border-cyan-400/15",
    cardBg: "bg-cyan-400/5",
    cardText: "text-cyan-300/80",
    unit: "0-100",
    axis: "y",
    min: 0,
    max: 100,
  },
  {
    key: "ndvi",
    label: "NDVI",
    lineColor: "#22c55e",
    fillColor: "rgba(34,197,94,0.06)",
    cardBorder: "border-emerald-400/15",
    cardBg: "bg-emerald-400/5",
    cardText: "text-emerald-300/80",
    unit: "proxy index",
    axis: "y1",
    min: 0,
    max: 1,
  },
  {
    key: "chlorophyll",
    label: "Chlorophyll",
    lineColor: "#a855f7",
    fillColor: "rgba(168,85,247,0.06)",
    cardBorder: "border-purple-400/15",
    cardBg: "bg-purple-400/5",
    cardText: "text-purple-300/80",
    unit: "pigment index",
    axis: "y",
    min: 0,
    max: 20,
  },
];

const extendTrend = (values = [], targetDays, min, max) => {
  const safeValues = values.map((value) => Number(value)).filter((value) => Number.isFinite(value));
  if (safeValues.length === 0) return Array.from({ length: targetDays }, () => 0);

  const result = [...safeValues.slice(0, targetDays)];
  const avgStep =
    safeValues.length > 1
      ? safeValues.slice(1).reduce((sum, value, index) => sum + (value - safeValues[index]), 0) /
        (safeValues.length - 1)
      : 0;

  while (result.length < targetDays) {
    const nextValue = result[result.length - 1] + avgStep;
    result.push(Math.min(max, Math.max(min, nextValue)));
  }

  return result.map((value) => Number(value.toFixed(2)));
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
  const trendSeries = useMemo(() => {
    if (!series) return null;

    return {
      timestamps: Array.from({ length: TREND_DAYS }, (_, index) => `Day ${index + 1}`),
      ...Object.fromEntries(
        metricConfig.map((metric) => [
          metric.key,
          extendTrend(series[metric.key], TREND_DAYS, metric.min, metric.max),
        ]),
      ),
    };
  }, [series]);

  return (
    <div className="sentinel-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="sentinel-title">Environmental Trends</h2>
          <p className="mt-2 text-sm text-slate-400">
            Clean 10-day trend projection from recent samples. NDVI uses the right axis for better readability.
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
        {metricConfig.map((metric) => (
          <div
            key={metric.key}
            className={`rounded-3xl border ${metric.cardBorder} ${metric.cardBg} px-4 py-3`}
          >
            <p className={`text-[10px] uppercase tracking-[0.25em] ${metric.cardText}`}>
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {trendSeries?.[metric.key]?.at(-1) ?? "--"}
            </p>
            <p className="text-xs text-slate-400">Day 10 | {metric.unit}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 h-[340px] rounded-[24px] border border-white/10 bg-gradient-to-b from-slate-950/60 to-slate-950/20 p-4">
        {!trendSeries ? (
          <p className="text-sm text-slate-500">Loading chart data...</p>
        ) : (
          <Line
            plugins={[activeGlowPlugin]}
            data={{
              labels: trendSeries.timestamps,
              datasets: metricConfig.map((metric) => ({
                label: metric.label,
                data: trendSeries[metric.key] || [],
                borderColor: metric.lineColor,
                backgroundColor: metric.fillColor,
                borderWidth: 3,
                pointBackgroundColor: metric.lineColor,
                pointBorderColor: "#0f172a",
                pointRadius: 0,
                pointHoverRadius: 7,
                yAxisID: metric.axis,
                fill: false,
                tension: 0.42,
              })),
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: { mode: "index", intersect: false },
              animation: { duration: 900, easing: "easeOutQuart" },
              plugins: {
                legend: {
                  position: "top",
                  align: "end",
                  labels: { color: "#cbd5e1", usePointStyle: true, boxWidth: 8, padding: 16 },
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
                    title: (items) => `${region.replaceAll("_", " ")} | ${items[0].label}`,
                    footer: () => "Projected using average step from recent samples",
                  },
                },
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: {
                    color: "#94a3b8",
                    maxRotation: 0,
                    callback: (_, index) => (index % 2 === 0 ? `D${index + 1}` : ""),
                  },
                  border: { color: "rgba(148,163,184,0.12)" },
                },
                y: {
                  position: "left",
                  grid: { color: "rgba(148,163,184,0.08)" },
                  ticks: { color: "#94a3b8", maxTicksLimit: 5 },
                  suggestedMin: 0,
                  suggestedMax: 100,
                  border: { color: "rgba(148,163,184,0.12)" },
                },
                y1: {
                  position: "right",
                  grid: { drawOnChartArea: false },
                  ticks: { color: "#22c55e", maxTicksLimit: 5 },
                  min: 0,
                  max: 1,
                  border: { color: "rgba(34,197,94,0.18)" },
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
