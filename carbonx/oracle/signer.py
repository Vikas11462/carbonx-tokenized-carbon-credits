from pathlib import Path
import json
from web3 import Web3

from carbonx.oracle.config import RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS

# -------------------------------------------------
# Resolve project root safely (no relative paths)
# -------------------------------------------------
BASE_DIR = Path(__file__).resolve().parents[2]

ABI_PATH = (
    BASE_DIR
    / "blockchain"
    / "artifacts"
    / "contracts"
    / "CarbonCredit.sol"
    / "CarbonCredit.json"
)

if not ABI_PATH.exists():
    raise FileNotFoundError(
        f"CarbonCredit ABI not found at: {ABI_PATH}. "
        f"Did you run `npx hardhat compile`?"
    )

# -------------------------------------------------
# Web3 setup
# -------------------------------------------------
w3 = Web3(Web3.HTTPProvider(RPC_URL))

if not w3.is_connected():
    raise ConnectionError("Failed to connect to Polygon RPC")

account = w3.eth.account.from_key(PRIVATE_KEY)

with open(ABI_PATH, "r") as f:
    abi = json.load(f)["abi"]

contract = w3.eth.contract(
    address=Web3.to_checksum_address(CONTRACT_ADDRESS),
    abi=abi
)

# -------------------------------------------------
# Submit & verify project on-chain
# -------------------------------------------------
def submit_and_verify_project(
    location: str,
    area: int,
    co2: int,
    confidence: int,
    proof_cid: str
):
    nonce = w3.eth.get_transaction_count(account.address)

    tx = contract.functions.verifyProject(
        location,
        int(area),
        int(co2),
        int(confidence),
        proof_cid
    ).build_transaction({
        "from": account.address,
        "nonce": nonce,
        "gas": 500_000,
        "gasPrice": w3.eth.gas_price,
        "chainId": 31337  # localhost (use 80002 if Amoy)
    })

    signed_tx = account.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    events = contract.events.ProjectVerified().process_receipt(receipt)
    if not events:
        raise RuntimeError("ProjectVerified event not found")

    project_id = events[0]["args"]["projectId"]

    return {
        "tx_hash": tx_hash.hex(),
        "project_id": int(project_id)
    }

# -------------------------------------------------
# Mint credits to the user
# -------------------------------------------------
def mint_credits_on_chain(project_id: int, recipient: str, amount: int):
    nonce = w3.eth.get_transaction_count(account.address)
    
    # We use the oracle account as the verifier to call mintCredits
    tx = contract.functions.mintCredits(
        int(project_id),
        Web3.to_checksum_address(recipient),
        int(amount)
    ).build_transaction({
        "from": account.address,
        "nonce": nonce,
        "gas": 300_000,
        "gasPrice": w3.eth.gas_price,
        "chainId": 31337
    })

    signed_tx = account.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    return {
        "tx_hash": tx_hash.hex(),
        "status": "success"
    }
