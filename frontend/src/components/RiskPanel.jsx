import { useEffect, useState } from "react";
import { fetchAllZones } from "../services/api";

const metrics = [
  { key: "temperature_latest", label: "Temp", unit: "C" },
  { key: "water_quality_latest", label: "Water Quality", unit: "/100" },
  { key: "humidity_latest", label: "Humidity", unit: "%" },
  { key: "ndvi_latest", label: "NDVI", unit: "" },
  { key: "wind_latest", label: "Wind", unit: "m/s" },
  { key: "trend_rate_latest", label: "Trend Rate", unit: "" },
];

const getBadgeClass = (level) => {
  if (level === "high") return "bg-rose-500/10 text-rose-300 border-rose-400/20";
  if (level === "medium") return "bg-amber-500/10 text-amber-300 border-amber-400/20";
  return "bg-emerald-500/10 text-emerald-300 border-emerald-400/20";
};

export default function RiskPanel() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    fetchAllZones()
      .then((res) => setZones(Array.isArray(res.data) ? res.data : []))
      .catch(() => setZones([]));
  }, []);

  return (
    <div className="sentinel-card p-5">
      <h2 className="sentinel-title">Zone Parameter Scoreboard</h2>
      <p className="mt-2 text-sm text-slate-400">
        Final score for each zone using: Risk Score = 0.22*T + 0.24*(100-WQ) + 0.12*H + 0.18*NDVI + 0.10*Wind + 0.14*Trend
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {zones.length === 0 ? (
          <p className="text-sm text-slate-500">No zone data available.</p>
        ) : (
          zones.map((zone) => (
            <div
              key={zone.region}
              className="rounded-[24px] border border-white/10 bg-slate-950/30 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {zone.region.replaceAll("_", " ")}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Final Combined Score
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-white">
                    {zone.eco_risk_index}
                    <span className="text-sm text-slate-500">/100</span>
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${getBadgeClass(zone.risk_level)}`}
                  >
                    {zone.risk_level}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.key}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
                  >
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {zone[metric.key]}
                      <span className="ml-1 text-xs text-slate-500">
                        {metric.unit}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 rounded-2xl bg-white/5 p-3 text-xs leading-5 text-slate-300">
                {zone.explanation}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
