// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DiplomaIssuer.sol";

/**
 * @title DiplomaVerifier
 * @dev Helper contract to verify diplomas from a DiplomaIssuer contract
 */
contract DiplomaVerifier {
    DiplomaIssuer public issuerContract;

    constructor(address _issuerAddress) {
        issuerContract = DiplomaIssuer(_issuerAddress);
    }

    /**
     * @dev Simple verification function
     * @param diplomaHash Hash of the diploma
     * @return isValid Boolean indicating if the diploma is valid
     */
    function verify(bytes32 diplomaHash) external view returns (bool isValid) {
        try issuerContract.getDiplomaInfo(diplomaHash) returns (bool valid, address, uint256, string memory) {
            return valid;
        } catch {
            return false;
        }
    }

    /**
     * @dev Get full details for verification
     * @param diplomaHash Hash of the diploma
     */
    function getFullVerification(bytes32 diplomaHash) external view returns (
        bool isValid,
        address student,
        uint256 issueDate,
        string memory metadata
    ) {
        return issuerContract.getDiplomaInfo(diplomaHash);
    }
}
