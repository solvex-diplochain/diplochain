const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class IpfsService {
  constructor() {
    this.apiKey = process.env.PINATA_API_KEY;
    this.apiSecret = process.env.PINATA_API_SECRET;
    this.jwt = process.env.PINATA_JWT;
    this.baseUrl = 'https://api.pinata.cloud';
  }

  /**
   * Upload JSON metadata to IPFS
   */
  async uploadJSON(data) {
    if (!this.jwt && !this.apiKey) {
      console.warn('IPFS credentials not configured. Simulating upload.');
      return {
        success: true,
        hash: 'Qm' + Math.random().toString(36).substring(2, 48),
        url: 'https://ipfs.io/ipfs/QmSimulation'
      };
    }

    try {
      const response = await axios.post(`${this.baseUrl}/pinning/pinJSONToIPFS`, data, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.jwt ? { Authorization: `Bearer ${this.jwt}` } : {
            pinata_api_key: this.apiKey,
            pinata_secret_api_key: this.apiSecret
          })
        }
      });

      return {
        success: true,
        hash: response.data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error.message);
      throw new Error(`IPFS Upload Error: ${error.message}`);
    }
  }

  /**
   * Upload a file to IPFS
   */
  async uploadFile(filePath, fileName) {
    if (!this.jwt && !this.apiKey) {
      console.warn('  IPFS credentials not configured. Simulating file upload.');
      return {
        success: true,
        hash: 'QmFile' + Math.random().toString(36).substring(2, 44),
        url: 'https://ipfs.io/ipfs/QmFileSimulation'
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      const metadata = JSON.stringify({
        name: fileName || 'diploma_file'
      });
      formData.append('pinataMetadata', metadata);

      const response = await axios.post(`${this.baseUrl}/pinning/pinFileToIPFS`, formData, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          ...(this.jwt ? { Authorization: `Bearer ${this.jwt}` } : {
            pinata_api_key: this.apiKey,
            pinata_secret_api_key: this.apiSecret
          })
        }
      });

      return {
        success: true,
        hash: response.data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error uploading file to IPFS:', error.message);
      throw new Error(`IPFS File Upload Error: ${error.message}`);
    }
  }

  /**
   * Get verification URL
   */
  getGatewayUrl(hash) {
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }
}

module.exports = new IpfsService();
