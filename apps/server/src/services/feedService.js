const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getFeed = async (userId, skip = 0, take = 10) => {
  // Get videos from users that the current user follows
  const videos = await prisma.video.findMany({
    where: {
      user: {
        followers: {
          some: {
            followerId: userId
          }
        }
      }
    },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          profileImage: true
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true
        }
      }
    }
  });

  // Add like status for current user
  const videosWithLikeStatus = await Promise.all(
    videos.map(async (video) => {
      const liked = await prisma.like.findUnique({
        where: { userId_videoId: { userId, videoId: video.id } }
      });
      return { ...video, isLiked: !!liked };
    })
  );

  return videosWithLikeStatus;
};

const getDiscoveryFeed = async (skip = 0, take = 10) => {
  const videos = await prisma.video.findMany({
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          profileImage: true
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true
        }
      }
    }
  });

  return videos;
};

module.exports = {
  getFeed,
  getDiscoveryFeed
};
