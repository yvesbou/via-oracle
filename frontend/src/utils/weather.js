/**
 * Weather Utilities
 * ===============
 * 
 * This file contains utility functions for interacting with the WeatherOracle contract.
 * It provides functions for requesting weather data and fetching weather data.
 */

import { ethers } from 'ethers';
import { getTokenContract } from './blockchain';
import { getDeploymentByChainId } from './deployments';

/**
 * Request weather data from the oracle
 * 
 * @param {Object} contract - The WeatherOracle contract instance
 * @param {string} zipcode - The zipcode to get weather data for
 * @returns {Promise<Object>} The transaction receipt and request ID
 */
export async function requestWeatherData(contract, zipcode) {
  if (!contract) {
    throw new Error('Contract instance is required');
  }
  
  if (!zipcode) {
    throw new Error('Zipcode is required');
  }
  
  console.log(`Requesting weather data for zipcode: ${zipcode}`);
  
  // Send the transaction
  const tx = await contract.requestWeather(zipcode);
  console.log(`Transaction hash: ${tx.hash}`);
  
  // Wait for the transaction to be mined
  console.log('Waiting for transaction confirmation...');
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  
  // Get the request ID from the event
  let requestId = null;
  
  for (const log of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(log);
      if (parsedLog && parsedLog.name === 'WeatherRequested') {
        requestId = parsedLog.args.requestId.toString();
        break;
      }
    } catch (e) {
      // Skip logs that can't be parsed
    }
  }
  
  if (!requestId) {
    throw new Error('Could not find request ID in transaction logs');
  }
  
  console.log(`Request ID: ${requestId}`);
  
  return {
    receipt,
    requestId
  };
}

/**
 * Check if a weather request has been fulfilled
 * 
 * @param {Object} contract - The WeatherOracle contract instance
 * @param {string} requestId - The request ID to check
 * @returns {Promise<boolean>} Whether the request has been fulfilled
 */
export async function isRequestFulfilled(contract, requestId) {
  if (!contract) {
    throw new Error('Contract instance is required');
  }
  
  if (!requestId) {
    throw new Error('Request ID is required');
  }
  
  return await contract.isRequestFulfilled(requestId);
}

/**
 * Get weather data for a request
 * 
 * @param {Object} contract - The WeatherOracle contract instance
 * @param {string} requestId - The request ID to get data for
 * @returns {Promise<Object>} The weather data
 */
export async function getWeatherData(contract, requestId) {
  if (!contract) {
    throw new Error('Contract instance is required');
  }
  
  if (!requestId) {
    throw new Error('Request ID is required');
  }
  
  const data = await contract.getWeatherData(requestId);
  
  return {
    zipcode: data.zipcode,
    temperature: data.temperature,
    conditions: data.conditions,
    location: data.location,
    timestamp: data.timestamp.toString(),
    fulfilled: data.fulfilled
  };
}

/**
 * Fetch weather data for a specific chain
 * 
 * @param {string} address - The user's address
 * @param {string} requestId - The request ID to fetch data for
 * @param {number} targetChainId - The chain ID to fetch data from
 * @param {number} currentChainId - The current chain ID
 * @param {Object} lastFetchTime - Cache of last fetch times
 * @param {Function} setLastFetchTime - Function to update last fetch times
 * @param {Function} setWeatherData - Function to update weather data
 * @param {Function} setIsLoading - Function to update loading state
 * @param {Object} providerCache - Cache of providers
 * @returns {Promise<Object|null>} The weather data or null if not found
 */
export async function fetchWeatherDataForChain(
  address,
  requestId,
  targetChainId,
  currentChainId,
  lastFetchTime,
  setLastFetchTime,
  setWeatherData,
  setIsLoading,
  providerCache
) {
  if (!address || !requestId || !targetChainId) {
    return null;
  }
  
  // Check if we've fetched this data recently (within the last 30 seconds)
  const now = Date.now();
  const lastFetch = lastFetchTime[`${targetChainId}-${requestId}`] || 0;
  if (now - lastFetch < 30000) {
    return null;
  }
  
  // Update last fetch time
  setLastFetchTime(prev => ({
    ...prev,
    [`${targetChainId}-${requestId}`]: now
  }));
  
  // Set loading state
  setIsLoading(prev => ({
    ...prev,
    [targetChainId]: true
  }));
  
  try {
    // Get deployment info
    const deployment = getDeploymentByChainId(targetChainId);
    if (!deployment) {
      console.error(`No deployment found for chain ID ${targetChainId}`);
      return null;
    }
    
    // Get or create provider
    let provider = providerCache[targetChainId];
    if (!provider) {
      provider = new ethers.JsonRpcProvider(deployment.rpcUrl);
      providerCache[targetChainId] = provider;
    }
    
    // Create contract instance
    const contract = getTokenContract(deployment.address, provider);
    
    // Check if the request is fulfilled
    const isFulfilled = await isRequestFulfilled(contract, requestId);
    
    if (isFulfilled) {
      // Get the weather data
      const data = await getWeatherData(contract, requestId);
      
      // Update weather data
      setWeatherData(prev => ({
        ...prev,
        [requestId]: data
      }));
      
      // Return the data
      return data;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching weather data for chain ${targetChainId}:`, error);
    return null;
  } finally {
    // Clear loading state
    setIsLoading(prev => ({
      ...prev,
      [targetChainId]: false
    }));
  }
}

/**
 * Fetch weather data for the current chain
 * 
 * @param {Object} contract - The WeatherOracle contract instance
 * @param {string} requestId - The request ID to fetch data for
 * @param {number} chainId - The current chain ID
 * @param {Function} setWeatherData - Function to update weather data
 * @param {Function} setIsLoading - Function to update loading state
 * @returns {Promise<Object|null>} The weather data or null if not found
 */
export async function fetchWeatherDataForCurrentChain(
  contract,
  requestId,
  chainId,
  setWeatherData,
  setIsLoading
) {
  if (!contract || !requestId || !chainId) {
    return null;
  }
  
  // Set loading state
  setIsLoading(prev => ({
    ...prev,
    [chainId]: true
  }));
  
  try {
    // Check if the request is fulfilled
    const isFulfilled = await isRequestFulfilled(contract, requestId);
    
    if (isFulfilled) {
      // Get the weather data
      const data = await getWeatherData(contract, requestId);
      
      // Update weather data
      setWeatherData(prev => ({
        ...prev,
        [requestId]: data
      }));
      
      // Return the data
      return data;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching weather data for current chain:`, error);
    return null;
  } finally {
    // Clear loading state
    setIsLoading(prev => ({
      ...prev,
      [chainId]: false
    }));
  }
}
