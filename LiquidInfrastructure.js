import P2PBridge from './P2PBridge';
import LedgerWitness from './LedgerWitness';
import CompressionEngine from './CompressionEngine';

/**
 * LiquidInfrastructure: Gossip Protocol & Holohost Metadata Parcels
 * Ensures physical remembrance via P2P mesh before cloud upload.
 */
class LiquidInfrastructure {
  constructor() {
    this.PARCEL_COUNT = 6;
  }

  /**
   * Breaks metadata into encrypted parcels and gossips to the Hive.
   */
  async gossipMetadata(videoMetadata) {
    const manifest = await CompressionEngine.processVideo(videoMetadata.uri);
    const fullPayload = { ...videoMetadata, ...manifest };
    
    // Break into 6-wall parcels
    const parcels = this.createParcels(fullPayload);

    // Gossip to nearby nodes
    for (const parcel of parcels) {
      const encryptedParcel = await LedgerWitness.encryptForPeer('MESH_BROADCAST', parcel);
      
      // Push to P2PBridge for mesh propagation
      P2PBridge.broadcast('metadata_parcel', {
        ...encryptedParcel,
        protocol: 'ORIANA_LIQUID_V1',
        witness: await LedgerWitness.signPayload(encryptedParcel)
      });
    }

    return manifest;
  }

  createParcels(payload) {
    const rawStr = JSON.stringify(payload);
    const chunkSize = Math.ceil(rawStr.length / this.PARCEL_COUNT);
    const parcels = [];

    for (let i = 0; i < this.PARCEL_COUNT; i++) {
      parcels.push({
        index: i,
        total: this.PARCEL_COUNT,
        fragment: rawStr.substring(i * chunkSize, (i + 1) * chunkSize),
        rootCid: payload.witness?.cid,
        wall: i + 1
      });
    }

    return parcels;
  }
}

export default new LiquidInfrastructure();