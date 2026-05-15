const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command, CopyObjectCommand, CreateMultipartUploadCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { Upload } = require('@aws-sdk/lib-storage');
const { v4: uuidv4 } = require('uuid');

// Configure AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  endpoint: process.env.AWS_ENDPOINT || undefined, // Useful for MinIO
  forcePathStyle: true
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

    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
        CacheControl: 'max-age=31536000',
        Metadata: {
          'upload-date': new Date().toISOString(),
          'original-name': file.originalname
        }
      },
    });

    const result = await parallelUploads3.done();

    // Ensure CloudFront domain has protocol and no trailing slash
    let url = result.Location || `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    if (CLOUDFRONT_DOMAIN) {
      const baseCdn = CLOUDFRONT_DOMAIN.startsWith('http') ? CLOUDFRONT_DOMAIN : `https://${CLOUDFRONT_DOMAIN}`;
      const normalizedCdn = baseCdn.endsWith('/') ? baseCdn.slice(0, -1) : baseCdn;
      url = `${normalizedCdn}/${fileName}`;
    }

    return {
      s3Key: fileName,
      s3Url: result.Location,
      cdnUrl: url,
      size: file.size,
      mimeType: file.mimetype
    };
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

/**
 * Generate presigned URL for direct uploads (browser)
 */
const generatePresignedUrl = async (fileName, mimeType, folder = 'uploads') => {
  try {
    const key = `${folder}/${uuidv4()}.${fileName.split('.').pop()}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

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
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key
    }));
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
    const metadata = await s3Client.send(new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key
    }));
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
    const result = await s3Client.send(new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: folder,
      MaxKeys: maxKeys
    }));
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
    await s3Client.send(new CopyObjectCommand({
      Bucket: destBucket || BUCKET_NAME,
      CopySource: `/${BUCKET_NAME}/${sourceKey}`,
      Key: destKey
    }));
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

    const result = await s3Client.send(new CreateMultipartUploadCommand({
      Bucket: BUCKET_NAME,
      Key: key
    }));

    const baseUrl = CLOUDFRONT_DOMAIN ? `https://${CLOUDFRONT_DOMAIN}` : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    
    return {
      uploadId: result.UploadId,
      s3Key: key,
      uploadUrl: `${baseUrl}/${key}` 
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
