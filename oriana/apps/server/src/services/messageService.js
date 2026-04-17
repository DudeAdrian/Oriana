const prisma = require('./db');

const sendMessage = async (senderId, receiverId, content) => {
  if (senderId === receiverId) {
    throw new Error('Cannot message yourself');
  }

  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId,
      content
    }
  });

  return message;
};

const getConversation = async (userId, otherUserId, skip = 0, take = 50) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    },
    skip,
    take,
    orderBy: { createdAt: 'desc' }
  });

  return messages.reverse();
};

const getConversations = async (userId) => {
  const sent = await prisma.message.findMany({
    where: { senderId: userId },
    distinct: ['receiverId'],
    orderBy: { createdAt: 'desc' }
  });

  const received = await prisma.message.findMany({
    where: { receiverId: userId },
    distinct: ['senderId'],
    orderBy: { createdAt: 'desc' }
  });

  const userIds = new Set([
    ...sent.map(m => m.receiverId),
    ...received.map(m => m.senderId)
  ]);

  // Optimization: Fetch all conversation users in one query
  const users = await prisma.user.findMany({
    where: { id: { in: Array.from(userIds) } },
    select: {
      id: true,
      username: true,
      displayName: true,
      profileImage: true
    }
  });

  return users;
};

const markMessageAsRead = async (messageId) => {
  await prisma.message.update({
    where: { id: messageId },
    data: { read: true }
  });
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  markMessageAsRead
};
