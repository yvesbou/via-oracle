/**
 * WeatherRequestForm Component
 * ===========================
 * 
 * This component provides a form for requesting weather data from the oracle.
 * It allows users to input a zipcode and submit a request to the WeatherOracle contract.
 */

import React, { useState } from 'react';

function WeatherRequestForm({ 
  isConnected, 
  onRequest, 
  isLoading,
  sourceNetwork
}) {
  // Form state
  const [zipcode, setZipcode] = useState('');
  const [error, setError] = useState('');
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Validate form
    if (!zipcode) {
      setError('Please enter a zipcode');
      return;
    }
    
    // Basic zipcode validation
    if (!/^\d{5}(-\d{4})?$/.test(zipcode)) {
      setError('Please enter a valid US zipcode (e.g., 90210 or 90210-1234)');
      return;
    }
    
    if (!sourceNetwork) {
      setError('Please select a network');
      return;
    }
    
    // Call the request function
    onRequest(zipcode);
  };
  
  return (
    <div className="weather-request-form">
      {isConnected ? (
        <form onSubmit={handleSubmit}>
          <div className="zipcode-input-container">
            <div className="zipcode-input-wrapper">
              <label htmlFor="zipcode">Zipcode</label>
              <div className="zipcode-input-group">
                <input
                  type="text"
                  id="zipcode"
                  className="zipcode-input"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  placeholder="Enter zipcode (e.g., 90210)"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="request-error-message">
              {error}
            </div>
          )}
          
          {/* Submit button */}
          <button
            type="submit"
            className="request-button"
            disabled={isLoading || !zipcode || !sourceNetwork}
          >
            {isLoading ? (
              <>
                <span className="button-spinner"></span>
                Requesting...
              </>
            ) : (
              'Request Weather Data'
            )}
          </button>
          
          <div className="request-info">
            <p>
              This will send a request to the WeatherOracle contract on {sourceNetwork || 'the selected network'}.
              The off-chain node will fetch the weather data and send it back to the contract.
            </p>
          </div>
        </form>
      ) : (
        <div className="connect-prompt-request">
          <p>Connect your wallet to request weather data</p>
        </div>
      )}
    </div>
  );
}

export default WeatherRequestForm;
