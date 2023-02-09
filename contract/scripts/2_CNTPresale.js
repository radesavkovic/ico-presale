const hre = require("hardhat");

async function main() {

  const Erc20 = await hre.ethers.getContractFactory("Crinet");
  const erc20 = await Erc20.deploy();

  await erc20.deployed();
  console.log("CrinetToken deployed to:", erc20.address);

  const CNTPresale = await hre.ethers.getContractFactory("CNTPresale");
  const cntPresale = await CNTPresale.deploy(erc20.address);

  await cntPresale.deployed();
  console.log("CNTPresaleContract deployed to:", cntPresale.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });