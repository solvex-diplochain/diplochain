require('dotenv').config();
const blockchainService = require('../services/blockchainService');
const crypto = require('crypto');

async function testBlockchain() {
  console.log('--- Testing Blockchain Integration ---');

  try {
    // 1. Check connection
    const status = await blockchainService.checkConnection();
    console.log('Connection status:', status);
    if (!status.connected) {
      console.error('Blockchain not connected. Make sure "npx hardhat node" is running.');
      return;
    }

    // 2. Generate a test diploma hash
    const diplomaId = 'test_diploma_' + Date.now();
    const certificateNumber = 'CERT-' + Math.floor(Math.random() * 1000000);
    // Use the same hashing logic as in Diploma model if possible, but here we just need a bytes32
    const data = `${diplomaId}${certificateNumber}${Date.now()}`;
    const diplomaHash = '0x' + crypto.createHash('sha256').update(data).digest('hex');
    console.log('Generated diploma hash:', diplomaHash);

    // 3. Issue diploma
    const studentAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Account #1 from Hardhat
    console.log('Issuing diploma to:', studentAddress);
    
    const issueResult = await blockchainService.issueDiplomaHash(
      diplomaHash,
      studentAddress,
      'ipfs://test-metadata-uri'
    );
    console.log('Issue result:', issueResult);

    // 4. Verify diploma
    console.log('Verifying diploma...');
    const verification = await blockchainService.verifyDiploma(diplomaHash);
    console.log('Verification result:', verification);

    if (verification.verified && verification.student.toLowerCase() === studentAddress.toLowerCase()) {
      console.log('✅ Blockchain verification successful!');
    } else {
      console.error('❌ Blockchain verification failed!');
    }

    // 5. Revoke diploma
    console.log('Revoking diploma...');
    const revokeResult = await blockchainService.revokeDiploma(diplomaHash);
    console.log('Revoke result:', revokeResult);

    // 6. Verify again
    console.log('Verifying revoked diploma...');
    const verificationAfterRevoke = await blockchainService.verifyDiploma(diplomaHash);
    console.log('Verification after revoke:', verificationAfterRevoke);

    if (!verificationAfterRevoke.verified) {
      console.log('✅ Blockchain revocation successful!');
    } else {
      console.error('❌ Blockchain revocation failed!');
    }

  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

testBlockchain();
