import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapPanel() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/analysis/")
      .then((res) => res.json())
      .then((resData) => setZones(Array.isArray(resData) ? resData : []))
      .catch(() => setZones([]));
  }, []);

  const getRiskColor = (riskLevel) => {
    if (riskLevel === "high") return "#ef4444";
    if (riskLevel === "medium") return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div className="sentinel-card p-5">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="sentinel-title">Zone Risk Map</h2>
          <p className="mt-2 text-sm text-slate-400">
            Combined marine risk from water quality, NDVI, temperature, humidity, wind, and trend.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
          <span className="rounded-full bg-emerald-400/10 px-3 py-2 text-emerald-300">Low</span>
          <span className="rounded-full bg-amber-400/10 px-3 py-2 text-amber-300">Medium</span>
          <span className="rounded-full bg-rose-400/10 px-3 py-2 text-rose-300">High</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/40">
        <MapContainer center={[14.5, 76.8]} zoom={5} scrollWheelZoom>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

          {zones.map((zone) => (
            <CircleMarker
              key={zone.region}
              center={[zone.lat, zone.lon]}
              radius={14}
              pathOptions={{
                color: getRiskColor(zone.risk_level),
                fillColor: getRiskColor(zone.risk_level),
                fillOpacity: 0.75,
                weight: 2,
              }}
            >
              <Popup>
                <div className="min-w-[220px] text-sm text-slate-700">
                  <p className="mb-2 font-semibold text-slate-900">
                    {zone.region.replaceAll("_", " ")}
                  </p>
                  <p>Risk: {zone.risk_level} ({zone.eco_risk_index}/100)</p>
                  <p>Temperature: {zone.temperature_latest} deg C</p>
                  <p>Water Quality: {zone.water_quality_latest}/100</p>
                  <p>Humidity: {zone.humidity_latest}%</p>
                  <p>NDVI: {zone.ndvi_latest}</p>
                  <p>Wind: {zone.wind_latest} m/s</p>
                  <p>Trend Rate: {zone.trend_rate_latest}</p>
                  <p className="mt-2 text-xs text-slate-600">{zone.explanation}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
