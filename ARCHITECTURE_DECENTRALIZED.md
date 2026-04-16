# TikTok Clone - Decentralized Architecture

## Architecture Overview

### Phase 1: Australia-Based Launch
- Primary Region: AWS Sydney (ap-southeast-2)
- Metadata Database: PostgreSQL in Sydney
- Video Storage: AWS S3 + IPFS nodes in Australia
- CDN: CloudFront (with Sydney origin)

### Phase 2: Global Expansion
- Add additional AWS regions per continent
- IPFS pinning network across regions
- Multi-region PostgreSQL replication
- Edge nodes in key locations

## System Components

```
Client (Mobile/Web)
    ↓
    ├── API Gateway (ALB/CloudFront)
    ↓
    ├── Server (Node.js + Express)
    │   ├── Authentication
    │   ├── Metadata Management
    │   └── IPFS Orchestration
    ↓
    ├── Metadata Store
    │   └── PostgreSQL (RDS - ap-southeast-2)
    │       └── Backup: S3 + Cross-region replica
    ↓
    ├── Video Storage
    │   ├── AWS S3 (ap-southeast-2)
    │   │   └── CloudFront CDN
    │   └── IPFS Network
    │       ├── Local IPFS nodes (AU)
    │       └── Pinning service (Pinata/Infura)
    ↓
    └── User Metadata
        ├── Profiles (PostgreSQL)
        ├── Avatar URLs (S3)
        └── IPFS hashes (content addressing)
```

## Storage Strategy

### Video Content (Decentralized Hybrid)
1. **Primary**: Upload to S3 + IPFS simultaneously
2. **S3**: Fast local retrieval for AU users
3. **IPFS**: Global availability + redundancy
4. **CDN**: CloudFront for edge caching

### User Metadata (Cloud + Backup)
1. **Primary DB**: PostgreSQL RDS in Sydney
2. **Backup**: Daily snapshots to S3
3. **Replica**: Read-only replicas in other regions (future)
4. **Blockchain**: Optional - store content hashes on-chain

## Implementation Strategy

### Phase 1: AU Deployment (Months 1-3)
- Setup AWS infrastructure in Sydney
- Deploy PostgreSQL RDS
- Implement S3 storage
- Integrate IPFS nodes
- Launch with AU user base

### Phase 2: Regional Expansion (Months 4-6)
- Add AWS regions (Singapore, Tokyo, London, US-East)
- Setup multi-region RDS replication
- Distribute IPFS nodes
- Regional pinning services

### Phase 3: Decentralized Network (Months 7-12)
- Community-run IPFS nodes
- Optional blockchain integration
- Governance protocol
- Reward system for node operators

## Cost Breakdown (Monthly AU)

| Component | Service | Cost (AUD) |
|-----------|---------|------------|
| Compute | EC2 (m5.xlarge) | $150/month |
| Database | RDS PostgreSQL | $200/month |
| Storage | S3 (1TB) | $50/month |
| CDN | CloudFront | $100/month |
| IPFS Pinning | Pinata | $100/month |
| Backup/DR | S3 Replication | $50/month |
| **Total** | | **$650/month** |

## Security & Privacy

- End-to-end encryption for sensitive data
- IPFS content encryption (optional)
- AWS VPC isolation
- DDoS protection via CloudFront
- Regular security audits
- GDPR/Privacy Act compliance

## Scalability

- Horizontal scaling: Auto-scaling groups
- Vertical scaling: RDS read replicas
- Global caching: CloudFront edge locations
- IPFS sharding: Content distributed across nodes
- Rate limiting: Per-user & per-region
