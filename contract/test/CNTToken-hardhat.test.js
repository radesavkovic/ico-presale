const { expect } = require("chai");
const { ethers } = require("hardhat");

require("@nomiclabs/hardhat-ethers");
const { BigNumber } = require("ethers");

const getNumberFromBN = (bn, d) => {
  return BigNumber.from(bn).div(Math.pow(10, d)).toNumber();
}

const formatNumberFromBN = (bn, d) => {
  return (getNumberFromBN(bn, d)).toString().split("").reverse().reduce(function(acc, num, i, orig) {return num + (num != "-" && i && !(i % 3) ? "," : "") + acc;}, "");;
}

contract("Crinet", (accounts) => {
  let Crinet, token, owner, account1, account2;
  let dec;

  before(async () => {
    [owner, account1, account2, account3, account4, account5, account6] = await ethers.getSigners();

    Crinet = await hre.ethers.getContractFactory('Crinet');
    token = await Crinet.deploy();

    await token.deployed();
    console.log("Crinet deployed to:", token.address);
  });

  it('Check contract status', async () => {
    dec = await token.decimals();

    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(ownerBalance);
    console.log("Owner balance : ", formatNumberFromBN(ownerBalance, dec));

    expect(await token.name()).to.equal("Crinet");
    console.log("Contract name : ", await token.name());

    expect(await token.symbol()).to.equal("CNT");
    console.log("Contract symbol : ", await token.symbol());

    expect(await token.decimals()).to.equal(9);
    console.log("Contract decimals : ", await token.decimals());
  });

  it('Should transfer tokens between accounts', async () => {
    await token.transfer(account1.address, 500000000000);
    let account1Balance = await token.balanceOf(account1.address);
    expect(account1Balance).to.equal(500000000000);

    await token.connect(account1).transfer(account2.address, 250000000000);
    const account2Balance = await token.balanceOf(account2.address);
    expect(account2Balance).to.equal(250000000000);

    const ownerBalance = await token.balanceOf(owner.address);
    account1Balance = await token.balanceOf(account1.address);

    console.log("Owner Balance : ", formatNumberFromBN(ownerBalance, dec));
    console.log("Account1 Balance : ", formatNumberFromBN(account1Balance, dec));
    console.log("Account2 Balance : ", formatNumberFromBN(account2Balance, dec));
  });

  it('Should failed transfer negative tokens between accounts', async () => {
    console.log("Trying to transfer -1 to account1");
    await expect(token.transfer(account1.address, -100000000000)).to.be.reverted;
    let account1Balance = await token.balanceOf(account1.address);
    expect(account1Balance).to.equal(250000000000);

    await expect(token.connect(account1).transfer(account2.address, -100000000000)).to.be.reverted;
    const account2Balance = await token.balanceOf(account2.address);
    expect(account2Balance).to.equal(250000000000);

    const ownerBalance = await token.balanceOf(owner.address);
    account1Balance = await token.balanceOf(account1.address);

    console.log("Owner Balance : ", formatNumberFromBN(ownerBalance, dec));
    console.log("Account1 Balance : ", formatNumberFromBN(account1Balance, dec));
    console.log("Account2 Balance : ", formatNumberFromBN(account2Balance, dec));
  });

  it('Should failed transfer tokens from account with zero balance', async () => {
    let account2Balance = await token.balanceOf(account2.address);
    let account3Balance = await token.balanceOf(account3.address);
    console.log("Account2 Balance : ", formatNumberFromBN(account2Balance, dec));
    console.log("Account3 Balance : ", formatNumberFromBN(account3Balance, dec));

    console.log("Trying to transfer 10 from account3 to account2");

    await expect(token.connect(account3).transfer(account2.address, 1000000000000)).to.be.reverted;
    account2Balance = await token.balanceOf(account2.address);
    expect(account2Balance).to.equal(250000000000);

    account3Balance = await token.balanceOf(account3.address);

    console.log("Account2 Balance : ", formatNumberFromBN(account2Balance, dec));
    console.log("Account3 Balance : ", formatNumberFromBN(account3Balance, dec));
  });


  it('Should fail to transfer 2 tokens when balance is 1 token', async () => {
    await token.transfer(account4.address, 1)

    let account4Balance = await token.balanceOf(account4.address);
    let account5Balance = await token.balanceOf(account5.address);
    console.log("Account4 Balance : ", formatNumberFromBN(account4Balance, 0));
    console.log("Account5 Balance : ", formatNumberFromBN(account5Balance, 0));

    console.log("Trying to transfer 2 from account4 to account5");

    await expect(token.connect(account4).transfer(account5.address, 2)).to.be.reverted;
    account4Balance = await token.balanceOf(account4.address);
    account5Balance = await token.balanceOf(account5.address);
    expect(account4Balance).to.equal(1);
    expect(account5Balance).to.equal(0);
    console.log("Account4 Balance : ", formatNumberFromBN(account4Balance, 0));
    console.log("Account5 Balance : ", formatNumberFromBN(account5Balance, 0));
  });

  it('Should fail to transfer 2 tokens when balance is 1 tokens in base units', async () => {
    await token.transfer(account5.address, 10000000000)

    let account5Balance = await token.balanceOf(account5.address);
    let account6Balance = await token.balanceOf(account6.address);
    console.log("Account5 Balance : ", formatNumberFromBN(account5Balance, dec));
    console.log("Account6 Balance : ", formatNumberFromBN(account6Balance, dec));

    console.log("Trying to transfer 2 from account5 to account6");

    await expect(token.connect(account5).transfer(account5.address, 20000000000)).to.be.reverted;
    account5Balance = await token.balanceOf(account5.address);
    account6Balance = await token.balanceOf(account6.address);
    expect(account5Balance).to.equal(10000000000);
    expect(account6Balance).to.equal(0);
    console.log("Account5 Balance : ", formatNumberFromBN(account5Balance, dec));
    console.log("Account6 Balance : ", formatNumberFromBN(account6Balance, dec));
  });

  it('Should failed transfer tokens that are greater than current balance', async () => {
    let account1Balance = await token.balanceOf(account1.address);
    let account2Balance = await token.balanceOf(account2.address);
    console.log("Account1 Balance : ", formatNumberFromBN(account1Balance, dec));
    console.log("Account2 Balance : ", formatNumberFromBN(account2Balance, dec));

    console.log("Account1 tries to transfer 50 Token to account2");
    await expect(token.connect(account1).transfer(account2.address, 500000000000)).to.be.reverted;
    account1Balance = await token.balanceOf(account1.address);
    account2Balance = await token.balanceOf(account2.address);
    expect(account1Balance).to.equal(250000000000);
    expect(account2Balance).to.equal(250000000000);

    console.log("Account1 Balance : ", formatNumberFromBN(account1Balance, dec));
    console.log("Account2 Balance : ", formatNumberFromBN(account2Balance, dec));
  });
})
