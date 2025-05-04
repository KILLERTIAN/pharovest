const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Pharovest Contract - createProject", function () {
  let pharovest;
  let owner;

  const contractAddress = "0xf94D5Ff360bCD0aEBeF621Ff26bc3BfCc1452b2C";

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    
    // Get the contract ABI from artifacts
    const Pharovest = await ethers.getContractFactory("Pharovest");
    pharovest = Pharovest.attach(contractAddress);
  });

  it("Should create a project correctly", async function () {
    const milestones = [
      {
        title: "Testing 1",
        amountRequired: ethers.parseEther("1.0"),
        recipient: owner.address,
        isCompleted: false,
      },
      {
        title: "Testing 2",
        amountRequired: ethers.parseEther("2.0"),
        recipient: owner.address,
        isCompleted: false,
      },
    ];

    const totalAmount = ethers.parseEther("3.0");
    const tx = await pharovest.createProject(totalAmount, milestones);
    await tx.wait(); // Wait for transaction to be mined

    const projectId = 4; // Update to the actual ID if necessary
    try {
      const project = await pharovest.getProject(projectId);
      console.log(project)
      
      expect(project.totalAmount).to.equal(totalAmount);
      expect(project.isActive).to.be.true;
      expect((await pharovest.getMilestone(projectId, 0)).title).to.equal("Testing 1");
      expect((await pharovest.getMilestone(projectId, 1)).title).to.equal("Testing 2");
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  });
});
