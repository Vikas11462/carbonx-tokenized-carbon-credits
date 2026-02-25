import { useState } from "react";
import RiskBar from "./RiskBar";
import ConfidenceGauge from "./ConfidenceGauge";
import { mintCredits } from "../api";

export default function VerificationCard({ data }) {
    const [showMetadata, setShowMetadata] = useState(false);
    const [minting, setMinting] = useState(false);
    const [minted, setMinted] = useState(false);

    if (!data) return null;

    const handleMint = async () => {
        if (!window.ethereum) return alert("Install Metamask");

        setMinting(true);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length === 0) return alert("Please connect wallet first");

            await mintCredits({
                project_id: data.project_id,
                recipient: accounts[0],
                amount: data.co2Kg
            });

            setMinted(true);
        } catch (err) {
            console.error("Minting failed", err);
            alert("MINT_FAILURE: Oracle node rejected transaction");
        } finally {
            setMinting(false);
        }
    };

    return (
        <div className="professional-card animate-fade-in border-yellow-500/20">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-white m-0">Protocol Verified</h3>
                    <p className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-widest">
                        {data.projectType} // {data.location}
                    </p>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/10 px-3 py-1 rounded-sm text-yellow-500 text-[10px] font-bold font-mono">
                    {data.project_id}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-10">
                <div className="flex flex-col items-center justify-center">
                    <ConfidenceGauge value={data.confidence} />
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                        <span className="label-text mb-3">Auditor Summary</span>
                        <p className="text-sm font-light text-slate-400 leading-relaxed">
                            Orbital signals for <span className="text-white">{data.location}</span> align with reported <span className="text-white">{data.areaHectares}ha</span> boundary signatures.
                            Carbon accumulation verified as authentic.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 pt-10 border-t border-white/5">
                <div className="space-y-4">
                    {[
                        { label: "On-Chain Proof", val: data.tx_hash },
                        { label: "IPFS Manifest", val: data.proof_cid }
                    ].map(item => (
                        <div key={item.label} className="flex justify-between border-b border-white/5 pb-3">
                            <span className="label-text text-[10px]">{item.label}</span>
                            <span className="font-mono text-[10px] text-slate-500 truncate w-32 text-right" title={item.val}>
                                {item.val}
                            </span>
                        </div>
                    ))}
                    <div className="flex justify-between pt-1">
                        <span className="label-text text-[10px]">Status</span>
                        <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm" />
                            {minted ? "Tokenized" : "Immutable"}
                        </span>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                    <button
                        onClick={() => setShowMetadata(!showMetadata)}
                        className="w-full text-[10px] font-bold mb-4 text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
                    >
                        {showMetadata ? "[-] Dismiss Metadata" : "[+] View System Metadata"}
                    </button>

                    {showMetadata && (
                        <div className="p-4 bg-black/40 rounded-sm mb-6 font-mono text-[10px] text-slate-500 leading-relaxed border border-white/5">
                            <pre className="whitespace-pre-wrap">
                                {JSON.stringify({
                                    "@type": "CarbonProof",
                                    "method": "SatelliteNDVI",
                                    "confidence": data.confidence,
                                    "timestamp": new Date().toISOString()
                                }, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={() => window.open(`http://127.0.0.1:8545/tx/${data.tx_hash}`, '_blank')}
                            className="flex-1 py-3 text-[10px] font-bold border border-white/10 text-slate-400 hover:bg-white/5 transition-all text-center"
                        >
                            VIEW ON EXPLORER
                        </button>
                        <button
                            onClick={handleMint}
                            disabled={minting || minted}
                            className="flex-1 py-3 text-[10px] font-bold bg-yellow-500 text-black hover:bg-white disabled:opacity-50 transition-all text-center"
                        >
                            {minting ? "ISSUING..." : minted ? "MINTED" : "MINT CREDIT"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
