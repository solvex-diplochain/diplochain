// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title DiplomaIssuer
 * @dev Contract to issue and store diploma hashes for DiploChain
 */
contract DiplomaIssuer is AccessControl {
    bytes32 public constant INSTITUTION_ROLE = keccak256("INSTITUTION_ROLE");

    struct Diploma {
        bytes32 diplomaHash;
        address studentAddress;
        uint256 issueDate;
        bool isValid;
        string metadataURI; // IPFS hash or similar
    }

    // Mapping from diploma identifier (hash) to Diploma struct
    mapping(bytes32 => Diploma) public diplomas;
    
    // Mapping to track if a diploma hash has already been used
    mapping(bytes32 => bool) public isDiplomaRegistered;

    event DiplomaIssued(bytes32 indexed diplomaHash, address indexed studentAddress, address indexed institution);
    event DiplomaRevoked(bytes32 indexed diplomaHash, address indexed institution);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(INSTITUTION_ROLE, msg.sender);
    }

    /**
     * @dev Function to grant institution role to an address
     * @param institution The address of the institution
     */
    function addInstitution(address institution) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(INSTITUTION_ROLE, institution);
    }

    /**
     * @dev Function to issue a new diploma
     * @param diplomaHash Unique hash representing the diploma content
     * @param studentAddress Address of the student receiving the diploma
     * @param metadataURI Link to diploma metadata (optional)
     */
    function issueDiploma(
        bytes32 diplomaHash,
        address studentAddress,
        string memory metadataURI
    ) external onlyRole(INSTITUTION_ROLE) {
        require(!isDiplomaRegistered[diplomaHash], "Diploma already registered");
        
        diplomas[diplomaHash] = Diploma({
            diplomaHash: diplomaHash,
            studentAddress: studentAddress,
            issueDate: block.timestamp,
            isValid: true,
            metadataURI: metadataURI
        });
        
        isDiplomaRegistered[diplomaHash] = true;
        
        emit DiplomaIssued(diplomaHash, studentAddress, msg.sender);
    }

    /**
     * @dev Function to revoke a diploma
     * @param diplomaHash Hash of the diploma to revoke
     */
    function revokeDiploma(bytes32 diplomaHash) external onlyRole(INSTITUTION_ROLE) {
        require(isDiplomaRegistered[diplomaHash], "Diploma not found");
        require(diplomas[diplomaHash].isValid, "Diploma already revoked");
        
        diplomas[diplomaHash].isValid = false;
        
        emit DiplomaRevoked(diplomaHash, msg.sender);
    }

    /**
     * @dev Function to check if a diploma is valid
     * @param diplomaHash Hash of the diploma to verify
     * @return isValid Boolean indicating if the diploma is valid
     * @return student Student address
     * @return issueDate Timestamp when it was issued
     */
    function getDiplomaInfo(bytes32 diplomaHash) external view returns (
        bool isValid,
        address student,
        uint256 issueDate,
        string memory metadata
    ) {
        require(isDiplomaRegistered[diplomaHash], "Diploma not registered");
        Diploma storage d = diplomas[diplomaHash];
        return (d.isValid, d.studentAddress, d.issueDate, d.metadataURI);
    }
}
