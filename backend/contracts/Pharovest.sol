// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pharovest is ERC721, Ownable {
    // Project and Milestone Data Structures
    struct Milestone {
        string title;
        uint amountRequired;
        address payable recipient;
        bool isCompleted;
    }

    struct Project {
        uint totalAmount;
        uint amountRaised;
        bool isActive;
        Milestone[] milestones;
        mapping(address => uint) contributions;
        address[] contributors;
    }

    uint public projectCount;
    mapping(uint => Project) public projects;
    uint public tokenIdCounter;
    string public constant NETWORK_NAME = "Pharos Testnet";
    string public constant PROJECT_INFO = "Pharovest Blockchain Crowdfunding Platform";

    // Events
    event ProjectCreated(uint projectId);
    event ContributionMade(uint projectId, address contributor, uint amount);
    event NFTMinted(address recipient, uint tokenId);
    event WithdrawalMade(uint projectId, address contributor, uint amount);
    event FundsTransferred(uint projectId, uint milestoneIndex);

    constructor(address initialOwner) ERC721("PharovestNFT", "PNFT") Ownable(initialOwner) {}

    function createProject(uint totalAmount, Milestone[] memory milestones) external onlyOwner {
        require(totalAmount > 0, "Total amount must be greater than zero");
        require(milestones.length > 0, "At least one milestone required");
        Project storage newProject = projects[projectCount];
        newProject.totalAmount = totalAmount;
        newProject.isActive = true;
        for (uint i = 0; i < milestones.length; i++) {
            newProject.milestones.push(milestones[i]);
        }
        emit ProjectCreated(projectCount);
        projectCount++;
    }

    // Function to create a project with a specific ID (for syncing with database)
    function createProjectWithId(uint projectId, uint totalAmount, Milestone[] memory milestones) external onlyOwner {
        require(totalAmount > 0, "Total amount must be greater than zero");
        require(milestones.length > 0, "At least one milestone required");
        
        // Ensure project ID doesn't already exist
        Project storage existingProject = projects[projectId];
        require(existingProject.totalAmount == 0, "Project with this ID already exists");
        
        // Create project at the specified ID
        Project storage newProject = projects[projectId];
        newProject.totalAmount = totalAmount;
        newProject.isActive = true;
        for (uint i = 0; i < milestones.length; i++) {
            newProject.milestones.push(milestones[i]);
        }
        
        // Update project count if needed
        if (projectId >= projectCount) {
            projectCount = projectId + 1;
        }
        
        emit ProjectCreated(projectId);
    }

    function contribute(uint projectId) external payable {
        require(msg.value > 0, "Contribution must be greater than zero");
        Project storage project = projects[projectId];
        require(project.isActive, "Project is not active");
        project.amountRaised += msg.value;
        project.contributions[msg.sender] += msg.value;
        if (project.contributions[msg.sender] == msg.value) {
            project.contributors.push(msg.sender);
        }
        uint tokenId = tokenIdCounter;
        _mint(msg.sender, tokenId);
        tokenIdCounter++;
        emit ContributionMade(projectId, msg.sender, msg.value);
        emit NFTMinted(msg.sender, tokenId);
    }

    function withdraw(uint projectId) external {
        Project storage project = projects[projectId];
        require(project.isActive, "Project is not active");
        uint contribution = project.contributions[msg.sender];
        require(contribution > 0, "No contribution to withdraw");
        uint refundAmount = (contribution * 90) / 100;
        project.amountRaised -= contribution;
        project.contributions[msg.sender] = 0;
        payable(msg.sender).transfer(refundAmount);
        emit WithdrawalMade(projectId, msg.sender, refundAmount);
    }

    function transferFunds(uint projectId, uint milestoneIndex) external onlyOwner {
        Project storage project = projects[projectId];
        require(project.isActive, "Project is not active");
        require(milestoneIndex < project.milestones.length, "Invalid milestone index");
        Milestone storage milestone = project.milestones[milestoneIndex];
        require(!milestone.isCompleted, "Milestone already completed");
        require(project.amountRaised >= milestone.amountRequired, "Insufficient funds for milestone");
        milestone.recipient.transfer(milestone.amountRequired);
        milestone.isCompleted = true;
        emit FundsTransferred(projectId, milestoneIndex);
        bool allCompleted = true;
        for (uint i = 0; i < project.milestones.length; i++) {
            if (!project.milestones[i].isCompleted) {
                allCompleted = false;
                break;
            }
        }
        if (allCompleted) {
            project.isActive = false;
        }
    }

    function hasNFT(address contributor) external view returns (bool) {
        return balanceOf(contributor) > 0;
    }

    function getProject(uint projectId) external view returns (uint, uint, bool, uint) {
        Project storage project = projects[projectId];
        return (project.totalAmount, project.amountRaised, project.isActive, project.milestones.length);
    }

    function getMilestone(uint projectId, uint milestoneIndex) external view returns (string memory, uint, address, bool) {
        Project storage project = projects[projectId];
        Milestone storage milestone = project.milestones[milestoneIndex];
        return (milestone.title, milestone.amountRequired, milestone.recipient, milestone.isCompleted);
    }

    function getContribution(uint projectId, address contributor) external view returns (uint) {
        return projects[projectId].contributions[contributor];
    }

    function getContributors(uint projectId) external view returns (address[] memory) {
        return projects[projectId].contributors;
    }

    function getProjectProgress(uint projectId) external view returns (uint) {
        Project storage project = projects[projectId];
        if (project.totalAmount == 0) return 0;
        return (project.amountRaised * 100) / project.totalAmount;
    }

    function getCompletedMilestoneCount(uint projectId) external view returns (uint) {
        Project storage project = projects[projectId];
        uint completedCount = 0;
        for (uint i = 0; i < project.milestones.length; i++) {
            if (project.milestones[i].isCompleted) {
                completedCount++;
            }
        }
        return completedCount;
    }

    function _toString(uint value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint temp = value;
        uint digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
}
