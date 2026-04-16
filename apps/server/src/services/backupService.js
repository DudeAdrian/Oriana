const AWS = require('aws-sdk');

const BACKUP_BUCKET = process.env.AWS_BACKUP_BUCKET;
const BACKUP_REGION = process.env.AWS_BACKUP_REGION || 'ap-southeast-2';

const s3Backup = new AWS.S3({
  region: BACKUP_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

/**
 * Create daily database backup
 */
const createDatabaseBackup = async (backupName = null) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = backupName || `db-backup-${timestamp}.sql`;

  try {
    // In production, use AWS Database Migration Service or native tools
    // This is a placeholder for the actual backup process
    console.log(`Creating database backup: ${fileName}`);
    
    return {
      backupName: fileName,
      timestamp: new Date().toISOString(),
      status: 'in_progress'
    };
  } catch (error) {
    throw new Error(`Database backup failed: ${error.message}`);
  }
};

/**
 * Upload backup to S3 in multiple regions
 */
const uploadBackupToS3 = async (backupData, backupName) => {
  try {
    const regions = ['ap-southeast-2']; // Primary region
    if (process.env.ENABLE_SECONDARY_BACKUP) {
      regions.push(process.env.SECONDARY_BACKUP_REGION || 'us-east-1');
    }

    const uploadPromises = regions.map(region => {
      const params = {
        Bucket: BACKUP_BUCKET,
        Key: `backups/${backupName}`,
        Body: backupData,
        ServerSideEncryption: 'AES256',
        StorageClass: 'GLACIER', // Cost-effective for backups
        Metadata: {
          'backup-date': new Date().toISOString(),
          'region': region
        }
      };

      const s3Instance = new AWS.S3({ region });
      return s3Instance.upload(params).promise();
    });

    const results = await Promise.all(uploadPromises);

    return {
      backupName,
      regions: regions,
      backupUrls: results.map(r => r.Location),
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
  } catch (error) {
    throw new Error(`S3 backup upload failed: ${error.message}`);
  }
};

/**
 * Setup cross-region replication
 */
const setupReplication = async (sourceBucket, destBucket, destRegion) => {
  try {
    const params = {
      Bucket: sourceBucket,
      ReplicationConfiguration: {
        Role: process.env.AWS_REPLICATION_ROLE_ARN,
        Rules: [
          {
            ID: `replicate-to-${destRegion}`,
            Status: 'Enabled',
            Priority: 1,
            Filter: {
              Prefix: ''
            },
            Destination: {
              Bucket: `arn:aws:s3:::${destBucket}`,
              ReplicationTime: {
                Status: 'Enabled',
                Time: {
                  Minutes: 15
                }
              },
              Metrics: {
                Status: 'Enabled',
                EventThreshold: {
                  Minutes: 15
                }
              }
            }
          }
        ]
      }
    };

    const s3 = new AWS.S3({
      region: process.env.AWS_REGION || 'ap-southeast-2'
    });

    await s3.putBucketReplication(params).promise();

    return {
      status: 'configured',
      sourceBucket,
      destBucket,
      destRegion,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Replication setup failed: ${error.message}`);
  }
};

/**
 * List backup history
 */
const listBackups = async (limit = 30) => {
  try {
    const params = {
      Bucket: BACKUP_BUCKET,
      Prefix: 'backups/',
      MaxKeys: limit
    };

    const result = await s3Backup.listObjectsV2(params).promise();

    return (result.Contents || []).map(item => ({
      name: item.Key.replace('backups/', ''),
      size: item.Size,
      lastModified: item.LastModified,
      storageClass: item.StorageClass
    }));
  } catch (error) {
    throw new Error(`Failed to list backups: ${error.message}`);
  }
};

/**
 * Restore from backup
 */
const restoreFromBackup = async (backupName) => {
  try {
    const params = {
      Bucket: BACKUP_BUCKET,
      Key: `backups/${backupName}`
    };

    const backup = await s3Backup.getObject(params).promise();

    return {
      backupName,
      data: backup.Body,
      size: backup.ContentLength,
      restored: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Backup restore failed: ${error.message}`);
  }
};

/**
 * Enable versioning untuk disaster recovery
 */
const enableVersioning = async (bucketName) => {
  try {
    const params = {
      Bucket: bucketName,
      VersioningConfiguration: {
        Status: 'Enabled'
      }
    };

    const s3 = new AWS.S3({
      region: process.env.AWS_REGION || 'ap-southeast-2'
    });

    await s3.putBucketVersioning(params).promise();

    return {
      bucket: bucketName,
      versioning: 'enabled',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Versioning enablement failed: ${error.message}`);
  }
};

module.exports = {
  createDatabaseBackup,
  uploadBackupToS3,
  setupReplication,
  listBackups,
  restoreFromBackup,
  enableVersioning
};
