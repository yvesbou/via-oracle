// SPDX-License-Identifier: MIT
// Adapted from WeatherOracle contract
pragma solidity =0.8.17;

import "@vialabs-io/npm-contracts/MessageClient.sol";

/**
 * @title GitHubPROracle
 * @dev A cross-chain GitHub PR oracle that requests and receives PR status data from off-chain nodes
 */
contract GitHubPROracle is MessageClient {
    // Repository constant
    string public constant REPOSITORY = "deficollective/defiscan";

    // PR Status enum
    enum PRStatus {
        UNKNOWN,
        OPEN,
        MERGED,
        CLOSED
    }

    // Events for tracking requests and responses
    event PRStatusRequested(
        uint indexed requestId,
        address indexed requester,
        uint prId
    );
    event PRStatusReceived(
        uint indexed requestId,
        uint prId,
        PRStatus status,
        string title,
        uint timestamp
    );

    // Struct to store PR data
    struct PRData {
        uint prId;
        PRStatus status;
        string title;
        uint timestamp;
        bool fulfilled;
    }

    // Mapping to store PR requests and data
    mapping(uint => PRData) public prRequests;

    // Mapping to track request owners
    mapping(uint => address) public requestOwners;

    // Request counter
    uint public nextRequestId;

    constructor() {
        MESSAGE_OWNER = msg.sender;
        nextRequestId = block.chainid * 10 ** 4;
    }

    /**
     * @dev Request PR status data for a PR ID
     * @param _prId The PR ID to get status data for
     * @return requestId The ID of the PR status request
     */
    function requestPRStatus(uint _prId) external returns (uint) {
        uint requestId = nextRequestId;

        // Store the request
        prRequests[requestId] = PRData({
            prId: _prId,
            status: PRStatus.UNKNOWN,
            title: "",
            timestamp: 0,
            fulfilled: false
        });

        // Store the request owner
        requestOwners[requestId] = msg.sender;

        // Increment the request ID
        nextRequestId++;

        // Encode the feature data (requestId and prId)
        // This is what the oracle node will receive and decode
        bytes memory featureData = abi.encode(requestId, _prId, REPOSITORY);

        // Empty message data since we're using feature data
        bytes memory messageData = "";

        // Check if MESSAGEv3 is set
        require(address(MESSAGEv3) != address(0), "Oracle not configured");

        // Send the message with feature ID 1 to the current chain
        _sendMessageWithFeature(
            block.chainid, // Send to the current chain
            messageData,
            1, // 1 for Private Oracle
            featureData
        );

        // Emit event
        emit PRStatusRequested(requestId, msg.sender, _prId);

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
        // Decode the feature response to get the PR status data
        // The feature response MUST include requestId, prId, status, and title
        // This MUST match what the oracle node encodes in featureReply
        (uint requestId, uint prId, uint8 statusCode, string memory title) = abi
            .decode(_featureResponse, (uint, uint, uint8, string));

        // Update the PR data
        PRData storage data = prRequests[requestId];
        data.prId = prId;
        data.status = PRStatus(statusCode);
        data.title = title;
        data.timestamp = block.timestamp;
        data.fulfilled = true;

        // Emit event
        emit PRStatusReceived(
            requestId,
            prId,
            PRStatus(statusCode),
            title,
            block.timestamp
        );
    }

    /**
     * @dev Get PR status data for a specific request
     * @param _requestId The ID of the PR status request
     * @return prId The PR ID
     * @return status The PR status (0=UNKNOWN, 1=OPEN, 2=MERGED, 3=CLOSED)
     * @return title The PR title
     * @return timestamp The timestamp when the data was received
     * @return fulfilled Whether the request has been fulfilled
     */
    function getPRData(
        uint _requestId
    )
        external
        view
        returns (
            uint prId,
            PRStatus status,
            string memory title,
            uint timestamp,
            bool fulfilled
        )
    {
        PRData storage data = prRequests[_requestId];
        return (
            data.prId,
            data.status,
            data.title,
            data.timestamp,
            data.fulfilled
        );
    }

    /**
     * @dev Get status as a string for a specific request
     * @param _requestId The ID of the PR status request
     * @return string representation of the status
     */
    function getPRStatusString(
        uint _requestId
    ) external view returns (string memory) {
        PRStatus status = prRequests[_requestId].status;

        if (status == PRStatus.OPEN) return "OPEN";
        if (status == PRStatus.MERGED) return "MERGED";
        if (status == PRStatus.CLOSED) return "CLOSED";
        return "UNKNOWN";
    }

    /**
     * @dev Check if a request has been fulfilled
     * @param _requestId The ID of the PR status request
     * @return Whether the request has been fulfilled
     */
    function isRequestFulfilled(uint _requestId) external view returns (bool) {
        return prRequests[_requestId].fulfilled;
    }

    /**
     * @dev Get all requests made by a specific address
     * @param _requester The address of the requester
     * @return requestIds Array of request IDs
     */
    function getRequestsByAddress(
        address _requester
    ) external view returns (uint[] memory) {
        // Count the number of requests by this address
        uint count = 0;
        for (uint i = block.chainid * 10 ** 4; i < nextRequestId; i++) {
            if (requestOwners[i] == _requester) {
                count++;
            }
        }

        // Create an array of the right size
        uint[] memory result = new uint[](count);

        // Fill the array
        uint index = 0;
        for (uint i = block.chainid * 10 ** 4; i < nextRequestId; i++) {
            if (requestOwners[i] == _requester) {
                result[index] = i;
                index++;
            }
        }

        return result;
    }

    /**
     * @dev Get all requests for a specific PR ID
     * @param _prId The PR ID to query
     * @return requestIds Array of request IDs
     */
    function getRequestsByPRId(
        uint _prId
    ) external view returns (uint[] memory) {
        // Count the number of requests for this PR ID
        uint count = 0;
        for (uint i = block.chainid * 10 ** 4; i < nextRequestId; i++) {
            if (prRequests[i].prId == _prId && prRequests[i].fulfilled) {
                count++;
            }
        }

        // Create an array of the right size
        uint[] memory result = new uint[](count);

        // Fill the array
        uint index = 0;
        for (uint i = block.chainid * 10 ** 4; i < nextRequestId; i++) {
            if (prRequests[i].prId == _prId && prRequests[i].fulfilled) {
                result[index] = i;
                index++;
            }
        }

        return result;
    }
}
