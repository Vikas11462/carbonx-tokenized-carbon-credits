import React from 'react';

export default function CyberGlobe() {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
            {/* Outer Rotating Ring */}
            <div className="absolute w-full h-full border border-yellow-500/10 rounded-full animate-[spin_12s_linear_infinite]" />
            <div className="absolute w-full h-full border border-yellow-500/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" style={{ transform: 'rotateX(60deg)' }} />
            <div className="absolute w-full h-full border border-yellow-500/5 rounded-full animate-[spin_18s_linear_infinite]" style={{ transform: 'rotateY(60deg)' }} />

            {/* Wireframe Ball */}
            <div className="relative w-40 h-40">
                <div className="absolute inset-0 border-[0.5px] border-yellow-500/20 rounded-full" />
                <div className="absolute inset-0 border-[0.5px] border-yellow-500/10 rounded-full scale-x-50" />
                <div className="absolute inset-0 border-[0.5px] border-yellow-500/10 rounded-full scale-y-50" />

                {/* Glowing Core */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent blur-[2px] animate-pulse" />
                <div className="absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-yellow-500/40 to-transparent blur-[2px] animate-pulse" />
            </div>

            {/* Data Orbit Nodes */}
            <div className="absolute w-2 h-2 bg-yellow-400 rounded-full blur-[2px] animate-[ping_3s_infinite]" style={{ top: '10%', left: '50%' }} />
            <div className="absolute w-1.5 h-1.5 bg-yellow-500 rounded-full blur-[1px] animate-[ping_4s_infinite]" style={{ bottom: '20%', right: '15%' }} />
        </div>
    );
}
