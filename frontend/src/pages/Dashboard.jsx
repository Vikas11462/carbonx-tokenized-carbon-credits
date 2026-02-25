import { useState, useEffect } from "react";
import ProjectForm from "../components/ProjectForm";
import VerificationCard from "../components/VerificationCard";
import AppLayout from "../layouts/AppLayout";
import { ACTIVITY_LOG, NETWORK_METRICS } from "../constants";

function AnimatedCounter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    const endValue = parseInt(value.toString().replace(/[^0-9]/g, ''));
    if (isNaN(endValue)) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count.toLocaleString()}{value.toString().includes('k') ? 'k' : ''}</span>;
}

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [activityIdx, setActivityIdx] = useState(0);

  useEffect(() => {
    const ticker = setInterval(() => {
      setActivityIdx(prev => (prev + 1) % ACTIVITY_LOG.length);
    }, 5000);
    return () => clearInterval(ticker);
  }, []);

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Information Panel */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-12 animate-fade-in">
          <section className="space-y-6">
            <h2 className="text-6xl md:text-7xl font-bold leading-tight">
              Ecosystem <br />
              <span className="text-yellow-500">Validation</span>
            </h2>
            <p className="text-lg text-slate-400 font-light leading-relaxed max-w-sm">
              Modular protocol for terrestrial biomass verification.
              Bridging environmental auditing with cryptographic proof.
            </p>
          </section>

          <div className="grid grid-cols-2 gap-8">
            <div className="has-tooltip border-l border-yellow-500/20 pl-6 py-2">
              <span className="label-text mb-2">Cumulative Offset</span>
              <span className="text-4xl font-bold text-white">
                <AnimatedCounter value={NETWORK_METRICS.cumulativeOffset} />
                <span className="text-yellow-500 text-sm ml-1">t</span>
              </span>
              <span className="tooltip">Total metric tons validated across global nodes.</span>
            </div>
            <div className="has-tooltip border-l border-yellow-500/20 pl-6 py-2">
              <span className="label-text mb-2">Active Nodes</span>
              <span className="text-4xl font-bold text-white">
                <AnimatedCounter value={NETWORK_METRICS.activeNodes} />
              </span>
              <span className="tooltip">Decentralized validators currently online.</span>
            </div>
          </div>

          <div className="p-5 bg-yellow-500/[0.03] border border-yellow-500/10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-yellow-500/40 tracking-widest uppercase">Protocol Feed</span>
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
            </div>
            <p className="text-xs font-mono text-slate-400 h-4 overflow-hidden" key={activityIdx}>
              {ACTIVITY_LOG[activityIdx]}
            </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-8">
          <ProjectForm onResult={setResult} />

          {result ? (
            <VerificationCard data={result} />
          ) : (
            <div className="p-20 border border-dashed border-white/5 bg-white/[0.01] rounded-lg text-center">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Awaiting Verification Parameters
              </h3>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
