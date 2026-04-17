const axios = require('axios');

// IPFS configuration - can use Infura, Pinata, or local node
const IPFS_API_URL = process.env.IPFS_API_URL || 'http://localhost:5001';
const IPFS_GATEWAY = process.env.IPFS_GATEWAY || 'https://gateway.ipfs.io';
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

/**
 * Upload file to IPFS via local node or service
 */
const uploadToIPFS = async (fileBuffer, fileName) => {
  try {
    const formData = new global.FormData();
    formData.append('file', new global.Blob([fileBuffer]), fileName);

    const response = await fetch(`${IPFS_API_URL}/api/v0/add`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    const hash = data.Hash;
    const ipfsUrl = `${IPFS_GATEWAY}/ipfs/${hash}`;

    return {
      ipfsHash: hash,
      ipfsUrl,
      size: data.Size,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`IPFS upload failed: ${error.message}`);
  }
};

/**
 * Pin file to Pinata service for guaranteed availability
 */
const pinToService = async (ipfsHash, metadata = {}) => {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.warn('Pinata credentials not configured, skipping pinning');
    return null;
  }

  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinByHash',
      {
        hashesToPin: [ipfsHash],
        metadata: {
          name: metadata.name || uuidv4(),
          keyvalues: metadata
        }
      },
      {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        }
      }
    );

    return {
      pinned: true,
      service: 'pinata',
      pinnedAt: new Date().toISOString(),
      requestId: response.data.id
    };
  } catch (error) {
    console.error('Pinata pinning failed:', error.message);
    return null;
  }
};

/**
 * Unpin from service when content is removed
 */
const unpinFromService = async (ipfsHash) => {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    return false;
  }

  try {
    await axios.delete(
      `https://api.pinata.cloud/pinning/unpin/${ipfsHash}`,
      {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        }
      }
    );

    return true;
  } catch (error) {
    console.error('Pinata unpinning failed:', error.message);
    return false;
  }
};

/**
 * Get file from IPFS
 */
const getFromIPFS = async (ipfsHash) => {
  try {
    const url = `${IPFS_GATEWAY}/ipfs/${ipfsHash}`;
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000
    });

    return {
      buffer: response.data,
      size: response.headers['content-length'],
      mimeType: response.headers['content-type']
    };
  } catch (error) {
    throw new Error(`IPFS retrieval failed: ${error.message}`);
  }
};

/**
 * List all IPFS pins
 */
const listIPFSPins = async () => {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    return [];
  }

  try {
    const response = await axios.get(
      'https://api.pinata.cloud/data/pinList?status=pinned',
      {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        }
      }
    );

    return response.data.rows || [];
  } catch (error) {
    console.error('Failed to list IPFS pins:', error.message);
    return [];
  }
};

/**
 * Get IPFS node stats
 */
const getIPFSStats = async () => {
  try {
    const response = await axios.get(`${IPFS_API_URL}/api/v0/stats/repo`);
    return {
      repoSize: response.data.RepoSize,
      storageMax: response.data.StorageMax,
      version: response.data.Version
    };
  } catch (error) {
    console.error('Failed to get IPFS stats:', error.message);
    return null;
  }
};

/**
 * Add file to IPFS with metadata
 */
const addToIPFSWithMetadata = async (fileBuffer, fileName, metadata = {}) => {
  try {
    // First add to IPFS
    const ipfsResult = await uploadToIPFS(fileBuffer, fileName);

    // Then pin to service
    const pinResult = await pinToService(ipfsResult.ipfsHash, metadata);

    return {
      ...ipfsResult,
      pinned: !!pinResult,
      pinningService: pinResult?.service || null
    };
  } catch (error) {
    throw new Error(`IPFS with metadata failed: ${error.message}`);
  }
};

module.exports = {
  uploadToIPFS,
  pinToService,
  unpinFromService,
  getFromIPFS,
  listIPFSPins,
  getIPFSStats,
  addToIPFSWithMetadata
};
