# Github PR Oracle

This project contains a Github PR oracle which allows contributors to redeem bounties on-chain for their contribution to the [DeFiscan](https://defiscan.info) project. Any contribution can be rewarded by a fixed amount bounty. A contribution is valid once the PR is merged. The oracle brings this information on-chain to allows swift reedemption. Contracts are deployed on Base testnet. See: deployments.

## Reference

This codebase is based on the quickstart oracle demo from VIALabs. [Do check it out](https://github.com/VIALabs-io/quickstart-oracle).

## Prerequisites

Before you begin, make sure you have:

- Node.js (v20+) and npm
- Git
- A private key with testnet funds for deployment
- Testnet tokens for Base Testnet

## Project Structure

```
via-oracle/
├── contracts/
│   └── GithubOracle.sol     # The oracle contract with request/response functionality
├── github-script/
│   ├── deploy.js            # Deploy script using ethers v6
│   └── request-weather.js   # Script to request github data
├── github/
│   ├── index.js             # VIA Project Node implementation
│   └── features/
│       ├── index.js         # Features registry
│       └── GithubOracle.js  # Github oracle feature implementation
├── network.config.js        # Network configuration
├── package.json             # Project dependencies
├── .env.example             # Example environment variables
└── README.md                # Project documentation
```

## Step 1: Clone & Setup

```bash
# Clone the repository
git clone https://github.com/VIALabs-io/quickstart-oracle.git && cd quickstart-oracle

# Install dependencies
npm install

# Create a .env file with your private keys
cp .env.example .env
```

Edit the `.env` file and add:

- Your private key for deploying contracts (PRIVATE_KEY)
- Your node private key for running the oracle node (NODE_PRIVATE_KEY)
- Optionally, your Github API key

## Step 2: Deploy Your Oracle Contract

```bash
node github-script/deploy.js
```

This script will:

1. Compile the WeatherOracle.sol contract
2. Deploy the contract to Avalanche Testnet
3. Configure the oracle for on-chain to off-chain communication
4. Save deployment information for the frontend

## Step 3: Run the Oracle Node

```bash
node github/index.js
```

## Step 4: Request PR Data

```bash
node github-script/request-pr.js
```

1. Send a transaction to the GithubOracle contract
2. Wait for the transaction to be confirmed
3. Poll for the PR data to be received
4. Display the PR data when it's available
