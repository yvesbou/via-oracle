/**
 * RequestModal Component
 * ====================
 * 
 * This component displays a modal with the status of a weather data request.
 * It shows the progress of the request from submission to fulfillment.
 */

import React, { useState, useEffect, useCallback } from 'react';

function RequestModal({ 
  isOpen, 
  onClose, 
  requestId, 
  txHash, 
  sourceNetwork,
  zipcode,
  onCheckWeatherData,
  weatherData
}) {
  // Modal state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSourceConfirmed, setIsSourceConfirmed] = useState(false);
  const [isOracleProcessing, setIsOracleProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Poll for weather data
  const checkWeatherData = useCallback(async () => {
    if (!requestId || !onCheckWeatherData) return;
    
    const data = await onCheckWeatherData();
    
    if (data && data.fulfilled) {
      setIsCompleted(true);
      setCurrentStep(3);
    }
  }, [requestId, onCheckWeatherData]);
  
  // Effect to handle source transaction confirmation
  useEffect(() => {
    if (isOpen && txHash && !isSourceConfirmed) {
      // Mark the source transaction as confirmed
      setIsSourceConfirmed(true);
      setCurrentStep(2);
      setIsOracleProcessing(true);
      
      // Add event listener for source transaction confirmation
      const modalElement = document.querySelector('.request-modal');
      if (modalElement) {
        const handleSourceConfirmed = () => {
          setIsSourceConfirmed(true);
          setCurrentStep(2);
        };
        
        modalElement.addEventListener('sourceTransactionConfirmed', handleSourceConfirmed);
        
        return () => {
          modalElement.removeEventListener('sourceTransactionConfirmed', handleSourceConfirmed);
        };
      }
    }
  }, [isOpen, txHash, isSourceConfirmed]);
  
  // Effect to poll for weather data
  useEffect(() => {
    if (!isOpen || !isSourceConfirmed || isCompleted) return;
    
    const intervalId = setInterval(() => {
      checkWeatherData();
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [isOpen, isSourceConfirmed, isCompleted, checkWeatherData]);
  
  // If the modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="request-modal">
        <div className="modal-header">
          <h2>Weather Data Request</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="request-details">
            <p><strong>Request ID:</strong> {requestId}</p>
            <p><strong>Zipcode:</strong> {zipcode}</p>
            <p><strong>Network:</strong> {sourceNetwork?.name || 'Unknown'}</p>
            {txHash && (
              <p>
                <strong>Transaction:</strong>{' '}
                {sourceNetwork?.blockExplorer ? (
                  <a 
                    href={`${sourceNetwork.blockExplorer}/tx/${txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View on Explorer
                  </a>
                ) : (
                  <span>{txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}</span>
                )}
              </p>
            )}
          </div>
          
          <div className="status-steps">
            <div className={`status-step ${currentStep >= 1 ? 'active' : ''} ${isSourceConfirmed ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Request Submitted</h3>
                <p>Transaction sent to the blockchain</p>
              </div>
            </div>
            
            <div className={`status-step ${currentStep >= 2 ? 'active' : ''} ${isOracleProcessing && isCompleted ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Oracle Processing</h3>
                <p>Off-chain node fetching weather data</p>
              </div>
            </div>
            
            <div className={`status-step ${currentStep >= 3 ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Data Received</h3>
                <p>Weather data stored on-chain</p>
              </div>
            </div>
          </div>
          
          {isCompleted && weatherData && (
            <div className="weather-result">
              <h3>Weather Data Received!</h3>
              <div className="weather-result-card">
                <div className="weather-result-header">
                  <h4>{weatherData.location}</h4>
                </div>
                <div className="weather-result-body">
                  <p><strong>Temperature:</strong> {weatherData.temperature}</p>
                  <p><strong>Conditions:</strong> {weatherData.conditions}</p>
                </div>
              </div>
            </div>
          )}
          
          {!isCompleted && (
            <div className="waiting-message">
              <p>
                {currentStep === 1 ? (
                  'Waiting for transaction confirmation...'
                ) : currentStep === 2 ? (
                  'Waiting for the oracle to process your request...'
                ) : (
                  'Waiting for weather data to be received...'
                )}
              </p>
              <div className="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            className="close-modal-button" 
            onClick={onClose}
          >
            {isCompleted ? 'Close' : 'Close (Continue in Background)'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestModal;
