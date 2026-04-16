#!/bin/bash

# Verification Script - Ensure all files are created
# Run this to verify the complete project structure

echo "🔍 Verifying TikTok Clone - Decentralized Architecture"
echo "======================================================"
echo ""

missing_files=0
created_files=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
        ((created_files++))
    else
        echo "❌ $1 - MISSING"
        ((missing_files++))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1/"
        ((created_files++))
    else
        echo "❌ $1/ - MISSING"
        ((missing_files++))
    fi
}

echo "📁 Root Level Files"
check_file "package.json"
check_file "README.md"
check_file ".gitignore"
check_file "docker-compose.yml"
check_file "Dockerfile"
check_file "setup.sh"
check_file "deploy-aws.sh"
check_file "aws-cloudformation-template.json"
check_file "ARCHITECTURE_DECENTRALIZED.md"
check_file "DEPLOYMENT_GUIDE.md"
check_file "IMPLEMENTATION_SUMMARY.md"
check_file "deployment.json"
echo ""

echo "📁 Backend Server Structure"
check_dir "apps/server"
check_file "apps/server/package.json"
check_file "apps/server/.env.example"
check_file "apps/server/.gitignore"
check_file "apps/server/Dockerfile"
check_file "apps/server/src/index.js"
check_dir "apps/server/src/middleware"
check_file "apps/server/src/middleware/auth.js"
check_file "apps/server/src/middleware/errorHandler.js"
echo ""

echo "📁 Backend Routes"
check_dir "apps/server/src/routes"
check_file "apps/server/src/routes/auth.routes.js"
check_file "apps/server/src/routes/user.routes.js"
check_file "apps/server/src/routes/video.routes.js"
check_file "apps/server/src/routes/feed.routes.js"
check_file "apps/server/src/routes/comment.routes.js"
check_file "apps/server/src/routes/like.routes.js"
check_file "apps/server/src/routes/follow.routes.js"
check_file "apps/server/src/routes/notification.routes.js"
check_file "apps/server/src/routes/message.routes.js"
echo ""

echo "📁 Backend Services"
check_dir "apps/server/src/services"
check_file "apps/server/src/services/authService.js"
check_file "apps/server/src/services/userService.js"
check_file "apps/server/src/services/videoService.js"
check_file "apps/server/src/services/feedService.js"
check_file "apps/server/src/services/commentService.js"
check_file "apps/server/src/services/likeService.js"
check_file "apps/server/src/services/followService.js"
check_file "apps/server/src/services/notificationService.js"
check_file "apps/server/src/services/messageService.js"
check_file "apps/server/src/services/storageService.js"
check_file "apps/server/src/services/ipfsService.js"
check_file "apps/server/src/services/backupService.js"
echo ""

echo "📁 Database Schema"
check_dir "apps/server/prisma"
check_file "apps/server/prisma/schema.prisma"
echo ""

echo "📁 Mobile App Structure"
check_dir "apps/mobile"
check_file "apps/mobile/package.json"
check_file "apps/mobile/.env.example"
check_file "apps/mobile/.gitignore"
check_file "apps/mobile/App.js"
echo ""

echo "📁 Mobile App API"
check_dir "apps/mobile/src/api"
check_file "apps/mobile/src/api/client.js"
echo ""

echo "📁 Mobile App Hooks"
check_dir "apps/mobile/src/hooks"
check_file "apps/mobile/src/hooks/useAuth.js"
echo ""

echo "📁 Mobile App Components"
check_dir "apps/mobile/src/components"
check_file "apps/mobile/src/components/VideoCard.js"
echo ""

echo "📁 Mobile App Screens"
check_dir "apps/mobile/src/screens"
check_file "apps/mobile/src/screens/AuthScreens.js"
check_file "apps/mobile/src/screens/FeedScreen.js"
check_file "apps/mobile/src/screens/DiscoveryScreen.js"
check_file "apps/mobile/src/screens/SearchScreen.js"
check_file "apps/mobile/src/screens/ProfileScreen.js"
check_file "apps/mobile/src/screens/VideoDetailScreen.js"
check_file "apps/mobile/src/screens/MessagesScreen.js"
echo ""

echo "======================================================"
echo "✅ Created: $created_files files"
if [ $missing_files -gt 0 ]; then
    echo "❌ Missing: $missing_files files"
else
    echo "✅ All files successfully created!"
fi
echo ""

if [ $missing_files -eq 0 ]; then
    echo "🎉 Project structure is complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Review IMPLEMENTATION_SUMMARY.md"
    echo "  2. Read ARCHITECTURE_DECENTRALIZED.md"
    echo "  3. Follow DEPLOYMENT_GUIDE.md"
    echo "  4. Run: ./setup.sh"
fi
