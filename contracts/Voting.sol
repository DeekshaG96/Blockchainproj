// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Decentralized Voting System
 * @dev Implements secure voting, access controls, and real-time event emission.
 */
contract Voting {
    address public immutable admin;
    bool public electionStarted;
    uint256 public candidatesCount;

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // State mappings
    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    // Events for frontend real-time tracking
    event ElectionCreated(address indexed admin, uint256 timestamp);
    event CandidateAdded(uint256 indexed candidateId, string name);
    event ElectionStarted();
    event VoteCasted(address indexed voter, uint256 indexed candidateId, uint256 newVoteCount);

    // Custom errors for gas efficiency (cheaper than require strings)
    error OnlyAdminAllowed();
    error ElectionAlreadyStarted();
    error ElectionNotStarted();
    error AlreadyVoted();
    error InvalidCandidate();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdminAllowed();
        _;
    }

    constructor() {
        admin = msg.sender;
        emit ElectionCreated(admin, block.timestamp);
    }

    /**
     * @dev Adds a new candidate. Can only be called by admin before election starts.
     */
    function addCandidate(string calldata _name) external onlyAdmin {
        if (electionStarted) revert ElectionAlreadyStarted();
        
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        
        emit CandidateAdded(candidatesCount, _name);
    }

    /**
     * @dev Starts the election. Can only be called by admin.
     */
    function startElection() external onlyAdmin {
        if (electionStarted) revert ElectionAlreadyStarted();
        electionStarted = true;
        
        emit ElectionStarted();
    }

    /**
     * @dev Casts a vote for a candidate. Prevents double-voting.
     */
    function vote(uint256 _candidateId) external {
        if (!electionStarted) revert ElectionNotStarted();
        if (hasVoted[msg.sender]) revert AlreadyVoted();
        if (_candidateId == 0 || _candidateId > candidatesCount) revert InvalidCandidate();

        // State changes
        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        // Emit event for real-time frontend update
        emit VoteCasted(msg.sender, _candidateId, candidates[_candidateId].voteCount);
    }

    /**
     * @dev Fetches all candidates in a single call.
     */
    function getAllCandidates() external view returns (Candidate[] memory) {
        Candidate[] memory currentCandidates = new Candidate[](candidatesCount);
        for (uint256 i = 0; i < candidatesCount; i++) {
            currentCandidates[i] = candidates[i + 1];
        }
        return currentCandidates;
    }
}
