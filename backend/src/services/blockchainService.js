const Web3 = require('web3');
const path = require('path');
const fs = require('fs');

class BlockchainService {
  constructor() {
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
    this.web3 = new Web3(rpcUrl);
    
    // Addresses
    this.issuerAddress = process.env.BLOCKCHAIN_CONTRACT_ISSUER_ADDRESS;
    this.verifierAddress = process.env.BLOCKCHAIN_CONTRACT_VERIFIER_ADDRESS;
    
    // Private Key
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    if (privateKey && privateKey !== 'votre_cle_privee_metamask') {
      this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
      this.web3.eth.accounts.wallet.add(this.account);
      this.deployerAddress = this.account.address;
    } else {
      console.warn('⚠️  Blockchain private key not configured');
    }

    // Load ABIs
    try {
      const issuerAbiPath = path.join(__dirname, '../blockchain/abis/DiplomaIssuer.json');
      const verifierAbiPath = path.join(__dirname, '../blockchain/abis/DiplomaVerifier.json');
      
      this.issuerABI = JSON.parse(fs.readFileSync(issuerAbiPath, 'utf8'));
      this.verifierABI = JSON.parse(fs.readFileSync(verifierAbiPath, 'utf8'));
      
      if (this.issuerAddress) {
        this.issuerContract = new this.web3.eth.Contract(this.issuerABI, this.issuerAddress);
      }
      
      if (this.verifierAddress) {
        this.verifierContract = new this.web3.eth.Contract(this.verifierABI, this.verifierAddress);
      }
    } catch (error) {
      console.error('⚠️  Error loading contract ABIs:', error.message);
    }
  }

  /**
   * Check connection to blockchain network
   */
  async checkConnection() {
    try {
      const isListening = await this.web3.eth.net.isListening();
      const chainId = await this.web3.eth.getChainId();
      const blockNumber = await this.web3.eth.getBlockNumber();
      return {
        connected: true,
        chainId,
        blockNumber,
        deployer: this.deployerAddress,
        contracts: {
          issuer: !!this.issuerContract,
          verifier: !!this.verifierContract
        }
      };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }

  /**
   * Issue a diploma on the blockchain
   */
  async issueDiplomaHash(diplomaHash, studentAddress, metadataURI = '') {
    if (!this.issuerContract) throw new Error('Issuer contract not initialized');
    if (!this.account) throw new Error('Blockchain account not configured');

    try {
      // If diplomaHash is a string "0x...", convert to bytes32 if needed
      // web3 handles hex strings for bytes32 automatically if formatted correctly
      
      const tx = this.issuerContract.methods.issueDiploma(
        diplomaHash,
        studentAddress,
        metadataURI
      );

      const gas = await tx.estimateGas({ from: this.deployerAddress });
      const gasPrice = await this.web3.eth.getGasPrice();

      const receipt = await tx.send({
        from: this.deployerAddress,
        gas,
        gasPrice
      });

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        diplomaHash,
        studentAddress,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in issueDiplomaHash:', error);
      throw new Error(`Blockchain error: ${error.message}`);
    }
  }

  /**
   * Verify a diploma on the blockchain
   */
  async verifyDiploma(diplomaHash) {
    if (!this.verifierContract) throw new Error('Verifier contract not initialized');

    try {
      const result = await this.verifierContract.methods.getFullVerification(diplomaHash).call();
      
      return {
        verified: result.isValid,
        student: result.student,
        issueDate: new Date(Number(result.issueDate) * 1000),
        metadata: result.metadata,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in verifyDiploma:', error);
      return {
        verified: false,
        error: error.message
      };
    }
  }

  /**
   * Revoke a diploma on the blockchain
   */
  async revokeDiploma(diplomaHash) {
    if (!this.issuerContract) throw new Error('Issuer contract not initialized');
    
    try {
      const tx = this.issuerContract.methods.revokeDiploma(diplomaHash);
      const gas = await tx.estimateGas({ from: this.deployerAddress });
      const gasPrice = await this.web3.eth.getGasPrice();

      const receipt = await tx.send({
        from: this.deployerAddress,
        gas,
        gasPrice
      });

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        revokedAt: new Date()
      };
    } catch (error) {
      throw new Error(`Error revoking diploma: ${error.message}`);
    }
  }

  /**
   * Add an institution to the authorized issuers
   */
  async addInstitution(institutionAddress) {
    if (!this.issuerContract) throw new Error('Issuer contract not initialized');

    try {
      const tx = this.issuerContract.methods.addInstitution(institutionAddress);
      const gas = await tx.estimateGas({ from: this.deployerAddress });
      
      const receipt = await tx.send({
        from: this.deployerAddress,
        gas
      });

      return { success: true, transactionHash: receipt.transactionHash };
    } catch (error) {
      throw new Error(`Error adding institution: ${error.message}`);
    }
  }

  isValidAddress(address) {
    return this.web3.utils.isAddress(address);
  }
}

const blockchainService = new BlockchainService();
module.exports = blockchainService;