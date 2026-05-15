#!/bin/bash

# AWS Deployment Script for TikTok Clone
# Deploy to AWS Sydney region (ap-southeast-2)

set -e

AWS_REGION="ap-southeast-2"
STACK_NAME="tiktok-clone-au"
ENVIRONMENT="production"

echo "🚀 Deploying TikTok Clone to AWS Sydney"
echo "======================================="

# Create S3 buckets
echo "creating S3 buckets..."
aws s3 mb s3://tiktok-clone-content-au --region $AWS_REGION || echo "Bucket already exists"
aws s3 mb s3://tiktok-clone-backups-au --region $AWS_REGION || echo "Bucket already exists"

# Enable versioning
echo "Enabling S3 versioning for disaster recovery..."
aws s3api put-bucket-versioning \
  --bucket tiktok-clone-content-au \
  --versioning-configuration Status=Enabled \
  --region $AWS_REGION

aws s3api put-bucket-versioning \
  --bucket tiktok-clone-backups-au \
  --versioning-configuration Status=Enabled \
  --region $AWS_REGION

# Create RDS database backup
echo "Setting up RDS backups..."
aws rds create-db-cluster-snapshot \
  --db-cluster-snapshot-identifier tiktok-clone-backup-$(date +%Y%m%d) \
  --db-cluster-identifier tiktok-clone-db \
  --region $AWS_REGION || echo "RDS not yet created"

# Setup CloudFront distribution
echo "Setting up CloudFront for global CDN..."
# This would use CloudFormation template - see template below

# Create CloudWatch logs
echo "Setting up CloudWatch for monitoring..."
aws logs create-log-group \
  --log-group-name /tiktok-clone/server \
  --region $AWS_REGION || echo "Log group already exists"

echo ""
echo "✅ AWS Deployment Setup Complete!"
echo ""
echo "📊 Next Steps:"
echo "   1. Update .env with your AWS credentials"
echo "   2. Deploy containers: aws ecr push tiktok-clone:latest"
echo "   3. Create RDS instance using AWS Console or CloudFormation"
echo "   4. Configure CloudFront distribution"
echo ""
echo "📍 Created Resources:"
echo "   - S3 Bucket (Content): s3://tiktok-clone-content-au"
echo "   - S3 Bucket (Backups): s3://tiktok-clone-backups-au"
echo "   - CloudWatch Logs: /tiktok-clone/server"
echo ""
