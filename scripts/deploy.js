const hre = require("hardhat");

async function main() {
    const AccessControl = await hre.ethers.getContractFactory("AccessControl");
    const accessControl = await AccessControl.deploy();
    await accessControl.deployed();

    console.log("✅ AccessControl deployed at:", accessControl.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
