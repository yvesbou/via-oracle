/**
 * GitHub PR Status Private Oracle
 *
 * This Private Oracle fetches PR status data from GitHub API and returns it to the oracle contract.
 * It only processes requests from the hardcoded contract address.
 */

import { ethers } from "ethers";
import axios from "axios";

/**
 * GitHub PR Oracle feature that implements the IFeature interface from node-core.
 * This feature processes PR status requests and returns PR status data.
 */
class GitHubOracle {
  // Feature identification properties required by IFeature
  featureId = 1; // ID 1 for Private Oracle
  featureName = "GitHubPROracle";
  featureDescription = "Private Oracle that returns GitHub PR status data";

  // Track processed requests to avoid duplicates
  processedRequests = new Set();

  // Hardcoded address of the deployed GitHubPROracle contract
  // This is the address we'll accept requests from
  deployedAddress = "0x7087de333b9C72FD6938eECB2067a0A8666635e3";

  // GitHub API authentication token (optional but recommended to avoid rate limits)
  githubToken = "";

  constructor() {
    if (this.deployedAddress === "") {
      throw new Error(
        "GitHubPROracle contract address not set. Please check the deployments/ directory for the deployed contract address and set it in the deployedAddress variable."
      );
    }
  }

  /**
   * Process a message from the blockchain
   * This is called when the GitHubPROracle contract requests PR status data
   *
   * @param {object} driver - The blockchain driver handling the message
   * @param {object} message - The message containing feature data
   * @returns {object} The processed message with feature reply
   */
  async process(driver, message) {
    const txId = message.values?.txId;
    console.log(`[GitHubPROracle] Processing request: ${txId}`);

    // Check if we've already processed this request
    if (this.processedRequests.has(txId)) {
      console.log(
        `[GitHubPROracle] Already processed request: ${txId}, skipping`
      );
      return message;
    }

    // Mark this request as processed
    this.processedRequests.add(txId);

    try {
      // We MUST decode the requestId from featureData
      if (!message.featureData) {
        throw new Error("No featureData found in message");
      }

      // The contract encodes (requestId, prId, repository) in featureData
      const abiCoder = new ethers.AbiCoder();
      const decoded = abiCoder.decode(
        ["uint256", "uint256", "string"],
        message.featureData
      );
      const requestId = decoded[0]; // Extract requestId
      const prId = decoded[1]; // Extract PR ID
      const repository = decoded[2]; // Extract repository name

      console.log(
        `[GitHubPROracle] Decoded requestId: ${requestId}, prId: ${prId}, repository: ${repository}`
      );

      // Fetch PR data from GitHub API
      const prData = await this.fetchPRData(repository, prId);

      // Determine PR status (1=OPEN, 2=MERGED, 3=CLOSED)
      let statusCode;
      if (prData.merged) {
        statusCode = 2; // MERGED
      } else if (prData.state === "open") {
        statusCode = 1; // OPEN
      } else {
        statusCode = 3; // CLOSED (not merged)
      }

      // Encode the PR data - MUST match contract's expected format
      // Format: (uint requestId, uint prId, uint8 statusCode, string title)
      const featureReply = abiCoder.encode(
        ["uint256", "uint256", "uint8", "string"],
        [requestId, prId, statusCode, prData.title]
      );

      // Set the feature reply on the message
      message.featureReply = featureReply;

      // CRITICAL: Ensure featureId is set on the message
      // This is needed by the executor to properly build the process args
      message.featureId = this.featureId;

      console.log(
        `[GitHubPROracle] Response encoded and ready to send for requestId: ${requestId}`
      );
      console.log(
        `[GitHubPROracle] Status: ${this.getStatusString(statusCode)}, Title: ${
          prData.title
        }`
      );
      console.log(
        `[GitHubPROracle] Message properties set: featureId=${
          message.featureId
        }, has featureReply=${!!message.featureReply}`
      );
      return message;
    } catch (error) {
      console.error(`[GitHubPROracle] Error processing message:`, error);
      // If we can't decode the message or fetch PR data, we can't process it
      // Just return the message without a featureReply
      return message;
    }
  }

  /**
   * Fetch PR data from GitHub API
   *
   * @param {string} repository - The repository name (e.g., 'deficollective/defiscan')
   * @param {number} prId - The PR ID
   * @returns {object} The PR data from GitHub API
   */
  async fetchPRData(repository, prId) {
    const url = `https://api.github.com/repos/${repository}/pulls/${prId}`;

    const headers = {
      Accept: "application/vnd.github.v3+json",
    };

    // Add authentication if token is provided
    if (this.githubToken) {
      headers["Authorization"] = `token ${this.githubToken}`;
    }

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      // If the PR doesn't exist or has been deleted
      if (error.response && error.response.status === 404) {
        console.log(`[GitHubPROracle] PR #${prId} not found in ${repository}`);
        // Return a default object for non-existent PRs
        return {
          title: `PR #${prId} not found`,
          state: "closed",
          merged: false,
        };
      }

      // Rethrow any other errors
      throw error;
    }
  }

  /**
   * Convert numeric status code to string representation
   *
   * @param {number} statusCode - The numeric status code
   * @returns {string} The string representation of the status
   */
  getStatusString(statusCode) {
    switch (statusCode) {
      case 1:
        return "OPEN";
      case 2:
        return "MERGED";
      case 3:
        return "CLOSED";
      default:
        return "UNKNOWN";
    }
  }

  /**
   * Validate a message from the blockchain
   * This is called before process() to allow custom security checks
   *
   * @param {object} driver - The blockchain driver handling the message
   * @param {object} message - The message to validate
   * @returns {boolean} Whether the message is valid for this feature
   */
  async isMessageValid(driver, message) {
    // Check if the sender matches our hardcoded deployed address
    if (
      message.sender &&
      message.sender.toLowerCase() !== this.deployedAddress.toLowerCase()
    ) {
      console.log(
        `[GitHubPROracle] Ignoring request from non-deployed contract: ${message.sender}`
      );
      return false;
    }

    console.log(
      `[GitHubPROracle] Valid request from deployed contract: ${message.sender}`
    );
    return true;
  }
}

export default GitHubOracle;
