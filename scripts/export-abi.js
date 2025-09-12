const fs = require("fs");
const path = require("path");

async function main() {
  const abiPath = path.join(__dirname, "../artifacts/contracts/AccessControl.sol/AccessControl.json");
  const destFrontend = path.join(__dirname, "../frontend/contracts/AccessControl.json");
  const destBackend = path.join(__dirname, "../contracts/AccessControl.json");

  const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));
  fs.writeFileSync(destFrontend, JSON.stringify(abi, null, 2));
  fs.writeFileSync(destBackend, JSON.stringify(abi, null, 2));

  console.log("✅ ABI exported to frontend/contracts/ and backend/contracts/");
}

main().catch(console.error);
