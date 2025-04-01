/**
 * Weather Oracle Interface
 * ======================
 * 
 * This is the main application component for the weather oracle.
 * It provides a user-friendly interface for requesting weather data
 * from the oracle and viewing the results.
 * 
 * Key features:
 * - Modern, intuitive UI
 * - Network selection
 * - Zipcode input
 * - Weather data display
 * - Wallet connection
 * - Real-time request tracking
 */

import React, { useState, useEffect, useCallback } from 'react';
import WalletConnect from './components/WalletConnect.jsx';
import NetworkSelector from './components/NetworkSelector.jsx';
import WeatherRequestForm from './components/WeatherRequestForm.jsx';
import WeatherDisplay from './components/WeatherDisplay.jsx';
import RequestModal from './components/RequestModal.jsx';
import {
  connectWallet,
  switchNetwork,
  getTokenContract,
  getNetworkByChainId,
  getAllNetworks,
  listenForWalletEvents
} from './utils/blockchain';
import {
  deploymentsExist,
  getDeploymentByChainId,
  getDeploymentErrorMessage
} from './utils/deployments';
import {
  requestWeatherData,
  fetchWeatherDataForCurrentChain,
  fetchWeatherDataForChain
} from './utils/weather';
import { ethers } from 'ethers';

// Import styles
import './styles/base.css';

