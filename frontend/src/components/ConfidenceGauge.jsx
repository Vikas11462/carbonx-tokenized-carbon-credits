export default function ConfidenceGauge({ value, size = 120 }) {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    // Color based on confidence (70% threshold)
    const isHealthy = value >= 70;
    const mainColor = isHealthy ? "#EAB308" : "#EF4444"; // yellow-500 or red-500

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Track */}
            <svg className="absolute transform -rotate-90" width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/[0.03]"
                />
                {/* Progress Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={mainColor}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>

            {/* Center Label */}
            <div className="flex flex-col items-center">
                <span className="text-2xl font-black tracking-tighter" style={{ color: mainColor }}>
                    {value}%
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Confidence
                </span>
            </div>

            {/* Target Marker at 70% */}
            <div
                className="absolute w-[2px] h-[10px] bg-white/20"
                style={{
                    top: "10px",
                    left: "50%",
                    transform: `translateX(-50%) rotate(${(70 / 100) * 360}deg)`,
                    transformOrigin: `0 ${size / 2 - 10}px`
                }}
            />
        </div>
    );
}
