# TikTok Clone - Decentralized & Cloud-Native

A full-featured TikTok clone with **hybrid decentralized architecture** designed for Australia-first launch with global expansion roadmap.

### 🌍 Architecture Highlights

- **Hybrid Storage**: AWS S3 (fast) + IPFS (decentralized)
- **Cloud-Native**: PostgreSQL + Redis caching
- **Global Ready**: Multi-region replication support
- **Secure**: End-to-end encryption, AWS IAM integration
- **Scalable**: Auto-scaling, CDN distribution

## 🚀 Quick Start

### Local Development (5 minutes)

```bash
# Clone and setup
git clone <repo>
cd tiktok-clone
chmod +x setup.sh
./setup.sh

# Start development
npm run dev:server      # Terminal 1
npm run dev:mobile      # Terminal 2
```

### AWS Deployment (Australia)

```bash
# Configure AWS
aws configure

# Deploy infrastructure
chmod +x deploy-aws.sh
./deploy-aws.sh

# View deployment guide
cat DEPLOYMENT_GUIDE.md
```

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile & Web Clients                  │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│           CloudFront CDN + Load Balancer                │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│     Express API Server (Auto-scaling)                   │
│     - Auth & User Management                            │
│     - Video Processing                                  │
│     - IPFS Orchestration                                │
└────────┬─────────────────────────────┬─────────────────┘
         │                             │
    ┌────▼───────┐          ┌──────────▼────────┐
    │ PostgreSQL │          │   Redis Cache     │
    │ (RDS)      │          │                   │
    │ Sydney     │          │ Session/Real-time │
    └─────┬──────┘          └───────────────────┘
          │
    ┌─────▼──────────────────────────┐
    │  Backup & Replication          │
    ├──────────────────────────────┤
    │  S3 Content (Sydney)          │
    │  S3 Backups (Versioned)       │
    │  IPFS Network (Global)        │
    └───────────────────────────────┘
```

## Tech Stack

### Backend Services
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL (RDS) + Redis cache
- **ORM**: Prisma for type-safe DB access
- **Auth**: JWT + Bcrypt
- **Cloud Storage**: AWS S3 SDK
- **Decentralized**: IPFS HTTP client
- **Backup**: AWS SDK for replication

### Mobile Frontend  
- **Framework**: React Native + Expo
- **Navigation**: React Navigation (Bottom tabs + Stack)
- **HTTP**: Axios with interceptors
- **Storage**: AsyncStorage for auth tokens
- **Media**: Expo Camera, Video components

### Infrastructure
- **Compute**: AWS EC2 (Auto-scaling groups)
- **Database**: AWS RDS PostgreSQL
- **Cache**: AWS ElastiCache (Redis)
- **CDN**: CloudFront
- **Storage**: S3 + IPFS nodes
- **Backup**: S3 Glacier for archival
- **Monitoring**: CloudWatch logs & alarms

## 📁 Project Structure

```
tiktok-clone/
├── apps/
│   ├── mobile/              # React Native Expo app
│   │   ├── src/
│   │   │   ├── api/         # Axios client + endpoints
│   │   │   ├── hooks/       # useAuth, useFeed, useUser
│   │   │   ├── screens/     # Feed, Profile, Search, Messages
│   │   │   └── components/  # VideoCard, UserCard
│   │   └── App.js           # Navigation & auth flow
│   │
│   └── server/              # Node.js Express API
│       ├── src/
│       │   ├── routes/      # API endpoints (9 routes)
│       │   ├── services/    # Business logic
│       │   │   ├── authService.js
│       │   │   ├── videoService.js
│       │   │   ├── storageService.js    (AWS S3)
│       │   │   ├── ipfsService.js       (IPFS)
│       │   │   ├── backupService.js     (Disaster Recovery)
│       │   │   └── feedService.js
│       │   └── middleware/  # Auth, error handling
│       ├── prisma/
│       │   └── schema.prisma (DB schema)
│       ├── Dockerfile
│       └── index.js
│
├── Infrastructure/
│   ├── docker-compose.yml           # Local dev environment
│   ├── aws-cloudformation-template.json
│   ├── setup.sh                     # Local setup
│   ├── deploy-aws.sh                # AWS deployment
│   └── DEPLOYMENT_GUIDE.md          # Step-by-step guide
│
├── Documentation/
│   ├── ARCHITECTURE_DECENTRALIZED.md # Detailed architecture
│   ├── README.md                     # This file
│   └── deployment.json               # Region configuration
│
└── package.json                     # Monorepo root
```

## Getting Started

### Prerequisites
- Node.js v18+
- Docker & Docker Compose
- PostgreSQL (local or Docker)
- AWS CLI (for production)
- Expo CLI

### Installation (Local Development)

**Easiest way - Automated Setup (Recommended):**

```bash
# Clone repository
git clone <repo-url>
cd tiktok-clone

