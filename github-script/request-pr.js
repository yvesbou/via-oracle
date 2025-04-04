/**
 * GitHub PR Status Request Script
 *
 * Requests PR status data from the GitHubPROracle contract fully on-chain.
 */

import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { networks } from "../network.config.js";
import dotenv from "dotenv";
import { dirname } from "path";

// Configure dotenv
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default network and polling settings
const DEFAULT_NETWORK = "base-testnet";
const POLL_INTERVAL = 10000; // 10 seconds
const MAX_WAIT_TIME = 5 * 60 * 1000; // 5 minutes

// Function to convert numeric PR status to string
function getPRStatusString(statusCode) {
  const statusMap = {
    0: "UNKNOWN",
    1: "OPEN",
    2: "MERGED",
    3: "CLOSED",
  };
  return statusMap[statusCode] || "UNKNOWN";
}

async function main() {
  try {
    // Get PR ID from command line or use default
    const prId = process.argv[2] || "1";
    const networkName = process.argv[3] || DEFAULT_NETWORK;

    console.log(
      `=== Requesting PR status data for PR #${prId} in deficollective/defiscan ===`
    );

    // Setup provider and wallet
    const network = networks[networkName];
    if (!network) {
      throw new Error(`Network ${networkName} not found`);
    }

    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

    // Get deployment info
    const deploymentPath = path.join(
      __dirname,
      "../deployments",
      network.name,
      "GitHubPROracle.json"
    );
    if (!fs.existsSync(deploymentPath)) {
      throw new Error(`Deployment not found. Please run deploy.js first.`);
    }

    const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    const contract = new ethers.Contract(
      deployment.address,
      deployment.abi,
      wallet
    );

    console.log(`Oracle contract: ${deployment.address}`);
    console.log(`Your address: ${wallet.address}`);

    // Request PR status data
    console.log(`\nSending request for PR #${prId}...`);
    const tx = await contract.requestPRStatus(prId);
    console.log(`Transaction hash: ${tx.hash}`);

    // Wait for confirmation
    console.log("Waiting for transaction confirmation...");
    const receipt = await tx.wait();

    // Get request ID from event
    let requestId;
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog({
          topics: log.topics,
          data: log.data,
        });
        if (parsedLog && parsedLog.name === "PRStatusRequested") {
          requestId = parsedLog.args.requestId.toString();
          break;
        }
      } catch (e) {
        // Skip logs that can't be parsed
      }
    }

    if (!requestId) {
      throw new Error("Could not find request ID in transaction logs");
    }

    console.log(`\nRequest confirmed! Request ID: ${requestId}`);
    console.log("Waiting for the off-chain node to process the request...");
    console.log(
      "This may take a few minutes as the node fetches PR data from GitHub."
    );

    // Poll for results
    const startTime = Date.now();
    let prData = null;

    while (Date.now() - startTime < MAX_WAIT_TIME) {
      // Check if request is fulfilled
      const isFulfilled = await contract.isRequestFulfilled(requestId);

      if (isFulfilled) {
        prData = await contract.getPRData(requestId);
        break;
      }

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
      process.stdout.write(".");
    }

    if (prData && prData.fulfilled) {
      // Get status string from the contract
      let statusString;
      try {
        statusString = await contract.getPRStatusString(requestId);
      } catch (e) {
        // Fallback to local conversion if method call fails
        statusString = getPRStatusString(prData.status);
      }

      console.log(`\n\n✅ PR status data received!`);
      console.log(`------------------------------------------`);
      console.log(`Repository: deficollective/defiscan`);
      console.log(`PR #${prData.prId.toString()}: ${prData.title}`);
      console.log(`Status: ${statusString}`);
      console.log(
        `Timestamp: ${new Date(
          Number(prData.timestamp) * 1000
        ).toLocaleString()}`
      );
      console.log(`------------------------------------------`);
    } else {
      console.log(`\n\n⏳ Request is still pending.`);
      console.log(`The off-chain node has not yet fulfilled this request.`);
      console.log(`You can check again later by running:`);
      console.log(`node scripts/request-pr.js ${prId} ${networkName}`);
    }
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
