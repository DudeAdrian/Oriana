const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          videos: true,
          followers: true,
          following: true
        }
      }
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateProfile = async (userId, data) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      displayName: data.displayName,
      bio: data.bio,
      profileImage: data.profileImage
    }
  });

  return user;
};

const searchUsers = async (query) => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { displayName: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 20,
    select: {
      id: true,
      username: true,
      displayName: true,
      profileImage: true,
      bio: true
    }
  });

  return users;
};

const getUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          videos: true,
          followers: true,
          following: true
        }
      }
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = {
  getUserProfile,
  updateProfile,
  searchUsers,
  getUserByUsername
};