# Run automated setup (handles everything)
chmod +x setup.sh
./setup.sh

# Start developing
npm run dev:server      # Terminal 1: Backend on :5000
npm run dev:mobile      # Terminal 2: Mobile App
```

**Manual Setup:**

```bash
# 1. Install dependencies
npm install
npm install -w apps/server
npm install -w apps/mobile

# 2. Setup environment
cp apps/server/.env.example apps/server/.env
cp apps/mobile/.env.example apps/mobile/.env

# 3. Start infrastructure (Docker)
docker-compose up -d

# 4. Wait 30 seconds then run migrations
sleep 30
cd apps/server && npx prisma migrate dev --name init

# 5. Start services
npm run dev:server      # API runs on :5000
npm run dev:mobile      # Expo on :19006
```

### Production Deployment (AWS Sydney)

```bash
# 1. Configure AWS credentials
aws configure
# Region: ap-southeast-2

# 2. Run deployment script
chmod +x deploy-aws.sh
./deploy-aws.sh

# 3. Deploy infrastructure
aws cloudformation create-stack \
  --stack-name tiktok-clone-au \
  --template-body file://aws-cloudformation-template.json \
  --parameters ParameterKey=DBPassword,ParameterValue=YourSecurePassword \
  --region ap-southeast-2

# 4. Full guide in DEPLOYMENT_GUIDE.md
cat DEPLOYMENT_GUIDE.md
```

## 🔗 API Endpoints

### Authentication (Auth)
```
POST   /api/auth/register          # Create account
POST   /api/auth/login             # Login  
GET    /api/auth/verify            # Verify JWT token
```

### Users (User Management)
```
GET    /api/users/profile/:userId  # Get user profile
GET    /api/users/username/:username
GET    /api/users/search?q=query   # Search users
PUT    /api/users/profile          # Update profile (auth required)
```

### Videos (Content)
```
POST   /api/videos                 # Upload video (auth required)
GET    /api/videos/:videoId        # Get video details
GET    /api/videos/user/:userId    # Get user's videos
DELETE /api/videos/:videoId        # Delete video (auth required)
```

### Feed (Discovery)
```
GET    /api/feed                   # Personalized feed (auth required)
GET    /api/feed/discover          # Discovery feed
```

### Interactions (Engagement)
```
POST   /api/likes                  # Like/unlike video (auth required)
GET    /api/likes/video/:videoId   # Get like count
POST   /api/comments               # Add comment (auth required)
GET    /api/comments/video/:videoId # Get comments
DELETE /api/comments/:commentId    # Delete comment (auth required)
```

### Social (Relationships)
```
POST   /api/follows                      # Follow/unfollow (auth required)
GET    /api/follows/:userId/followers   # Get followers
GET    /api/follows/:userId/following   # Get following  
GET    /api/follows/:fId/:fgId/status   # Check if following
```

### Notifications & Messages (Real-time)
```
GET    /api/notifications                    # Get notifications (auth required)
PUT    /api/notifications/:notificationId/read
POST   /api/messages                         # Send message (auth required)
GET    /api/messages/conversations          # Get conversations
GET    /api/messages/conversation/:userId   # Get conversation
```

## 🛠️ Development

### Useful Commands

```bash
# Start services
npm run dev:server       # Backend API
npm run dev:mobile       # Mobile app

# Database management
cd apps/server && npx prisma studio    # Visual DB editor
npx prisma migrate dev                 # Create migration
npx prisma migrate deploy              # Apply migrations

# Docker management
docker-compose up -d                   # Start all services
docker-compose down                    # Stop all services
docker-compose logs -f server          # View server logs
docker exec tiktok-postgres psql -U user -d tiktok-clone  # Direct DB access

# AWS operations
./deploy-aws.sh                        # Deploy infrastructure
aws cloudformation describe-stacks --stack-name tiktok-clone-au  # View stack
```

### Testing Locally

```bash
# Health check
curl http://localhost:5000/health

# Create account
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","username":"testuser","password":"pass123","displayName":"Test User"}'

# Get user
curl http://localhost:5000/api/users/username/testuser
```

### Working with Services

```bash
# Access MinIO S3 (local dev)
# Console: http://localhost:9001 (admin/admin123)
# Upload: http://localhost:9000

# IPFS operations
curl http://localhost:5001/api/v0/id                    # Check node
curl http://localhost:8080/ipfs/QmXxxxx                 # Retrieve content

