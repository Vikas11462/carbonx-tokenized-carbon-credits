import os
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / "blockchain" / ".env")

RPC_URL = os.getenv("RPC_URL", "http://127.0.0.1:8545")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CARBON_CREDIT_ADDRESS")

# Default to Polygon Amoy, but use 31337 for local Hardhat node
CHAIN_ID = 31337 if "127.0.0.1" in RPC_URL or "localhost" in RPC_URL else 80002

