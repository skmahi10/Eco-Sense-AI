import { useEffect, useState } from "react";
import { fetchPrediction } from "../services/api";

const getBadgeClass = (level) => {
  if (level === "high") return "bg-rose-500/10 text-rose-300 border-rose-400/20";
  if (level === "medium") return "bg-amber-500/10 text-amber-300 border-amber-400/20";
  return "bg-emerald-500/10 text-emerald-300 border-emerald-400/20";
};

const summaryCards = (item) => [
  {
    label: "10-Day Avg Risk",
    value: `${item.forecast_summary?.avg_score ?? "--"}/100`,
    tone: "from-rose-500/10 to-slate-900/20 border-rose-400/15",
  },
  {
    label: "Peak Day",
    value: `Day ${item.forecast_summary?.peak_day ?? "--"}`,
    tone: "from-violet-500/10 to-slate-900/20 border-violet-400/15",
  },
  {
    label: "Avg Temp",
    value: `${item.forecast_summary?.avg_temperature ?? "--"} C`,
    tone: "from-orange-500/10 to-slate-900/20 border-orange-400/15",
  },
  {
    label: "Avg WQ",
    value: `${item.forecast_summary?.avg_water_quality ?? "--"}/100`,
    tone: "from-sky-500/10 to-slate-900/20 border-sky-400/15",
  },
  {
    label: "Avg NDVI",
    value: item.forecast_summary?.avg_ndvi ?? "--",
    tone: "from-emerald-500/10 to-slate-900/20 border-emerald-400/15",
  },
];

export default function PredictionPanel() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPrediction()
      .then((res) => setData(res.data.predictions || []))
      .catch(() => setData([]));
  }, []);

  return (
    <div className="sentinel-card p-5">
      <h2 className="sentinel-title">Next 10-Day Forecast</h2>
      <p className="mt-2 text-sm text-slate-400">
        Compact 10-day averages, peak-risk day, and daily projected score using the same weighted formula.
      </p>

      <div className="mt-5 space-y-3">
        {data.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-400">
            No prediction data available.
          </div>
        ) : (
          data.slice(0, 4).map((item) => (
            <div
              key={item.region}
              className="rounded-[24px] border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-950/40 to-cyan-950/10 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-white">
                  {item.region.replaceAll("_", " ")}
                </p>
                <span
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${getBadgeClass(item.predicted_risk)}`}
                >
                  10-Day Avg: {item.forecast_summary?.avg_score ?? item.predicted_final_score}/100
                </span>
              </div>

              <p className="mt-3 text-sm text-amber-200">{item.outcome}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-5">
                {summaryCards(item).map((metric) => (
                  <div
                    key={`${item.region}-${metric.label}`}
                    className={`rounded-2xl border bg-gradient-to-br ${metric.tone} px-3 py-3`}
                  >
                    <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {item.forecast_days?.map((day) => (
                  <div
                    key={`${item.region}-${day.day}`}
                    className="rounded-2xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.08] via-slate-800/35 to-slate-950/20 px-3 py-3"
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                      Day {day.day}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {day.predicted_score}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      T {day.temperature} C | WQ {day.water_quality}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                {item.explanation}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
