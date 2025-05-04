# Pharovest Blockchain Interaction Scripts

This directory contains scripts to interact with the Pharovest smart contract on the Pharos blockchain.

## Prerequisites

- Node.js v16+
- A `.env` file with a `PRIVATE_KEY` or `DEPLOYER_PRIVATE_KEY` for the wallet with Pharos tokens
- The Pharovest contract deployed at `0x3E754f56fd92db9049febb6521a8C8DB8718Aa3C`

## Available Scripts

### sync-all-projects.js

**NEW** - Syncs all 20 database projects to the blockchain with matching IDs. This ensures the blockchain projects match exactly with the database projects.

```bash
node scripts/sync-all-projects.js
```

### update-database-from-blockchain.js

**NEW** - Updates the database projects' amounts and status to match blockchain data. Use this after syncing projects to keep the database in sync with actual blockchain state.

```bash
node scripts/update-database-from-blockchain.js
```

### check-projects.js

Shows all projects that exist on the blockchain, including their details and milestones.

```bash
node scripts/check-projects.js
```

### create-project-4.js

Creates a project with ID 4 on the blockchain.

```bash
node scripts/create-project-4.js
```

### direct-project-create.js

A more robust version that creates multiple projects if needed to reach a specific ID (default is 4).

```bash
node scripts/direct-project-create.js
```

### contribute-to-project.js

Contributes to project ID 4 with a small amount of ETH.

```bash
node scripts/contribute-to-project.js
```

### sync-project-4.js

Uses module format to ensure projects up to ID 4 exist on the blockchain.

```bash
node scripts/sync-project-4.js
```

## How This Solves the Issue

The original problem was that when trying to get project using ID 4, the contract would return all zeroes:

```
[call]from: 0x6e6ccc0cfAffE650AB34A911324706cc1Af57b0D
to: Pharovest.getProject(uint256) 0x3E754f56fd92db9049febb6521a8C8DB8718Aa3C
input: 0xf0f...00004
output: 00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
decoded input: {
    "uint256 projectId": "4"
}
decoded output: {
    "0": "uint256: 0",
    "1": "uint256: 0",
    "2": "bool: false",
    "3": "uint256: 0"
}
```

This happened because:

1. Projects in the blockchain are created with auto-incremented IDs starting from 0
2. Project ID 4 had not been created yet on the blockchain
3. The database had a project with ID 4, causing a mismatch

We resolved this by:

1. Creating all 20 projects from the database on the blockchain with matching IDs using `sync-all-projects.js`
2. Updating the database to reflect the blockchain state using `update-database-from-blockchain.js`
3. Ensuring consistent data between frontend, backend and blockchain

Now, when fetching any project from the blockchain, the data will match what's in the database, allowing contributions from the frontend to work properly.

## Usage Workflow

1. First, run `sync-all-projects.js` to create all database projects on the blockchain
2. Then run `update-database-from-blockchain.js` to update database amounts from blockchain
3. Now frontend donations will work properly for all projects

If you add new projects to the database, you should run these scripts again to keep everything in sync. 