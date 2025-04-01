/**
 * Features Index
 * 
 * This file exports an array of available features in the system.
 * The Vladiator will automatically load these features during initialization.
 */

const WeatherOracle = require('./WeatherOracle');

// Create instances of all features
const weatherOracle = new WeatherOracle();

// Export the array of feature instances as default
// Add new features to this array to make them available for processing
const features = [
    weatherOracle
];

// Export as default to match node-core's expected format
module.exports = features;
module.exports.default = features;
