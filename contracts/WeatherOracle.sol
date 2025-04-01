// SPDX-License-Identifier: MIT
// (c)2024 Atlas (atlas@vialabs.io)
pragma solidity =0.8.17;

import "@vialabs-io/npm-contracts/MessageClient.sol";

/**
 * @title WeatherOracle
 * @dev A cross-chain weather oracle that requests and receives weather data from off-chain nodes
 */
contract WeatherOracle is MessageClient {
    // Events for tracking requests and responses
    event WeatherRequested(uint indexed requestId, address indexed requester, string zipcode);
    event WeatherReceived(uint indexed requestId, string temperature, string conditions, string location);
    
    // Struct to store weather data
    struct WeatherData {
        string zipcode;
        string temperature;
        string conditions;
        string location;
        uint timestamp;
        bool fulfilled;
    }
    
    // Mapping to store weather requests and data
    mapping(uint => WeatherData) public weatherRequests;
    
    // Mapping to track request owners
    mapping(uint => address) public requestOwners;
    
    // Request counter
    uint public nextRequestId;
    
    constructor() {
        MESSAGE_OWNER = msg.sender;
        nextRequestId = block.chainid * 10**4;
    }
    
    /**
     * @dev Request weather data for a zipcode
     * @param _zipcode The zipcode to get weather data for
     * @return requestId The ID of the weather request
     */
    function requestWeather(string memory _zipcode) external returns (uint) {
        uint requestId = nextRequestId;
        
        // Store the request
        weatherRequests[requestId] = WeatherData({
            zipcode: _zipcode,
            temperature: "",
            conditions: "",
            location: "",
            timestamp: 0,
            fulfilled: false
        });
        
        // Store the request owner
        requestOwners[requestId] = msg.sender;
        
        // Increment the request ID
        nextRequestId++;
        
        // Encode the feature data (requestId and zipcode)
        // This is what the oracle node will receive and decode
        bytes memory featureData = abi.encode(requestId, _zipcode);
        
        // Empty message data since we're using feature data
        bytes memory messageData = "";
        
        // Check if MESSAGEv3 is set
        require(address(MESSAGEv3) != address(0), "Oracle not configured");
        
        // Send the message with feature ID 1 to the current chain
        _sendMessageWithFeature(
            block.chainid,  // Send to the current chain
            messageData,
            1,  // 1 for Private Oracle
            featureData
        );
        
        // Emit event
        emit WeatherRequested(requestId, msg.sender, _zipcode);
        
        return requestId;
    }
    
    /**
     * @dev Process incoming message from the off-chain node with feature support
     * @param _featureResponse Reply from feature processing off-chain
     */
    function _processMessageWithFeature(
        uint /* _txId */,
        uint /* _sourceChainId */,
        bytes memory /* _messageData */,
        uint32 /* _featureId */,
        bytes memory /* _featureData */,
        bytes memory _featureResponse
    ) internal virtual override {
        // Decode the feature response to get the weather data
        // The feature response MUST include requestId, temperature, conditions, and location
        // This MUST match what the oracle node encodes in featureReply
        (uint requestId, string memory temperature, string memory conditions, string memory location) = 
            abi.decode(_featureResponse, (uint, string, string, string));
        
        // Update the weather data
        WeatherData storage data = weatherRequests[requestId];
        data.temperature = temperature;
        data.conditions = conditions;
        data.location = location;
        data.timestamp = block.timestamp;
        data.fulfilled = true;
        
        // Emit event
        emit WeatherReceived(requestId, temperature, conditions, location);
    }
    
    /**
     * @dev Get weather data for a specific request
     * @param _requestId The ID of the weather request
     * @return zipcode The zipcode of the request
     * @return temperature The temperature
     * @return conditions The weather conditions
     * @return location The location name
     * @return timestamp The timestamp when the data was received
     * @return fulfilled Whether the request has been fulfilled
     */
    function getWeatherData(uint _requestId) external view returns (
        string memory zipcode,
        string memory temperature,
        string memory conditions,
        string memory location,
        uint timestamp,
        bool fulfilled
    ) {
        WeatherData storage data = weatherRequests[_requestId];
        return (
            data.zipcode,
            data.temperature,
            data.conditions,
            data.location,
            data.timestamp,
            data.fulfilled
        );
    }
    
    /**
     * @dev Check if a request has been fulfilled
     * @param _requestId The ID of the weather request
     * @return Whether the request has been fulfilled
     */
    function isRequestFulfilled(uint _requestId) external view returns (bool) {
        return weatherRequests[_requestId].fulfilled;
    }
    
    /**
     * @dev Get all requests made by a specific address
     * @param _requester The address of the requester
     * @return requestIds Array of request IDs
     */
    function getRequestsByAddress(address _requester) external view returns (uint[] memory) {
        // Count the number of requests by this address
        uint count = 0;
        for (uint i = block.chainid * 10**4; i < nextRequestId; i++) {
            if (requestOwners[i] == _requester) {
                count++;
            }
        }
        
        // Create an array of the right size
        uint[] memory result = new uint[](count);
        
        // Fill the array
        uint index = 0;
        for (uint i = block.chainid * 10**4; i < nextRequestId; i++) {
            if (requestOwners[i] == _requester) {
                result[index] = i;
                index++;
            }
        }
        
        return result;
    }
}
