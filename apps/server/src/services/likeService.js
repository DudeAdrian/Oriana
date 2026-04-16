const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const likeVideo = async (userId, videoId) => {
  const existingLike = await prisma.like.findUnique({
    where: { userId_videoId: { userId, videoId } }
  });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
    return { liked: false };
  }

  await prisma.like.create({
    data: { userId, videoId }
  });

  // Create notification
  const video = await prisma.video.findUnique({ where: { id: videoId } });
  if (video && video.userId !== userId) {
    await prisma.notification.create({
      data: {
        userId: video.userId,
        type: 'like',
        fromUserId: userId,
        content: `Someone liked your video`
      }
    });
  }

  return { liked: true };
};

const getVideoLikes = async (videoId) => {
  const count = await prisma.like.count({ where: { videoId } });
  return count;
};

module.exports = {
  likeVideo,
  getVideoLikes
};
