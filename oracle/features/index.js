/**
 * Features Index
 * 
 * This file exports an array of available features in the system.
 * The Vladiator will automatically load these features during initialization.
 */

import WeatherOracle from './WeatherOracle.js';

// Create instances of all features
const weatherOracle = new WeatherOracle();

// Export the array of feature instances as default
// Add new features to this array to make them available for processing
const features = [
    weatherOracle
];

export default features;
