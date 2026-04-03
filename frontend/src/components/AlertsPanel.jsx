import { useEffect, useState } from "react";
import { fetchAlerts } from "../services/api";

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts()
      .then((res) => setAlerts(res.data.alerts || []))
      .catch(() => setAlerts([]));
  }, []);

  return (
    <div className="sentinel-card p-5">
      <h2 className="sentinel-title">Alerts</h2>
      <p className="mt-2 text-sm text-slate-400">
        Active anomaly warnings and priority status.
      </p>

      <div className="mt-5 space-y-3">
        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-200">
            No active alerts right now.
          </div>
        ) : (
          alerts.map((alert, index) => (
            <div
              key={`${alert.region}-${index}`}
              className="rounded-2xl border border-rose-400/15 bg-rose-400/5 p-4"
            >
              <p className="text-base font-semibold text-white">{alert.region}</p>
              <p className="mt-1 text-sm text-slate-300">{alert.message}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em]">
                <span className="rounded-full bg-rose-400/10 px-3 py-1 text-rose-300">
                  {alert.priority}
                </span>
                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-300">
                  Confidence {alert.confidence}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