function App() {
  // ======== State Management ========
  
  // Wallet state
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState(null);
  const [signer, setSigner] = useState(null);
  
  // Network state
  const [sourceNetwork, setSourceNetwork] = useState('');
  
  // Oracle contract state
  const [oracleContract, setOracleContract] = useState(null);
  
  // Weather state
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [isLoadingWeather, setIsLoadingWeather] = useState({});
  
  // Request state
  const [isRequesting, setIsRequesting] = useState(false);
  
  // Modal state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestModalData, setRequestModalData] = useState({
    requestId: null,
    txHash: null,
    sourceNetwork: null,
    zipcode: null
  });
  
  // Cache for providers to avoid creating new ones for each request
  const [providerCache, setProviderCache] = useState({});
  
  // Cache for last fetch time to avoid too frequent fetches
  const [lastFetchTime, setLastFetchTime] = useState({});
  
  // Get all available networks
  const networks = getAllNetworks();
  
  // Check if deployments exist
  const deploymentError = getDeploymentErrorMessage();
  
  // ======== Weather Data Management ========
  
  // Fetch weather data for current request
  const handleFetchWeatherData = useCallback(async () => {
    if (!currentRequestId || !oracleContract) return null;
    
    return await fetchWeatherDataForCurrentChain(
      oracleContract,
      currentRequestId,
      chainId,
      setWeatherData,
      setIsLoadingWeather
    );
  }, [currentRequestId, oracleContract, chainId]);
  
  // ======== Oracle Contract ========
  
  // Initialize oracle contract
  const initOracleContract = useCallback(async (customSigner, customChainId) => {
    const signerToUse = customSigner || signer;
    const chainIdToUse = customChainId || chainId;
    
    if (!signerToUse || !chainIdToUse || !deploymentsExist()) return;
    
    const deployment = getDeploymentByChainId(chainIdToUse);
    if (!deployment) {
      console.error(`No deployment found for chain ID ${chainIdToUse}`);
      return;
    }
    
    try {
      // Create contract instance
      const contract = getTokenContract(deployment.address, signerToUse);
      setOracleContract(contract);
      
      return contract;
    } catch (error) {
      console.error('Error initializing contract:', error);
      return null;
    }
  }, [signer, chainId]);
  
  // ======== Wallet Connection ========
  
  // Connect to wallet
  const handleConnect = useCallback(async () => {
    try {
      const { signer, address, chainId } = await connectWallet();
      setSigner(signer);
      setAddress(address);
      setChainId(chainId);
      setIsConnected(true);
      
      // Set up event listeners
      listenForWalletEvents(handleWalletEvent);
      
      // Find the network key for the current chain ID
      const network = getNetworkByChainId(chainId);
      if (network && network.key) {
        setSourceNetwork(network.key);
      }
      
      return { signer, address, chainId };
    } catch (error) {
      console.error('Connection error:', error);
      return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Handle wallet events
  const handleWalletEvent = useCallback(async (event) => {
    if (event.type === 'accountsChanged') {
      if (event.accounts.length === 0) {
        // User disconnected
        setIsConnected(false);
        setAddress('');
        setSigner(null);
        setOracleContract(null);
        setCurrentRequestId(null);
      } else {
        // User switched accounts
        setAddress(event.accounts[0]);
        handleConnect();
      }
    } else if (event.type === 'chainChanged') {
      // User switched networks
      const newChainId = event.chainId;
      console.log(`Chain changed to ${newChainId}, updating source network`);
      setChainId(newChainId);
      
      if (isConnected) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await provider.getSigner();
        setSigner(newSigner);
        
        // Update source network
        const network = getNetworkByChainId(newChainId);
        if (network && network.key) {
          console.log(`Setting source network to ${network.key}`);
          setSourceNetwork(network.key);
        } else {
          console.warn(`No network found for chain ID ${newChainId}`);
        }
        
        // Initialize contract
        initOracleContract(newSigner, newChainId);
      }
    }
  }, [isConnected, handleConnect, initOracleContract]);
  
  // ======== Network Management ========
  
  // Handle source network change
  const handleSourceNetworkChange = useCallback((networkKey) => {
    // Always update the UI immediately
    setSourceNetwork(networkKey);
    
    // If we're connected, automatically switch networks
    if (isConnected) {
      const network = networks[networkKey];
      if (network && network.chainId !== Number(chainId)) {
        // Directly switch network without confirmation
        switchNetwork(networkKey).catch(error => {
          console.error('Network switch error:', error);
          // If network switch fails, we might need to revert the UI
          const currentNetwork = getNetworkByChainId(chainId);
          if (currentNetwork && currentNetwork.key) {
            setSourceNetwork(currentNetwork.key);
          }
        });
        // We've already updated the UI, and the chainChanged event
        // will handle any further updates if needed
      }
    }
  }, [isConnected, chainId, networks]);
  
  // ======== Request Modal ========
  
  // Function to check weather data for the modal
  const checkWeatherData = useCallback(async () => {
    if (!requestModalData.requestId) return null;
    
    // Get the current weather data
    const data = weatherData[requestModalData.requestId];
    if (data && data.fulfilled) {
      return data;
    }
    
    // Fetch the latest data
    return await handleFetchWeatherData();
  }, [requestModalData.requestId, weatherData, handleFetchWeatherData]);
  
  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setShowRequestModal(false);
  }, []);
  
  // ======== Request Weather Data ========
  
  // Helper function to execute the request transaction
  const handleRequestTransaction = useCallback(async (contract, zipcode) => {
    // Execute the request transaction
    setIsRequesting(true);
    
    try {
      // Get source network info
      const sourceNetworkObj = getNetworkByChainId(Number(chainId));
      
      // Request weather data
      const { receipt, requestId } = await requestWeatherData(contract, zipcode);
      console.log(`Weather data requested with ID: ${requestId}`);
      
      // Set current request ID
      setCurrentRequestId(requestId);
      
      // Show the request modal
      setRequestModalData({
        requestId,
        txHash: receipt.hash,
        sourceNetwork: sourceNetworkObj,
        zipcode
      });
      setShowRequestModal(true);
      
      // Find the RequestModal component in the DOM and update its state
      const modalElement = document.querySelector('.request-modal');
      if (modalElement) {
        // Create a custom event to notify the RequestModal component
        const event = new CustomEvent('sourceTransactionConfirmed');
        modalElement.dispatchEvent(event);
      }
      
      // Start polling for weather data
      const intervalId = setInterval(async () => {
        const data = await handleFetchWeatherData();
        if (data && data.fulfilled) {
          clearInterval(intervalId);
        }
      }, 10000); // Poll every 10 seconds
      
      // Clear interval after 5 minutes
      setTimeout(() => {
        clearInterval(intervalId);
      }, 5 * 60 * 1000);
      
      return { receipt, requestId };
    } catch (error) {
      console.error('Request error:', error);
      setShowRequestModal(false);
    } finally {
      setIsRequesting(false);
    }
  }, [chainId, handleFetchWeatherData]);
  
  // Request weather data
  const handleRequest = useCallback(async (zipcode) => {
    if (!isConnected || !oracleContract) {
      console.error('Wallet not connected');
      return;
    }
    
    if (!sourceNetwork) {
      console.error('Source network not selected');
      return;
    }
    
    if (!zipcode) {
      console.error('No zipcode provided');
      return;
    }
    
    // Get chain ID
    const sourceChainId = networks[sourceNetwork]?.chainId;
    
    if (!sourceChainId) {
      console.error('Invalid network selection');
      return;
    }
    
    // Check if we're on the right network and switch if needed
    if (Number(chainId) !== Number(sourceChainId)) {
      try {
        // Automatically switch to the source network without confirmation
        await switchNetwork(sourceNetwork);
        
        // Wait a moment for the network to switch before proceeding
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // The chainChanged event will update the UI, but we need to get a new contract
        // instance for the new network before proceeding
        const provider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await provider.getSigner();
        const deployment = getDeploymentByChainId(sourceChainId);
        if (!deployment) {
          console.error(`No deployment found for chain ID ${sourceChainId}`);
          return;
        }
        const newContract = getTokenContract(deployment.address, newSigner);
        
        // Now proceed with the request using the new contract
        return handleRequestTransaction(newContract, zipcode);
      } catch (error) {
        console.error('Network switch error:', error);
        return;
      }
    } else {
      // We're already on the right network, proceed with the request
      return handleRequestTransaction(oracleContract, zipcode);
    }
  }, [isConnected, oracleContract, sourceNetwork, networks, chainId, handleRequestTransaction]);
  
  // ======== Effect Hooks ========
  
  // Single effect for wallet connection and setup
  useEffect(() => {
    // Connect wallet on mount
    const setupWallet = async () => {
      try {
        // Connect wallet
        const { signer, address, chainId } = await connectWallet();
        setSigner(signer);
        setAddress(address);
        setChainId(chainId);
        setIsConnected(true);
        
        // Set up event listeners
        listenForWalletEvents(handleWalletEvent);
        
        // Find the network key for the current chain ID
        const network = getNetworkByChainId(chainId);
        if (network && network.key) {
          setSourceNetwork(network.key);
        }
        
        // Initialize contract
        if (chainId) {
          const deployment = getDeploymentByChainId(chainId);
          if (deployment) {
            const contract = getTokenContract(deployment.address, signer);
            setOracleContract(contract);
          }
        }
      } catch (error) {
        console.log('Wallet setup failed:', error);
      }
    };
    
    setupWallet();
    
    // Set up periodic weather data refresh (every 30 seconds)
    const intervalId = setInterval(() => {
      if (currentRequestId && oracleContract) {
        handleFetchWeatherData();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // We're using an empty dependency array to avoid re-running this effect
  
  // ======== Render UI ========
  
  // If there's a deployment error, show error message
  if (deploymentError) {
    return (
      <div className="oracle-container">
        <div className="oracle-header">
          <h1>Weather Oracle</h1>
          <p className="powered-by">Powered by VIA Protocol</p>
        </div>
        
        <div className="error-container">
          <h2>Deployment Not Found</h2>
          <p>{deploymentError}</p>
          <p>Please run the deployment script first:</p>
          <pre>node scripts/deploy.js</pre>
          <p>This will deploy the WeatherOracle contract and configure it for on-chain to off-chain communication.</p>
        </div>
      </div>
    );
  }
  
  // Get current network name
  const currentNetworkName = getNetworkByChainId(chainId)?.name || 'Unknown Network';
  
  // Get source chain ID
  const sourceChainId = networks[sourceNetwork]?.chainId;
  
  // Get current weather data
  const currentWeatherData = currentRequestId ? weatherData[currentRequestId] : null;
  
  // Check if weather data is loading
  const isLoadingCurrentWeather = sourceChainId ? isLoadingWeather[sourceChainId] : false;
  
  return (
    <div className="oracle-container">
      <div className="oracle-header">
        <div className="title-wrapper">
          <h1>Weather Oracle</h1>
        </div>
        <div className="wallet-section">
          <WalletConnect
            isConnected={isConnected}
            address={address}
            chainId={chainId}
            networkName={currentNetworkName}
            onConnect={handleConnect}
          />
        </div>
      </div>
      
      <div className="oracle-main">
        <div className="oracle-card">
          <div className="oracle-form-container">
            <div className="network-selection">
              <div className="source-network">
                {isConnected ? (
                  <NetworkSelector
                    networks={networks}
                    currentChainId={chainId}
                    selectedNetwork={sourceNetwork}
                    onNetworkChange={handleSourceNetworkChange}
                    label="Network"
                    placeholder="Select network"
                  />
                ) : (
                  <div className="connect-prompt-mini">
                    Connect wallet to select network
                  </div>
                )}
              </div>
            </div>
            
            <WeatherRequestForm
              isConnected={isConnected}
              onRequest={handleRequest}
              isLoading={isRequesting}
              sourceNetwork={sourceNetwork ? networks[sourceNetwork]?.name : null}
            />
            
            <WeatherDisplay
              weatherData={currentWeatherData}
              isLoading={isLoadingCurrentWeather || isRequesting}
              requestId={currentRequestId}
            />
            
            <div className="oracle-footer">
              <img src="/logo-black.svg" alt="VIA Protocol" className="via-logo" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Request Modal */}
      <RequestModal
        isOpen={showRequestModal}
        onClose={handleCloseModal}
        requestId={requestModalData.requestId}
        txHash={requestModalData.txHash}
        sourceNetwork={requestModalData.sourceNetwork}
        zipcode={requestModalData.zipcode}
        onCheckWeatherData={checkWeatherData}
        weatherData={currentWeatherData}
      />
    </div>
  );
}

export default App;
