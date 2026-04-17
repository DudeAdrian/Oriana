const prisma = require('./db');

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

  // Optimization: Fetch all 'from' users in one query
  const fromUserIds = [...new Set(notifications.map(n => n.fromUserId))];
  const fromUsers = await prisma.user.findMany({
    where: { id: { in: fromUserIds } },
    select: {
      id: true,
      username: true,
      displayName: true,
      profileImage: true
    }
  });

  const userMap = new Map(fromUsers.map(u => [u.id, u]));
  const notificationsWithFromUser = notifications.map(notif => ({
    ...notif,
    fromUser: userMap.get(notif.fromUserId) || null
  }));

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
