const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const followUser = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw new Error('Cannot follow yourself');
  }

  const existingFollow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } }
  });

  if (existingFollow) {
    await prisma.follow.delete({ where: { id: existingFollow.id } });
    return { following: false };
  }

  await prisma.follow.create({
    data: { followerId, followingId }
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId: followingId,
      type: 'follow',
      fromUserId: followerId
    }
  });

  return { following: true };
};

const getFollowers = async (userId, skip = 0, take = 20) => {
  const followers = await prisma.follow.findMany({
    where: { followingId: userId },
    skip,
    take,
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          displayName: true,
          profileImage: true,
          bio: true
        }
      }
    }
  });

  return followers.map(f => f.follower);
};

const getFollowing = async (userId, skip = 0, take = 20) => {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    skip,
    take,
    include: {
      following: {
        select: {
          id: true,
          username: true,
          displayName: true,
          profileImage: true,
          bio: true
        }
      }
    }
  });

  return following.map(f => f.following);
};

const isFollowing = async (followerId, followingId) => {
  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } }
  });

  return !!follow;
};

module.exports = {
  followUser,
  getFollowers,
  getFollowing,
  isFollowing
};
