const prisma = require('./db');
const cache = require('./cache');

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

  // Optimization: Fetch all likes for these videos in one query (Avoid N+1)
  const videoIds = videos.map(v => v.id);
  const userLikes = await prisma.like.findMany({
    where: {
      userId,
      videoId: { in: videoIds }
    },
    select: { videoId: true }
  });

  const likedVideoIds = new Set(userLikes.map(l => l.videoId));
  const videosWithLikeStatus = videos.map(video => ({
    ...video,
    isLiked: likedVideoIds.has(video.id)
  }));

  return videosWithLikeStatus;
};

const getDiscoveryFeed = async (skip = 0, take = 10) => {
  const cacheKey = `feed:discovery:${skip}:${take}`;
  
  // Try to get from cache first
  if (skip === 0) {
    const cachedFeed = await cache.get(cacheKey);
    if (cachedFeed) return cachedFeed;
  }

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

  // Cache for 5 minutes if it's the first page
  if (skip === 0) {
    await cache.set(cacheKey, videos, 300);
  }

  return videos;
};

module.exports = {
  getFeed,
  getDiscoveryFeed
};
