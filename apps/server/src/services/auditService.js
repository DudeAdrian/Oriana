const fs = require('fs');
const path = require('path');
const prisma = require('./db');

const CENTRAL_LOG_PATH = "C:\\Users\\squat\\desktop\\Terracare_Ledger\\Swarm\\SOFIE_Core.log";

/**
 * Log a system or user action for auditing and moderation
 */
const logAction = async (userId, action, entityType, entityId, details = {}) => {
  try {
    // 1. Commit to the local Postgres layer via Prisma
    const logEntry = await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        details: JSON.stringify(details),
      },
    });

    // 2. Synchronize to the centralized ledger log under THE UNDERSCORE PROTOCOL
    const timestamp = new Date().toISOString();
    const cleanDetails = JSON.stringify(details).replace(/[\r\n]+/g, " ");
    const ledgerEntry = `_[${timestamp}]_ NODE_ORIANA | ACTION: ${action} | ENTITY: ${entityType}_${entityId} | USER: ${userId || "ANONYMOUS"} | DATA: ${cleanDetails}\n`;

    const dir = path.dirname(CENTRAL_LOG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.appendFileSync(CENTRAL_LOG_PATH, ledgerEntry, 'utf8');

    return logEntry;
  } catch (error) {
    console.error("[ORIANA AUDIT BRIDGE CRITICAL FAILURE]:", error);
    // Graceful preservation to avoid app blocking during presentation
    return null;
  }
};

/**
 * Get recent audit logs with optional filtering
 */
const getAuditLogs = async (filters = {}, page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;
    const where = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.entityType) where.entityType = filters.entityType;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
      }),
      prisma.auditLog.count({ where })
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error("[ORIANA AUDIT FETCH ERROR]:", error);
    return { logs: [], pagination: { page, limit, total: 0, totalPages: 0 } };
  }
};

module.exports = {
  logAction,
  getAuditLogs
};
