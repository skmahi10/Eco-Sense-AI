import MapPanel from "./components/MapPanel";
import GraphPanel from "./components/GraphPanel";
import AlertsPanel from "./components/AlertsPanel";
import PredictionPanel from "./components/PredictionPanel";
import Chatbot from "./components/Chatbot";
import RiskPanel from "./components/RiskPanel";

function App() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900/95 to-cyan-950/50 px-6 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
            EcoSense-AI
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white sm:text-5xl">
                Marine Intelligence Dashboard
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
                Monitor zone risk, anomaly alerts, and near-term predictions in
                one clean command center.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Status</p>
                <p className="text-sm font-semibold text-emerald-200">System Online</p>
              </div>
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">Coverage</p>
                <p className="text-sm font-semibold text-cyan-200">Multi-Zone Scan</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-9">
            <MapPanel />
          </div>
          <div className="xl:col-span-3">
            <Chatbot />
          </div>
          <div className="xl:col-span-4">
            <GraphPanel />
          </div>
          <div className="xl:col-span-4">
            <AlertsPanel />
          </div>
          <div className="xl:col-span-4">
            <PredictionPanel />
          </div>
          <div className="xl:col-span-12">
            <RiskPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
