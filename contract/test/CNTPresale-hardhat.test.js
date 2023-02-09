const { expect } = require("chai");
const { MockProvider } = require("ethereum-waffle");
const { ethers } = require("hardhat");
const { time } = require('openzeppelin-test-helpers');

require("@nomiclabs/hardhat-ethers");
const assert = require('assert').strict;

const getNumberFromBN = (bn, d) => {
   return ethers.utils.formatUnits(bn, d);
}

const getBNFromNumber = (n, d) => {
   return ethers.utils.parseUnits(n, d);
}

function sleep(milliseconds) {
   const date = Date.now();
   let currentDate = null;
   do {
      currentDate = Date.now();
   } while (currentDate - date < milliseconds)
}


contract("CNTPresale", (accounts) => {
   let token;
   let busd;

   before(async () => {

      [owner, ...accounts] = await ethers.getSigners();
      Erc20 = await hre.ethers.getContractFactory("Crinet");
      token = await Erc20.deploy();

      await token.deployed();
      console.log("CrinetToken deployed to:", token.address);

      BUSDToken = await hre.ethers.getContractFactory("BUSDToken");
      busd = await BUSDToken.deploy();

      await busd.deployed();
      console.log("BUSDToken deployed to:", busd.address);

      CNTPresale = await hre.ethers.getContractFactory("CNTPresale");
      cntPresale = await CNTPresale.deploy(token.address, busd.address, owner.address);

      await cntPresale.deployed();

      console.log("CNTPresaleContract deployed to:", cntPresale.address);
      const approveAmount = await busd.totalSupply();
      await busd.approve(cntPresale.address, approveAmount);

      await busd.connect(accounts[0]).approve(cntPresale.address, getBNFromNumber('10', 18));
      await busd.connect(accounts[1]).approve(cntPresale.address, 200000000000000);
      await busd.connect(accounts[2]).approve(cntPresale.address, 300000000000000);
      await busd.connect(accounts[3]).approve(cntPresale.address, 400000000000000);
      await busd.connect(accounts[4]).approve(cntPresale.address, 1000000000000000);

      const approveAmt = await token.totalSupply();
      console.log("CNT Total Supply : " + approveAmt);
   });

   it('Check Account Balances Before Buying', async () => {
      console.log("Balance of CNT on presale contract : " + await token.balanceOf(cntPresale.address));
      await token.transfer(cntPresale.address, getBNFromNumber('1', 18));
      console.log("Balance of CNT on presale contract : " + await token.balanceOf(cntPresale.address));

      await busd.transfer(accounts[0].address, getBNFromNumber('1000000', 18));
      await busd.transfer(accounts[1].address, 2000000000000);
      await busd.transfer(accounts[2].address, 3000000000000);
      await busd.transfer(accounts[3].address, 4000000000000);
      await busd.transfer(accounts[4].address, 10000000000000);
      await busd.transfer(accounts[5].address, 6000000000000);

      const balanceOfAccount0 = await busd.balanceOf(accounts[0].address);
      const balanceOfAccount1 = await busd.balanceOf(accounts[1].address);
      const balanceOfAccount2 = await busd.balanceOf(accounts[2].address);
      const balanceOfAccount3 = await busd.balanceOf(accounts[3].address);
      const balanceOfAccount4 = await busd.balanceOf(accounts[4].address);
      const balanceOfAccount5 = await busd.balanceOf(accounts[5].address);

      console.log("accounts 0 : " + balanceOfAccount0);
      console.log("accounts 1 : " + balanceOfAccount1);
      console.log("accounts 2 : " + balanceOfAccount2);
      console.log("accounts 3 : " + balanceOfAccount3);
      console.log("accounts 4 : " + balanceOfAccount4);
      console.log("accounts 5 : " + balanceOfAccount5);

      const ownerBalance = await busd.balanceOf(owner.address);
      console.log("Owner balance after transfer : " + ownerBalance);
   });

   it('Check presale status', async () => {
      for (let index = 1; index < 4; index++) {
         let roundInfo = await cntPresale.roundInfos(index);
         
         console.log("ROUND #" + index);
         console.log("CNT price: " + roundInfo[0]);
         console.log("Hard Cap: " + roundInfo[1]);
      }

      console.log("====================");

      const activeRound = await cntPresale.currentRound();
      console.log("Active Round: " + activeRound);
   });

   it('Buy token before starting ICO', async () => {
      let balanceOfAccount = await busd.balanceOf(accounts[0].address);
      console.log("balance of account0 before buying: " + balanceOfAccount);

      await expect(cntPresale.connect(accounts[0]).buyTokens(balanceOfAccount, accounts[5].address)).to.be.reverted;

      balanceOfAccount = await busd.balanceOf(accounts[0].address);

      console.log("balance of account0 after buying: " + balanceOfAccount);
   });

   it('Start ICO ROUND #1', async () => {
      const endTime = Date.now() + 1000 * 60 * 60 * 24;

      await expect(cntPresale.startICO(0, endTime, 0)).to.be.reverted;
      await cntPresale.startICO(1, endTime, 0);

      const activeRound = await cntPresale.currentRound();
      console.log("ACTIVE ROUND #" + activeRound);

      const roundInfo = await cntPresale.roundInfos(activeRound);
      
      console.log("CNT price: " + roundInfo[0]);
      console.log("Hard Cap: " + roundInfo[1]);
      console.log("START TIME: " + roundInfo[2]);
      console.log("END TIME: " + roundInfo[3]);
   });

   it('Start ICO ROUND #1 again', async () => {
      const endTime = Date.now() + 1000 * 60 * 60 * 24;
      await expect(cntPresale.startICO(1, endTime, 0)).to.be.reverted;
      await expect(cntPresale.startICO(2, endTime, 0)).to.be.reverted;
      await expect(cntPresale.startICO(3, endTime, 0)).to.be.reverted;
      await expect(cntPresale.setPrice(0, 2000)).to.be.reverted;
      await expect(cntPresale.setPrice(1, 2000)).to.be.reverted;
      await cntPresale.setPrice(2, 40);

      console.log("Starting ICO is failed before PREV ROUND END");
   });

   it('Buy tokens', async () => {
      let balanceOfAccount = await busd.balanceOf(accounts[0].address);
      console.log("BUSD balance of account0 before buying: " + balanceOfAccount);

      balanceOfAccount = await token.balanceOf(accounts[0].address);
      console.log("CNT balance of account0 before buying: " + balanceOfAccount);

      balanceOfAccount = await busd.balanceOf(accounts[1].address);
      console.log("BUSD balance of account1 before buying: " + balanceOfAccount);

      balanceOfAccount = await busd.balanceOf(cntPresale.address);
      console.log("BUSD balance of contract before buying: " + balanceOfAccount);

      await cntPresale.connect(accounts[0]).buyTokens(getBNFromNumber('1', 18), accounts[1].address);

      console.log("======After========");

      balanceOfAccount = await busd.balanceOf(accounts[0].address);
      console.log("BUSD balance of account0 after buying: " + balanceOfAccount);

      balanceOfAccount = await token.balanceOf(accounts[0].address);
      console.log("CNT balance of account0 after buying: " + balanceOfAccount);

      balanceOfAccount = await busd.balanceOf(accounts[1].address);
      console.log("BUSD balance of account1 after buying: " + balanceOfAccount);

      balanceOfAccount = await busd.balanceOf(cntPresale.address);
      console.log("BUSD balance of contract after buying: " + balanceOfAccount);
   });

   it('Withdraw Tokens', async () => {
      await cntPresale.setWalletReceiver(accounts[6].address);

      await expect(cntPresale.setReferralPercent(4, 800)).to.be.reverted;
      await expect(cntPresale.setReferralPercent(0, 1100)).to.be.reverted;
      await cntPresale.setReferralPercent(1, 100);

      console.log("BUSD Balance of the contract : " + await busd.balanceOf(cntPresale.address));
      console.log("CNT Balance of the contract : " + await token.balanceOf(cntPresale.address));
      console.log("CNT Balance of Acocunts6 : " + await token.balanceOf(accounts[6].address));
   
      await cntPresale.withdrawTokens(busd.address);
      await cntPresale.withdrawTokens(token.address);

      console.log("BUSD Balance of the contract : " + await busd.balanceOf(cntPresale.address));
      console.log("CNT Balance of the contract : " + await token.balanceOf(cntPresale.address));
      console.log("CNT Balance of Acocunts6 : " + await token.balanceOf(accounts[6].address));

      let roundInfo = await cntPresale.roundInfos(1);
         
      console.log("ROUND #1");
      console.log("CNT price: " + roundInfo[0]);
      console.log("Hard Cap: " + roundInfo[1]);
      console.log("BUSD Amount: " + roundInfo[4]);
      console.log("Investors: " + roundInfo[5]);
   });

   it('Buy token with hard cap amount', async () => {
      await token.transfer(cntPresale.address, getBNFromNumber('9', 18));
      console.log("Token amount of contract: " + await token.balanceOf(cntPresale.address));

      let busdAmount = await busd.balanceOf(accounts[0].address);
      console.log("BUSD AMOUNT of ACC0: " + busdAmount);
      
      await busd.connect(accounts[0]).approve(cntPresale.address, busdAmount);
      await cntPresale.connect(accounts[0]).buyTokens(busdAmount, accounts[1].address);

      console.log("====After Buying Token====")
      busdAmount = await busd.balanceOf(accounts[0].address);
      console.log("BUSD AMOUNT of ACC0: " + busdAmount);

      await expect(cntPresale.connect(accounts[0]).buyTokens(busdAmount, accounts[1].address)).to.be.reverted;

      const endTime = Date.now() + 60 * 60 * 24;
      await expect(cntPresale.startICO(1, endTime, 0)).to.be.reverted;
      await cntPresale.startICO(2, endTime, 0);

      await time.increase(1000000 * 1000 * 60 * 60 * 25);
      await expect(cntPresale.connect(accounts[0]).buyTokens(busdAmount, accounts[1].address)).to.be.reverted;
   });
/*
   it('Accounts deposit after manager accept deposit', async () => {
      let balanceOfAccount0 = await token.balanceOf(accounts[0].address);
      let balanceOfAccount1 = await token.balanceOf(accounts[1].address);
      let balanceOfAccount2 = await token.balanceOf(accounts[2].address);
      let balanceOfAccount3 = await token.balanceOf(accounts[3].address);
      let balanceOfAccount4 = await token.balanceOf(accounts[4].address);
      console.log("Before deposit");
      console.log("Balance of account0 : ", balanceOfAccount0.toNumber());
      console.log("Balance of account1 : ", balanceOfAccount1.toNumber());
      console.log("Balance of account2 : ", balanceOfAccount2.toNumber());
      console.log("Balance of account3 : ", balanceOfAccount3.toNumber());
      console.log("Balance of account4 : ", balanceOfAccount4.toNumber());

      let balanceOfContract = await token.balanceOf(cntPresale.address);
      expect(balanceOfContract).to.equal(0);
      console.log("Balance of contract : ", balanceOfContract.toNumber());

      console.log("About to sleep for 2 hours. Account0 deposits")
      sleep(500)
      await time.increase(2 * 60 * 60);
      await expect(cntPresale.connect(accounts[0]).addDeposit(0, balanceOfAccount0));

      console.log("About to sleep for 4 hours. Account1 deposits")
      sleep(500)
      await time.increase(4 * 60 * 60);
      await expect(cntPresale.connect(accounts[1]).addDeposit(0, balanceOfAccount1)).to.be.not.reverted;

      console.log("About to sleep for 6 hours. Account2 deposits")
      sleep(500)
      await time.increase(6 * 60 * 60);
      await expect(cntPresale.connect(accounts[2]).addDeposit(0, balanceOfAccount2)).to.be.not.reverted;

      console.log("About to sleep for 8 hours. Account3 deposits")
      sleep(500)
      await time.increase(8 * 60 * 60);
      await expect(cntPresale.connect(accounts[4]).addDeposit(0, balanceOfAccount4 / 2)).to.be.not.reverted;

      console.log("About to sleep for 3 hours. Account4 deposits")
      sleep(500)
      await time.increase(3 * 60 * 60);
      await expect(cntPresale.connect(accounts[3]).addDeposit(0, balanceOfAccount3)).to.be.not.reverted;
      await expect(cntPresale.connect(accounts[4]).addDeposit(3, balanceOfAccount4 / 2)).to.be.not.reverted;

      balanceOfAccount0 = await token.balanceOf(accounts[0].address);
      balanceOfAccount1 = await token.balanceOf(accounts[1].address);
      balanceOfAccount2 = await token.balanceOf(accounts[2].address);
      balanceOfAccount3 = await token.balanceOf(accounts[3].address);
      balanceOfAccount4 = await token.balanceOf(accounts[4].address);
      expect(balanceOfAccount0).to.equal(0);
      expect(balanceOfAccount1).to.equal(0);
      expect(balanceOfAccount2).to.equal(0);
      expect(balanceOfAccount3).to.equal(0);
      expect(balanceOfAccount4).to.equal(0);
      console.log("After deposit");
      console.log("Balance of account0 : ", balanceOfAccount0.toNumber());
      console.log("Balance of account1 : ", balanceOfAccount1.toNumber());
      console.log("Balance of account2 : ", balanceOfAccount2.toNumber());
      console.log("Balance of account3 : ", balanceOfAccount3.toNumber());
      console.log("Balance of account4 : ", balanceOfAccount4.toNumber());

      balanceOfContract = await token.balanceOf(cntPresale.address);
      expect(balanceOfContract).to.equal(20000000000000);
      console.log("Balance of contract : ", balanceOfContract.toNumber());
   });

   it('Get all stakes', async () => {
      let stakeIDs = await cntPresale.getMyStakes(accounts[4].address);

      console.log("accounts4 stake count : " + stakeIDs.length);

      for (let index = 0; index < stakeIDs.length; index++) {
         const element = stakeIDs[index];
         console.log("Account4 stakeIndex" + index, stakeIDs[index]);

      }
   });

   it('Account5 deposit after end of acceptingDeposit', async () => {
      let balanceOfAccount5 = await token.balanceOf(accounts[5].address);
      console.log("Before deposit");
      console.log("Balance of account5 : ", balanceOfAccount5.toNumber());

      let balanceOfContract = await token.balanceOf(cntPresale.address);
      expect(balanceOfContract).to.equal(20000000000000);
      console.log("Balance of contract : ", balanceOfContract.toNumber());

      console.log("About to sleep for 3 hours. Account5 deposits")
      sleep(500)
      await time.increase(3 * 60 * 60);
      await expect(cntPresale.connect(accounts[5]).addDeposit(0, balanceOfAccount5)).to.be.reverted;

      balanceOfAccount5 = await token.balanceOf(accounts[5].address);
      expect(balanceOfAccount5).to.equal(6000000000000);
      console.log("After deposit");
      console.log("Balance of account5 : ", balanceOfAccount5.toNumber());

      balanceOfContract = await token.balanceOf(cntPresale.address);
      expect(balanceOfContract).to.equal(20000000000000);
      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Account5 failed to deposit, cuz ended acceptinig deposit.");
   });

   it('Manager tries to start staking again', async () => {
      console.log("About to sleep for 10 days.")
      sleep(500)
      await time.increase(10 * 24 * 60 * 60);

      await expect(cntPresale.startStaking(0, 24)).to.be.reverted;

      expect(await cntPresale.getPeriodStaking(0)).to.equal(30);
      expect(await cntPresale.getTimeAccepting(0)).to.equal(24);

      console.log("Manager failed to start staking again.")
   });

   it('Manager set rewards', async () => {
      const rewards = 10000000000000;

      let contractBalance = await token.balanceOf(cntPresale.address);
      console.log("Contract balance before setting rewards : " + contractBalance.toNumber());

      let ownerBalance = await token.balanceOf(owner.address);
      const dec = await token.decimals();
      console.log("Owner balance before setting rewards : " + ownerBalance);

      expect(await cntPresale.setRewards(rewards));

      contractBalance = await token.balanceOf(cntPresale.address);
      console.log("Contract balance after setting rewards : " + contractBalance.toNumber());

      ownerBalance = await token.balanceOf(owner.address);
      console.log("Owner balance before setting rewards : " + ownerBalance);
   });

   it('Account0 tries to withdraw before end of staking period', async () => {
      console.log("About to sleep for 10 days.")
      sleep(500)
      await time.increase(10 * 24 * 60 * 60);

      let balanceOfContract = await token.balanceOf(cntPresale.address);
      let balanceOfAccount0 = await token.balanceOf(accounts[0].address);

      expect(balanceOfContract).to.equal(30000000000000);
      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Account0 : ", balanceOfAccount0.toNumber());

      let stakeIDs = await cntPresale.getMyStakes(accounts[0].address);

      await expect(cntPresale.connect(accounts[0]).withdrawStake(stakeIDs[0])).to.be.reverted;

      console.log("After withdraw");
      balanceOfContract = await token.balanceOf(cntPresale.address);
      balanceOfAccount0 = await token.balanceOf(accounts[0].address);

      expect(balanceOfContract).to.equal(30000000000000);
      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Account0 : ", balanceOfAccount0.toNumber());
      console.log("Account0 failed to withdraw");

   });

   it('Manager set rewards again', async () => {
      const rewards = 10000000000000;

      let contractBalance = await token.balanceOf(cntPresale.address);
      console.log("Contract balance before setting rewards : " + contractBalance.toNumber());

      let ownerBalance = await token.balanceOf(owner.address);
      const dec = await token.decimals();
      console.log("Owner balance before setting rewards : " + ownerBalance);

      expect(await cntPresale.setRewards(rewards));

      contractBalance = await token.balanceOf(cntPresale.address);
      console.log("Contract balance after setting rewards : " + contractBalance.toNumber());

      ownerBalance = await token.balanceOf(owner.address);
      console.log("Owner balance before setting rewards : " + ownerBalance);
   });

   it('Account0 tries to withdraw after end of staking period', async () => {
      console.log("About to sleep for 9 days and 22 hours.")
      sleep(500)
      await time.increase(9 * 24 * 60 * 60 + 22 * 60 * 60);

      // let pid = await cntPresale.poolInstanceCounter();
      // console.log("poolInstanceCounter : ", pid);
      // let poolInfo = await cntPresale.poolById(pid);
      // console.log("PoolInstance : ", poolInfo);

      let balanceOfContract = await token.balanceOf(cntPresale.address);
      let balanceOfAccount0 = await token.balanceOf(accounts[0].address);

      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Address0 : ", balanceOfAccount0.toNumber());

      let stakeIDs = await cntPresale.getMyStakes(accounts[0].address);

      let rewardAmount = await cntPresale.getRewards(stakeIDs[0]);
      console.log("Reward amount : ", rewardAmount.toNumber());

      await expect(cntPresale.connect(accounts[0]).withdrawStake(stakeIDs[0])).to.be.not.reverted;

      await time.increase(1);

      console.log("After withdraw");

      balanceOfContract = await token.balanceOf(cntPresale.address);
      balanceOfAccount0 = await token.balanceOf(accounts[0].address);
      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Account0 : ", balanceOfAccount0.toNumber());
   });

   it('Account0 tries to withdraw again', async () => {
      console.log("About to sleep for 1 days")
      sleep(500)
      await time.increase(1 * 24 * 60 * 60);

      let balanceOfContract = await token.balanceOf(cntPresale.address);
      let balanceOfAccount0 = await token.balanceOf(accounts[0].address);

      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Account0 : ", balanceOfAccount0.toNumber());

      let stakeIDs = await cntPresale.getMyStakes(accounts[0].address);

      await expect(cntPresale.getRewards(stakeIDs[0])).to.be.reverted;

      await expect(cntPresale.connect(accounts[0]).withdrawStake(stakeIDs[0])).to.be.reverted;

      console.log("After withdraw");
      balanceOfContract = await token.balanceOf(cntPresale.address);
      balanceOfAccount0 = await token.balanceOf(accounts[0].address);

      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Address0 : ", balanceOfAccount0.toNumber());

      console.log("fail: already paid out");
   });

   it('Account0 deposit before manager accept deposit - second', async () => {
      let balanceOfAccount0 = await token.balanceOf(accounts[0].address);
      console.log("Before deposit");
      console.log("Balance of account0 : ", balanceOfAccount0.toNumber());

      let balanceOfContract = await token.balanceOf(cntPresale.address);
      console.log("Balance of contract : ", balanceOfContract.toNumber());

      console.log("About to sleep for 5 hours. Account0 deposits")
      sleep(500)
      await time.increase(5 * 60 * 60);
      await expect(cntPresale.connect(accounts[0]).addDeposit(0, balanceOfAccount0)).to.be.reverted;

      balanceOfContract = await token.balanceOf(cntPresale.address);
      console.log("Balance of contract : ", balanceOfContract.toNumber());
   });

   it('Manager starts acceptDeposit again after staking', async () => {
      await cntPresale.startStaking(0, 10);

      expect(await cntPresale.getPeriodStaking(0)).to.equal(30);
      expect(await cntPresale.getTimeAccepting(0)).to.equal(10);

      console.log("Pool_0_PeriodStaking", (await cntPresale.getPeriodStaking(0)));
      console.log("Pool_0_TimeAccepting", (await cntPresale.getPeriodStaking(0)));
   });

   it('Account0 tries to withdraw before end of staking period - second', async () => {
      console.log("About to sleep for 2 hour.")
      sleep(500)
      await time.increase(2 * 60 * 60);

      let balanceOfContract = await token.balanceOf(cntPresale.address);
      let balanceOfAccount0 = await token.balanceOf(accounts[0].address);

      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Account0 : ", balanceOfAccount0.toNumber());

      let stakeIDs = await cntPresale.getMyStakes(accounts[0].address);

      await expect(cntPresale.connect(accounts[0]).withdrawStake(stakeIDs[0])).to.be.reverted;

      console.log("After withdraw");
      balanceOfContract = await token.balanceOf(cntPresale.address);
      balanceOfAccount0 = await token.balanceOf(accounts[0].address);

      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Account0 : ", balanceOfAccount0.toNumber());
      console.log("Account0 failed to withdraw");
   });

   it('Manager set rewards again', async () => {
      const rewards = 10000000000000;

      let contractBalance = await token.balanceOf(cntPresale.address);
      console.log("Contract balance before setting rewards : " + contractBalance.toNumber());

      let ownerBalance = await token.balanceOf(owner.address);
      const dec = await token.decimals();
      console.log("Owner balance before setting rewards : " + ownerBalance);

      expect(await cntPresale.setRewards(rewards));

      contractBalance = await token.balanceOf(cntPresale.address);
      console.log("Contract balance after setting rewards : " + contractBalance.toNumber());

      ownerBalance = await token.balanceOf(owner.address);
      console.log("Owner balance before setting rewards : " + ownerBalance);
   });

   it('Accounts deposit after manager accept deposit - second', async () => {
      let balanceOfAccount0 = await token.balanceOf(accounts[0].address);
      console.log("Before deposit");
      console.log("Balance of account0 : ", balanceOfAccount0.toNumber());

      let balanceOfContract = await token.balanceOf(cntPresale.address);
      console.log("Balance of contract : ", balanceOfContract.toNumber());

      console.log("About to sleep for 6 hours. Account0 deposits")
      sleep(500)
      await time.increase(2 * 60 * 60);
      await expect(cntPresale.connect(accounts[0]).addDeposit(0, balanceOfAccount0)).to.be.not.reverted;

      balanceOfContract = await token.balanceOf(cntPresale.address);
      console.log("Balance of contract : ", balanceOfContract.toNumber());
   });

   it('Account0 tries to withdraw after end of staking period - second', async () => {
      console.log("About to sleep for 40 days.")
      sleep(500)
      await time.increase(40 * 24 * 60 * 60);

      let balanceOfContract = await token.balanceOf(cntPresale.address);
      let balanceOfAccount0 = await token.balanceOf(accounts[0].address);

      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Account0 : ", balanceOfAccount0.toNumber());

      let stakeIDs = await cntPresale.getMyStakes(accounts[0].address);
      console.log("stakeID : ", stakeIDs[1]);
      console.log("stakeIDCounter : ", await cntPresale.stakeIdCounter());

      await expect(cntPresale.connect(accounts[0]).withdrawStake(stakeIDs[1])).to.be.not.reverted;

      console.log("After withdraw");
      balanceOfContract = await token.balanceOf(cntPresale.address);
      balanceOfAccount0 = await token.balanceOf(accounts[0].address);

      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Account0 : ", balanceOfAccount0.toNumber());
   });

   it('Account4 tries to withdraw after end of staking on pool_0', async () => {
      console.log("About to sleep for 60 days.")
      sleep(500)
      await time.increase(60 * 24 * 60 * 60);

      let balanceOfContract = await token.balanceOf(cntPresale.address);
      let balanceOfAccount4 = await token.balanceOf(accounts[4].address);

      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Address4 : ", balanceOfAccount4.toNumber());

      let stakeIDs = await cntPresale.getMyStakes(accounts[4].address);

      console.log("accounts4 stake count : " + stakeIDs.length);
      console.log("accounts4 stakeID_0 : " + stakeIDs[0]);
      console.log("accounts4 stakeID_1 : " + stakeIDs[1]);

      let rewardAmount = await cntPresale.getRewards(stakeIDs[0]);
      console.log("Reward amount : ", rewardAmount.toNumber());

      await expect(cntPresale.connect(accounts[4]).withdrawStake(stakeIDs[0])).to.be.not.reverted;

      console.log("After withdraw");
      balanceOfContract = await token.balanceOf(cntPresale.address);
      balanceOfAccount4 = await token.balanceOf(accounts[4].address);

      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Account4 : ", balanceOfAccount4.toNumber());
   });

   it('Account4 tries to withdraw after end of staking on pool_4', async () => {
      console.log("About to sleep for 300 days.")
      sleep(500)
      await time.increase(300 * 24 * 60 * 60);

      let balanceOfContract = await token.balanceOf(cntPresale.address);
      let balanceOfAccount4 = await token.balanceOf(accounts[4].address);

      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Address4 : ", balanceOfAccount4.toNumber());

      let stakeIDs = await cntPresale.getMyStakes(accounts[4].address);

      let rewardAmount = await cntPresale.getRewards(stakeIDs[1]);
      console.log("Reward amount : ", rewardAmount.toNumber());

      await expect(cntPresale.connect(accounts[4]).withdrawStake(stakeIDs[1])).to.be.not.reverted;

      console.log("After withdraw");
      balanceOfContract = await token.balanceOf(cntPresale.address);
      balanceOfAccount4 = await token.balanceOf(accounts[4].address);

      console.log("Balance of contract : ", balanceOfContract.toNumber());
      console.log("Balance of Address4 : ", balanceOfAccount4.toNumber());
   });
   */
})
