/**
 * GitHub PR Oracle Node
 *
 * VIA Project Node that fetches GitHub PR status data using the Private Oracle (feature ID 1).
 * This implementation uses the node-core package directly and auto-loads features.
 */

import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { Vladiator } from "@vialabs-io/node-core";
import { networks } from "../network.config.js";
import features from "./features/index.js";

// Load environment variables
dotenv.config();

// Check for required environment variables
if (!process.env.NODE_PRIVATE_KEY) {
  console.error(
    "ERROR: NODE_PRIVATE_KEY is not set. Please check your .env file."
  );
  process.exit(1);
}

// Check for GitHub token (optional but recommended to avoid rate limits)
if (!process.env.GITHUB_TOKEN) {
  console.warn(
    "WARNING: GITHUB_TOKEN is not set. API requests may be rate-limited."
  );
}

// Determine environment
const isDevelopment = process.env.NODE_ENV !== "production";
console.log(`Running in ${isDevelopment ? "DEVELOPMENT" : "PRODUCTION"} mode`);

// Get network configuration
const networkName = process.argv[2] || "avalanche-testnet";
const network = networks[networkName];

if (!network) {
  console.error(`Network ${networkName} not found in network.config.js`);
  console.error(`Available networks: ${Object.keys(networks).join(", ")}`);
  process.exit(1);
}

console.log(`Using network: ${network.name} (Chain ID: ${network.chainId})`);

// Initialize the node
console.log("Starting GitHub PR Oracle Node...");

// Create the configuration object
const config = {};
config[network.chainId] = {
  type: "EVMMV3",
  id: network.chainId.toString(),
  name: network.name,
  rpc: network.rpcUrl,
};

// Add bootstrap peers if set in environment variables
if (process.env.BOOTSTRAP_PEERS) {
  console.log("Using bootstrap peers for P2P connection");
  config.bootstrapPeers = process.env.BOOTSTRAP_PEERS.split(",");
}

try {
  // Create the Vladiator instance
  const vladiator = new Vladiator(process.env.NODE_PRIVATE_KEY, config);

  // Set GitHub token on the PR Oracle feature if available
  if (process.env.GITHUB_TOKEN && Array.isArray(features)) {
    const githubOracle = features.find((f) => f.featureName === "GitHubOracle");
    if (githubOracle) {
      githubOracle.githubToken = process.env.GITHUB_TOKEN;
      console.log("GitHub API token configured for the oracle");
    }
  }

  // Manually load features since auto-loading is looking in a different directory
  if (Array.isArray(features)) {
    features.forEach((feature) => {
      console.log(
        `Loading feature: ${feature.featureName} (ID: ${feature.featureId})`
      );
      vladiator.loadFeature(feature);
    });
  }

  console.log("Node started successfully!");
  console.log(`Listening for GitHub PR status requests on ${network.name}...`);
  console.log("Press Ctrl+C to stop the node");
} catch (error) {
  console.error("Failed to start the node:", error);
  process.exit(1);
}
