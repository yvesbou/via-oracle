/**
 * WeatherDisplay Component
 * ======================
 * 
 * This component displays weather data received from the oracle.
 * It shows the location, temperature, conditions, and timestamp.
 */

import React from 'react';

function WeatherDisplay({ weatherData, isLoading, requestId }) {
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="weather-display loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Fetching weather data...</p>
          <p className="loading-info">This may take a few minutes as the request is processed by the oracle.</p>
        </div>
      </div>
    );
  }
  
  // Render empty state
  if (!weatherData || !weatherData.fulfilled) {
    return (
      <div className="weather-display empty">
        <div className="empty-container">
          <h3>No Weather Data</h3>
          {requestId ? (
            <p>Request #{requestId} is pending. The oracle node will process your request shortly.</p>
          ) : (
            <p>Use the form above to request weather data for a zipcode.</p>
          )}
        </div>
      </div>
    );
  }
  
  // Render weather data
  return (
    <div className="weather-display">
      <div className="weather-card">
        <div className="weather-header">
          <h3>{weatherData.location}</h3>
          <p className="weather-timestamp">
            Updated: {formatTimestamp(weatherData.timestamp)}
          </p>
        </div>
        
        <div className="weather-body">
          <div className="weather-temperature">
            <span className="temperature">{weatherData.temperature}</span>
          </div>
          
          <div className="weather-conditions">
            <span className="conditions">{weatherData.conditions}</span>
          </div>
        </div>
        
        <div className="weather-footer">
          <p className="request-id">Request ID: {requestId}</p>
          <p className="oracle-info">Data provided by VIA Weather Oracle</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherDisplay;
