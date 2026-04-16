const prisma = require('./db');

/**
 * Log a system or user action for auditing and moderation
 */
const logAction = async (userId, action, entityType, entityId, metadata = {}) => {
  try {
    return await prisma.auditLog.create({
      data: {
        userId,
        action, // e.g., 'DELETE_VIDEO', 'UPDATE_PROFILE'
        entityType, // e.g., 'Video', 'User', 'Comment'
        entityId,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });
  } catch (error) {
    // Fail silently to prevent interrupting the main request, but log to console
    console.error('Audit Logging failed:', error.message);
  }
};

module.exports = { logAction };