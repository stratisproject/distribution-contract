const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
    time,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Distribution contract", function () {
  it("Deployment should assign the value of the contract create message to the contract balance", async function () {
    const [addr1, recipient] = await ethers.getSigners();

    const amount = 1_000_000;
    const initialTime = await time.latest();
    const unlockTime = initialTime + 60;

    const distributionContract = await ethers.deployContract("Distribution", [unlockTime, recipient.address], {
      value: amount
    });

    expect(await ethers.provider.getBalance(distributionContract.target)).to.equal(amount);
  });

  it("Claiming the funds early should fail", async function () {
    const [addr1, recipient] = await ethers.getSigners();

    const amount = 1_000_000;
    const initialTime = await time.latest();
    const unlockTime = initialTime + 60;

    const distributionContract = await ethers.deployContract("Distribution", [unlockTime, recipient.address], {
      value: amount
    });

    await time.setNextBlockTimestamp(unlockTime - 1);

    await expect(
      distributionContract.connect(addr1).claim()
    ).to.be.revertedWith("Insufficient time elapsed");
  });

  it("Claiming the funds when the specified timestamp has elapsed should succeed", async function () {
    const [addr1, recipient] = await ethers.getSigners();

    const amount = 1_000_000;
    const initialTime = await time.latest();
    const unlockTime = initialTime + 60;

    const distributionContract = await ethers.deployContract("Distribution", [unlockTime, recipient.address], {
      value: amount
    });

    await time.setNextBlockTimestamp(unlockTime);

    await expect(
      distributionContract.connect(addr1).claim()
      ).not.to.be.reverted;
  });

  it("Claiming the funds when the specified timestamp has elapsed should succeed", async function () {
    const [addr1, recipient] = await ethers.getSigners();

    const amount = 1_000_000;
    const initialTime = await time.latest();
    const unlockTime = initialTime + 60;

    const distributionContract = await ethers.deployContract("Distribution", [unlockTime, recipient.address], {
      value: amount
    });

    await time.setNextBlockTimestamp(unlockTime + 2_000_000);

    const tx = distributionContract.connect(addr1).claim()

    await expect(tx).not.to.be.reverted;
    await expect(tx).to.changeEtherBalance(recipient, amount);
  });
});