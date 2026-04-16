const prisma = require('./db');
const searchService = require('./searchService');
const auditService = require('./auditService');

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

  // Sync with Elasticsearch for search consistency
  await searchService.indexUser(user);
  await auditService.logAction(userId, 'UPDATE_PROFILE', 'User', userId, { fields: Object.keys(data) });

  return user;
};

const searchUsers = async (query) => {
  // Using Elasticsearch for better performance and relevance
  return await searchService.searchUsers(query);
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
