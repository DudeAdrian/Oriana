const { PrismaClient } = require('@prisma/client');
const storageService = require('./storageService');
const ipfsService = require('./ipfsService');
const prisma = new PrismaClient();

const createVideo = async (userId, data) => {
  try {
    // Upload to both S3 (fast local access) and IPFS (decentralized)
    const storageResults = await Promise.all([
      data.videoFile ? storageService.uploadToS3(data.videoFile, 'videos') : Promise.resolve(null),
      data.videoFile ? ipfsService.addToIPFSWithMetadata(data.videoFile.buffer, data.videoFile.originalname, {
        userId,
        title: data.title
      }) : Promise.resolve(null)
    ]);

    const [s3Result, ipfsResult] = storageResults;

    const video = await prisma.video.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        videoUrl: s3Result?.cdnUrl || data.videoUrl,
        ipfsHash: ipfsResult?.ipfsHash || null,
        thumbnailUrl: data.thumbnailUrl,
        duration: data.duration,
        s3Key: s3Result?.s3Key || null,
        storageType: s3Result && ipfsResult ? 'hybrid' : (s3Result ? 's3' : 'ipfs')
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profileImage: true
          }
        }
      }
    });

    return video;
  } catch (error) {
    throw new Error(`Video creation failed: ${error.message}`);
  }
};

const getVideo = async (videoId, userId = null) => {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
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

  if (!video) {
    throw new Error('Video not found');
  }

  // Check if current user liked this video
  if (userId) {
    const liked = await prisma.like.findUnique({
      where: { userId_videoId: { userId, videoId } }
    });
    video.isLiked = !!liked;
  }

  return video;
};

const getUserVideos = async (userId, skip = 0, take = 10) => {
  const videos = await prisma.video.findMany({
    where: { userId },
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

const deleteVideo = async (videoId, userId) => {
  const video = await prisma.video.findUnique({ where: { id: videoId } });

  if (!video) {
    throw new Error('Video not found');
  }

  if (video.userId !== userId) {
    throw new Error('Unauthorized to delete this video');
  }

  // Delete from both S3 and IPFS
  const deletePromises = [];
  
  if (video.s3Key) {
    deletePromises.push(storageService.deleteFromS3(video.s3Key));
  }
  
  if (video.ipfsHash) {
    deletePromises.push(ipfsService.unpinFromService(video.ipfsHash));
  }

  await Promise.all(deletePromises);
  await prisma.video.delete({ where: { id: videoId } });
};

module.exports = {
  createVideo,
  getVideo,
  getUserVideos,
  deleteVideo
};
