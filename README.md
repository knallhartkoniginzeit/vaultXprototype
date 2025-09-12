# Password DApp (sample project)

Folder layout and example files for a password DApp.
- Contracts: Solidity smart contract AccessControl
- Backend: FastAPI server with simple encryption and simulated mailbox
- Frontend: Next.js app (register, login, dashboard)

Instructions:
1. Compile & deploy the contract with Hardhat.
2. Fill backend/.env with your keys and deployed contract address.
3. Run backend: pip install -r backend/requirements.txt && uvicorn backend.server:app --reload
4. Run frontend: cd frontend && npm install && npm run dev
