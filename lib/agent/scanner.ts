// =============================================
// AI Agent Worker — Task Scanner (Multi-Agent)
// =============================================

import { prisma } from "@/lib/prisma";
import type { AgentProfile } from "./config";
import { agentGlobalConfig } from "./config";
import { logAgentActivity } from "./logger";

/**
 * Scan for available tasks that match a specific agent's specializations.
 * Only returns OPEN tasks that the agent hasn't bid on yet.
 */
export async function scanAvailableTasks(agent: AgentProfile) {
  try {
    const alreadyDraftedIds = await getAlreadyDraftedTaskIds(agent.userId);

    const tasks = await prisma.task.findMany({
      where: {
        status: "OPEN",
        category: { in: agent.specializations },
        // Exclude tasks already bid by this agent
        ...(agent.userId && {
          bids: {
            none: { workerId: agent.userId },
          },
        }),
        // Exclude tasks already drafted by this agent
        ...(alreadyDraftedIds.length > 0 && {
          id: { notIn: alreadyDraftedIds },
        }),
      },
      include: {
        client: {
          select: { name: true, email: true },
        },
        _count: {
          select: { bids: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: agentGlobalConfig.scanLimit,
    });

    await logAgentActivity({
      action: "SCAN",
      status: "SUCCESS",
      details: `[${agent.key}] Found ${tasks.length} tasks for ${agent.specializations.join(", ")}`,
    });

    return tasks;
  } catch (error) {
    await logAgentActivity({
      action: "SCAN",
      status: "FAILED",
      details: `[${agent.key}] Scan error: ${error instanceof Error ? error.message : String(error)}`,
    });
    throw error;
  }
}

/**
 * Get IDs of tasks that already have a draft from a specific agent.
 */
async function getAlreadyDraftedTaskIds(agentUserId: string): Promise<string[]> {
  if (!agentUserId) return [];

  // We store agentKey in the analysis JSON, but for now just check by type
  const drafts = await prisma.agentDraft.findMany({
    where: {
      type: "BID",
      rejected: false,
    },
    select: { taskId: true },
  });
  return drafts.map((d) => d.taskId);
}

/**
 * Get accepted orders assigned to a specific agent that need execution.
 */
export async function getAgentAcceptedOrders(agent: AgentProfile) {
  if (!agent.userId) return [];

  return prisma.order.findMany({
    where: {
      workerId: agent.userId,
      task: {
        status: "IN_PROGRESS",
      },
    },
    include: {
      task: true,
      client: { select: { name: true, email: true } },
    },
  });
}

/**
 * Get orders needing revision for a specific agent.
 */
export async function getOrdersNeedingRevision(agent: AgentProfile) {
  if (!agent.userId) return [];

  return prisma.order.findMany({
    where: {
      workerId: agent.userId,
      task: {
        status: "IN_PROGRESS",
        messages: {
          some: {
            content: { contains: "Revisi Diminta" },
          },
        },
      },
    },
    include: {
      task: {
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 10,
            include: {
              sender: { select: { name: true, role: true } },
            },
          },
        },
      },
    },
  });
}
