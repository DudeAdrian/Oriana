const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createComment = async (userId, videoId, content) => {
  const comment = await prisma.comment.create({
    data: {
      userId,
      videoId,
      content
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

  return comment;
};

const getVideoComments = async (videoId, skip = 0, take = 20) => {
  const comments = await prisma.comment.findMany({
    where: { videoId },
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
      }
    }
  });

  return comments;
};

const deleteComment = async (commentId, userId) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment) {
    throw new Error('Comment not found');
  }

  if (comment.userId !== userId) {
    throw new Error('Unauthorized to delete this comment');
  }

  await prisma.comment.delete({ where: { id: commentId } });
};

module.exports = {
  createComment,
  getVideoComments,
  deleteComment
};
