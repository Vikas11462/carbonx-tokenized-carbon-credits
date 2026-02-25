---
description: How to run the CarbonX project
---

This project consists of three main components that need to be running simultaneously: Internal Blockchain Node, Backend Oracle, and Frontend Dashboard.

### Prerequisites

- Node.js (v18+)
- Python (3.9+)
- PowerShell or Terminal

### 1. Start Local Blockchain
Open a terminal in the `blockchain` directory:
```powershell
cd blockchain
npm install
npx hardhat node
```

### 2. Deploy Smart Contracts
In a **new** terminal window, while the node is running:
```powershell
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```
> [!IMPORTANT]
> Note the deployed contract address and update it in `blockchain/.env` under `CARBON_CREDIT_ADDRESS`.

### 3. Start Backend Oracle
In a **new** terminal window, in the root directory:
```powershell
pip install -r carbonx/oracle/requirements.txt
python -m uvicorn carbonx.oracle.main:app
```

### 4. Start Frontend Dashboard
In a **new** terminal window:
```powershell
cd frontend
npm install
npm run dev
```

### Accessing the App
- **Dashboard**: [http://localhost:5173](http://localhost:5173)
- **API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
