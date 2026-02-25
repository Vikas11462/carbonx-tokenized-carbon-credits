import React from 'react';
import Header from '../components/Header';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen relative overflow-x-hidden selection:bg-yellow-500/30">
            {/* Background Orbs - Subtle and Fixed */}
            <div className="fixed -top-40 -right-40 w-[600px] h-[600px] bg-yellow-500/[0.03] blur-[120px] pointer-events-none rounded-full" />
            <div className="fixed -bottom-40 -left-40 w-[400px] h-[400px] bg-yellow-500/[0.02] blur-[100px] pointer-events-none rounded-full" />

            {/* Decorative Side Protocol labels */}
            <div className="fixed left-4 top-1/2 -translate-y-1/2 hidden 2xl:block pointer-events-none opacity-10">
                <p className="font-mono text-[9px] uppercase tracking-[1em]" style={{ writingMode: 'vertical-rl' }}>
                    PROT_v1.0.4 // NODE_ACTIVE // SYNC_STABLE
                </p>
            </div>

            <Header />

            <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {children}
            </main>

            {/* Noise overlay moved to layout or kept in body via CSS */}
        </div>
    );
}