# PostgreSQL dumps
docker exec tiktok-postgres pg_dump -U user tiktok-clone > backup.sql
docker exec -i tiktok-postgres psql -U user < backup.sql
```

## 📈 Roadmap & Future Enhancements

### Phase 1: Australia Launch ✅
- [x] Core platform architecture
- [x] Hybrid cloud + IPFS storage
- [x] User authentication & profiles
- [x] Video upload & feed
- [ ] **Deploy to Australia (April 2026)**

### Phase 2: Global Expansion (May-June 2026)
- [ ] Multi-region AWS deployment
- [ ] Read replicas in Singapore, US, Europe
- [ ] IPFS nodes in key regions
- [ ] Route53 geographic routing
- [ ] Performance optimization per region

### Phase 3: Advanced Features (July-September 2026)
- [ ] Real-time notifications (WebSockets)
- [ ] Live streaming capability
- [ ] Video filters & effects
- [ ] Hashtag & trending algorithm
- [ ] Analytics dashboard
- [ ] Recommendation system (ML)

### Phase 4: Monetization (October 2026+)
- [ ] Creator rewards program
- [ ] Premium subscriptions
- [ ] Virtual gifts & tipping
- [ ] Ad network integration
- [ ] Stripe payments

### Phase 5: True Decentralization (2027)
- [ ] Optional blockchain integration
- [ ] Community-run IPFS nodes
- [ ] DAO governance
- [ ] Token economics
- [ ] Smart contracts

## 📊 Performance Targets

| Metric | Target | Implementation |
|--------|--------|-----------------|
| Page Load | < 2s | CloudFront cache |
| Video Upload | < 30s | Multi-part S3 upload |
| Feed Load | < 1s | Redis caching |
| API Response | < 200ms | RDS optimization |
| Uptime | 99.9% | Multi-AZ, Auto-scaling |
| Geo-distribution | < 100ms | Regional CDN |

## 🔐 Security Features

- ✅ JWT token-based auth
- ✅ Bcrypt password hashing  
- ✅ CORS protection
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ AWS IAM integration
- ✅ S3 encryption at rest
- ✅ VPC isolation
- ✅ DDoS protection (CloudFront)
- ✅ Regular security audits

## 📚 Documentation

- [ARCHITECTURE_DECENTRALIZED.md](./ARCHITECTURE_DECENTRALIZED.md) - System design
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Step-by-step AWS deployment
- [deployment.json](./deployment.json) - Region configuration

## 💰 Cost Estimates (Monthly)

### Australia Regional (ap-southeast-2)

| Service | Size | Cost (AUD) |
|---------|------|-----------|
| RDS PostgreSQL | t3.micro | $30 |
| EC2 Auto-scaling | 2-5 instances | $150-300 |
| S3 Storage | 100GB | $22 |
| S3 Data Transfer | 500GB | $55 |
| CloudFront CDN | 500GB | $110 |
| ElastiCache Redis | cache.t3.micro | $25 |
| IPFS Pinning (Pinata) | 100GB | $110 |
| CloudWatch & Logs | | $20 |
| **Total** | | **$522-672** |

### Global Expansion Cost (Phase 2)

Adding Singapore + US regions: +$400-600/month  
Total at 3 regions: **$900-1,300/month**

## 🚀 Getting Help

### Documentation
- Full deployment guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Architecture details: [ARCHITECTURE_DECENTRALIZED.md](./ARCHITECTURE_DECENTRALIZED.md)
- Configuration: [deployment.json](./deployment.json)

### Common Issues

**Docker not starting?**
```bash
docker-compose logs postgres    # Check database
docker system prune            # Clean up
docker-compose up -d --force-recreate
```

**API not connecting to S3?**
```bash
# Check AWS credentials
aws configure list

# Test S3 access
aws s3 ls
```

**IPFS not available?**
```bash
# Check IPFS daemon
curl http://localhost:5001/api/v0/id

# Restart IPFS
docker restart tiktok-ipfs
```

## 📞 Support & Community

- **Issues**: GitHub Issues
- **Documentation**: See `/docs` folder
- **AWS Support**: AWS Support Portal
- **IPFS Community**: https://discuss.ipfs.io

## 📄 License

MIT © 2026

## 🙏 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## ⭐ Acknowledgments

Built with:
- [Node.js](https://nodejs.org/)
- [React Native + Expo](https://expo.dev/)
- [Prisma](https://www.prisma.io/)
- [AWS](https://aws.amazon.com/)
- [IPFS](https://ipfs.io/)

---

**Status**: In Active Development  
**Latest Update**: April 2026  
**Primary Region**: Australia (Sydney)  
**Global Roadmap**: Multi-region Q2-Q3 2026
