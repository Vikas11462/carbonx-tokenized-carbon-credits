export default function RiskBar({ label, value, colorClass }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="label-text">{label}</span>
        <span className={`font-mono font-bold ${colorClass.text}`}>{value}%</span>
      </div>
      <div className="w-full bg-black/40 border border-yellow-500/10 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-out rounded-full ${colorClass.bg}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
