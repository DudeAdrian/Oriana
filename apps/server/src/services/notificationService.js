const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getNotifications = async (userId, skip = 0, take = 20) => {
  const notifications = await prisma.notification.findMany({
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
      }
    }
  });

  // Get fromUser details for each notification
  const notificationsWithFromUser = await Promise.all(
    notifications.map(async (notif) => {
      const fromUser = await prisma.user.findUnique({
        where: { id: notif.fromUserId },
        select: {
          id: true,
          username: true,
          displayName: true,
          profileImage: true
        }
      });
      return { ...notif, fromUser };
    })
  );

  return notificationsWithFromUser;
};

const markAsRead = async (notificationId) => {
  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true }
  });
};

const getUnreadCount = async (userId) => {
  const count = await prisma.notification.count({
    where: { userId, read: false }
  });

  return count;
};

module.exports = {
  getNotifications,
  markAsRead,
  getUnreadCount
};
