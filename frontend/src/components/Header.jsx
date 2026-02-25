import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        // Check if already connected
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    if (accounts.length > 0) setAccount(accounts[0]);
                });

            window.ethereum.on('accountsChanged', (accs) => {
                setAccount(accs.length > 0 ? accs[0] : null);
            });
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install Metamask");
            return;
        }
        try {
            const provider = new BrowserProvider(window.ethereum);

            // Network Safety Check
            const network = await provider.getNetwork();
            if (network.chainId !== 31337n) {
                alert("NETWORK_ERROR: Please switch Metamask to Localhost 8545 (Hardhat)");
                return;
            }

            const accounts = await provider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
        } catch (err) {
            console.error("Connection failed", err);
        }
    };

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-yellow-500/20' : 'bg-transparent'} p-4 flex justify-between items-center`}>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-black text-xl">
                    C
                </div>
                <h1 className="text-2xl font-black yellow-glow m-0">CARBON<span className="text-white">X</span></h1>
            </div>

            <nav className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-yellow-500">ORACLE ONLINE</span>
                </div>
                <button
                    onClick={connectWallet}
                    className="text-xs font-bold px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500 hover:text-black transition-all rounded-sm uppercase tracking-widest"
                >
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "CONNECT WALLET"}
                </button>
            </nav>
        </header>
    );
}
