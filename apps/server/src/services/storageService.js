const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS SDK
const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;

/**
 * Upload file to S3 with a unique key
 */
const uploadToS3 = async (file, folder = 'uploads') => {
  try {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000', // 1 year for immutable content
      Metadata: {
        'upload-date': new Date().toISOString(),
        'original-name': file.originalname
      }
    };

    const result = await s3.upload(params).promise();

    // Return CloudFront URL if configured
    const url = CLOUDFRONT_DOMAIN
      ? `${CLOUDFRONT_DOMAIN}/${fileName}`
      : result.Location;

    return {
      s3Key: fileName,
      s3Url: result.Location,
      cdnUrl: url,
      size: file.size,
      mimeType: file.mimetype
    };
  } catch (error) {
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

/**
 * Generate presigned URL for direct uploads (browser)
 */
const generatePresignedUrl = async (fileName, mimeType, folder = 'uploads') => {
  try {
    const key = `${folder}/${uuidv4()}.${fileName.split('.').pop()}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
      Expires: 3600 // 1 hour
    };

    const presignedUrl = await s3.getSignedUrlPromise('putObject', params);

    return {
      presignedUrl,
      s3Key: key,
      mimeType
    };
  } catch (error) {
    throw new Error(`Presigned URL generation failed: ${error.message}`);
  }
};

/**
 * Delete file from S3
 */
const deleteFromS3 = async (s3Key) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: s3Key
    };

    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    throw new Error(`S3 deletion failed: ${error.message}`);
  }
};

/**
 * Get object metadata
 */
const getS3ObjectMetadata = async (s3Key) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: s3Key
    };

    const metadata = await s3.headObject(params).promise();
    return {
      size: metadata.ContentLength,
      lastModified: metadata.LastModified,
      contentType: metadata.ContentType,
      eTag: metadata.ETag
    };
  } catch (error) {
    throw new Error(`S3 metadata retrieval failed: ${error.message}`);
  }
};

/**
 * List objects in a folder
 */
const listS3Objects = async (folder, maxKeys = 100) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: folder,
      MaxKeys: maxKeys
    };

    const result = await s3.listObjectsV2(params).promise();
    return result.Contents || [];
  } catch (error) {
    throw new Error(`S3 listing failed: ${error.message}`);
  }
};

/**
 * Copy object (e.g., for backup/replication)
 */
const copyS3Object = async (sourceKey, destKey, destBucket = null) => {
  try {
    const params = {
      Bucket: destBucket || BUCKET_NAME,
      CopySource: `/${BUCKET_NAME}/${sourceKey}`,
      Key: destKey
    };

    await s3.copyObject(params).promise();
    return true;
  } catch (error) {
    throw new Error(`S3 copy failed: ${error.message}`);
  }
};

/**
 * Create multipart upload for large files
 */
const initiateMultipartUpload = async (fileName) => {
  try {
    const key = `uploads/${uuidv4()}.${fileName.split('.').pop()}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    const result = await s3.createMultipartUpload(params).promise();
    return {
      uploadId: result.UploadId,
      s3Key: key,
      uploadUrl: `${CLOUDFRONT_DOMAIN || s3.endpoint.href}/${key}` 
    };
  } catch (error) {
    throw new Error(`Multipart upload initiation failed: ${error.message}`);
  }
};

module.exports = {
  uploadToS3,
  generatePresignedUrl,
  deleteFromS3,
  getS3ObjectMetadata,
  listS3Objects,
  copyS3Object,
  initiateMultipartUpload
};
