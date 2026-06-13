// =============================================
// AI Agent Worker — API Route: Agent Status
// =============================================

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAgentStats, getRecentAgentLogs } from "@/lib/agent/logger";
import { prisma } from "@/lib/prisma";
import { agents, agentGlobalConfig } from "@/lib/agent/config";

/**
 * GET /api/agent/status
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [stats, recentLogs, pendingDrafts] = await Promise.all([
      getAgentStats(),
      getRecentAgentLogs(20),
      prisma.agentDraft.count({ where: { approved: false, rejected: false } }),
    ]);

    return NextResponse.json({
      success: true,
      agents: agents.map((a) => ({
        key: a.key,
        name: a.name,
        specializations: a.specializations,
        pricing: a.pricing,
      })),
      globalConfig: {
        maxConcurrentTasksPerAgent: agentGlobalConfig.maxConcurrentTasksPerAgent,
        autoBid: agentGlobalConfig.autoBid,
        autoSubmit: agentGlobalConfig.autoSubmit,
        autoRevise: agentGlobalConfig.autoRevise,
        llmModel: agentGlobalConfig.llm.model,
      },
      stats,
      pendingDrafts,
      recentLogs,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get agent status" }, { status: 500 });
  }
}
