# Deployment Guide - TikTok Clone Australia

## Overview

This guide covers deploying the TikTok Clone to AWS Sydney region (ap-southeast-2) with plan for global expansion.

## Prerequisites

- AWS Account with ap-southeast-2 access
- Docker & Docker Compose installed locally
- Node.js 18+
- AWS CLI v2
- Git

## Phase 1: Local Development Setup

### 1. Clone and Setup

```bash
git clone <repo-url>
cd tiktok-clone

# Make setup script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

This will:
- Install all dependencies
- Start PostgreSQL, Redis, IPFS, and MinIO
- Run Prisma migrations
- Setup initial databases

### 2. Verify Setup

```bash
# Check API health
curl http://localhost:5000/health

# Check database
docker exec tiktok-postgres psql -U user -d tiktok-clone -c "SELECT version();"

# Check IPFS
curl http://localhost:5001/api/v0/id

# Check MinIO at http://localhost:9001 (admin/admin123)
```

### 3. Start Services

```bash
# Terminal 1: Start backend
npm run dev:server

# Terminal 2: Start mobile app
npm run dev:mobile

# Terminal 3: View logs
docker-compose logs -f
```

## Phase 2: AWS Deployment (Sydney)

### 1. Setup AWS CLI

```bash
aws configure
# Set region to: ap-southeast-2
# Set output format to: json
```

### 2. Create S3 Buckets and Configure

```bash
chmod +x deploy-aws.sh
./deploy-aws.sh
```

### 3. Deploy CloudFormation Stack

```bash
aws cloudformation create-stack \
  --stack-name tiktok-clone-au \
  --template-body file://aws-cloudformation-template.json \
  --parameters ParameterKey=DBPassword,ParameterValue=your-secure-password \
  --region ap-southeast-2 \
  --capabilities CAPABILITY_IAM
```

### 4. Get CloudFormation Outputs

```bash
aws cloudformation describe-stacks \
  --stack-name tiktok-clone-au \
  --region ap-southeast-2 \
  --query 'Stacks[0].Outputs'
```

### 5. Configure Production Environment

Update `apps/server/.env`:

```bash
DATABASE_URL=postgresql://postgres:PASSWORD@RDS_ENDPOINT:5432/tiktok_clone
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=tiktok-clone-content-au
AWS_BACKUP_BUCKET=tiktok-clone-backups-au
CLOUDFRONT_DOMAIN=https://your-distribution.cloudfront.net
IPFS_GATEWAY=https://gateway.ipfs.io
PINATA_API_KEY=your-pinata-key
PINATA_SECRET_KEY=your-pinata-secret
```

### 6. Build and Push Docker Image

```bash
# Build image
docker build -t tiktok-clone:latest apps/server/

# Tag for ECR
docker tag tiktok-clone:latest 123456789.dkr.ecr.ap-southeast-2.amazonaws.com/tiktok-clone:latest

# Create ECR repository
aws ecr create-repository \
  --repository-name tiktok-clone \
  --region ap-southeast-2

# Login to ECR
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 123456789.dkr.ecr.ap-southeast-2.amazonaws.com

# Push image
docker push 123456789.dkr.ecr.ap-southeast-2.amazonaws.com/tiktok-clone:latest
```

### 7. Deploy to ECS/EC2

You can use:
- **ECS Fargate** for serverless containers
- **EC2** for more control
- **ElasticBeanstalk** for simplified deployment

Example ECS deployment:

```bash
aws ecs create-service \
  --cluster tiktok-clone \
  --service-name api \
  --task-definition tiktok-clone:1 \
  --desired-count 2 \
  --region ap-southeast-2
```

## Phase 3: Global Expansion (Multi-Region)

### Adding Singapore Region (Future)

1. Create read replica RDS in ap-southeast-1
2. Setup S3 cross-region replication
3. Deploy IPFS nodes in Singapore
4. Configure Route53 for failover

### Configuration Structure

```yaml
regions:
  primary:
    region: ap-southeast-2
    database: RDS Master
    storage: S3 Primary
    ipfs_nodes: 5
  replica:
    region: ap-southeast-1
    database: RDS Replica (read-only)
    storage: S3 Replicated
    ipfs_nodes: 3
```

## Monitoring & Maintenance

### CloudWatch Monitoring

```bash
# View logs
aws logs tail /tiktok-clone/server --follow --region ap-southeast-2

# Create alarms
aws cloudwatch put-metric-alarm \
  --alarm-name tiktok-api-cpu \
  --alarm-description "Alert if CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### Database Backups

```bash
# Manual backup
aws rds create-db-instance-snapshot \
  --db-snapshot-identifier tiktok-backup-manual-$(date +%Y%m%d) \
  --db-instance-identifier tiktok-clone-db \
  --region ap-southeast-2

# List backups
aws rds describe-db-snapshots --region ap-southeast-2
```

### IPFS Maintenance

```bash
# Check node status
curl http://localhost:5001/api/v0/id

# Get storage stats
curl http://localhost:5001/api/v0/stats/repo

# List pinned content
curl http://localhost:5001/api/v0/pin/ls
```

## Scaling Considerations

### Vertical Scaling
- Run `aws rds modify-db-instance` to increase DB instance size
- Increase EC2 instance type in auto-scaling groups

### Horizontal Scaling
- Add more IPFS nodes
- Setup load balancer (ALB) across multiple servers
- Configure auto-scaling policies

### Cost Optimization
- Use spot instances for batch processing
- Move old backups to Glacier storage
- Optimize CloudFront caching policies
- Use AWS Compute Savings Plans

## Security Best Practices

### Data Encryption
```bash
# Ensure S3 bucket encryption
aws s3api put-bucket-encryption \
  --bucket tiktok-clone-content-au \
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
```

### IAM Roles
```bash
# Create least-privilege role for app
aws iam create-role \
  --role-name tiktok-app-role \
  --assume-role-policy-document file://trust-policy.json
```

### DDoS Protection
- Enable AWS Shield Standard (automatic)
- Consider AWS Shield Advanced + AWS WAF for production

## Troubleshooting

### Connection Issues
```bash
# Check security group rules
aws ec2 describe-security-groups --region ap-southeast-2

# Test RDS connectivity
pg_isready -h <rds-endpoint> -p 5432 -U postgres
```

### S3 Upload Problems
```bash
# Check bucket policy
aws s3api get-bucket-policy --bucket tiktok-clone-content-au

# Check CORS configuration
aws s3api get-bucket-cors --bucket tiktok-clone-content-au
```

### IPFS Connectivity
```bash
# Check IPFS daemon status
curl http://localhost:5001/api/v0/id

# Test gateway access
curl https://gateway.ipfs.io/ipfs/QmXxxx
```

## Estimated Costs (Monthly - AU)

| Service | Size | Cost |
|---------|------|------|
| RDS PostgreSQL | db.t3.micro | $30 |
| EC2 Auto-scaling | 2-5 instances | $150-300 |
| S3 Storage | 100GB | $20 |
| S3 Data Transfer | 500GB/month | $50 |
| CloudFront | 500GB | $100 |
| IPFS Pinning (Pinata) | 100GB | $100 |
| **Total** | | **$450-600** |

## Support & Resources

- [AWS Documentation](https://docs.aws.amazon.com/)
- [IPFS Docs](https://docs.ipfs.io/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Discord Community](link)

