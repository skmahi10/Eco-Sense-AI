import { useEffect, useState } from "react";
import { fetchPrediction } from "../services/api";

const getBadgeClass = (level) => {
  if (level === "high") return "bg-rose-500/10 text-rose-300 border-rose-400/20";
  if (level === "medium") return "bg-amber-500/10 text-amber-300 border-amber-400/20";
  return "bg-emerald-500/10 text-emerald-300 border-emerald-400/20";
};

export default function PredictionPanel() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPrediction()
      .then((res) => setData(res.data.predictions || []))
      .catch(() => setData([]));
  }, []);

  return (
    <div className="sentinel-card p-5">
      <h2 className="sentinel-title">Next 3-Day Forecast</h2>
      <p className="mt-2 text-sm text-slate-400">
        Future parameter values and predicted final score using the same weighted formula.
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
              className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-white">
                  {item.region.replaceAll("_", " ")}
                </p>
                <span
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${getBadgeClass(item.predicted_risk)}`}
                >
                  Day 3: {item.predicted_final_score}/100
                </span>
              </div>

              <p className="mt-3 text-sm text-amber-200">{item.outcome}</p>

              <div className="mt-4 space-y-2">
                {item.forecast_days?.map((day) => (
                  <div
                    key={`${item.region}-${day.day}`}
                    className="rounded-2xl bg-white/5 px-3 py-2 text-xs text-slate-300"
                  >
                    <span className="font-semibold text-white">Day {day.day}</span>
                    {`: Score ${day.predicted_score}/100 | Temp ${day.temperature} C | WQ ${day.water_quality} | Humidity ${day.humidity}% | NDVI ${day.ndvi} | Wind ${day.wind} m/s | Trend ${day.trend_rate}`}
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
