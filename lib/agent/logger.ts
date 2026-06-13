// =============================================
// AI Agent Worker — Activity Logger
// =============================================

import { prisma } from "@/lib/prisma";

type AgentAction = "SCAN" | "ANALYZE" | "BID" | "EXECUTE" | "SUBMIT" | "REVISE";
type AgentStatus = "SUCCESS" | "FAILED" | "SKIPPED";

/**
 * Log agent activity to the database for audit trail and monitoring.
 */
export async function logAgentActivity(params: {
  taskId?: string;
  action: AgentAction;
  status: AgentStatus;
  details?: string;
  tokens?: number;
  cost?: number;
}) {
  try {
    await prisma.agentLog.create({
      data: {
        taskId: params.taskId ?? null,
        action: params.action,
        status: params.status,
        details: params.details ?? null,
        tokens: params.tokens ?? null,
        cost: params.cost ?? null,
      },
    });
  } catch (error) {
    // Don't let logging failures break the agent
    console.error("[AgentLogger] Failed to log:", error);
  }
}

/**
 * Get recent agent logs for the admin dashboard.
 */
export async function getRecentAgentLogs(limit: number = 50) {
  return prisma.agentLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Get agent stats summary.
 */
export async function getAgentStats() {
  const [totalLogs, totalCost, successCount, failedCount] = await Promise.all([
    prisma.agentLog.count(),
    prisma.agentLog.aggregate({ _sum: { cost: true } }),
    prisma.agentLog.count({ where: { status: "SUCCESS" } }),
    prisma.agentLog.count({ where: { status: "FAILED" } }),
  ]);

  const totalTokens = await prisma.agentLog.aggregate({ _sum: { tokens: true } });

  return {
    totalLogs,
    totalCost: totalCost._sum.cost ?? 0,
    totalTokens: totalTokens._sum.tokens ?? 0,
    successCount,
    failedCount,
    successRate: totalLogs > 0 ? (successCount / totalLogs) * 100 : 0,
  };
}
