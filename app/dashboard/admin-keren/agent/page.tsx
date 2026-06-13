import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAgentStats, getRecentAgentLogs } from "@/lib/agent/logger";
import { agents, agentGlobalConfig } from "@/lib/agent/config";
import { AgentDashboardClient } from "./agent-client";

export const dynamic = "force-dynamic";

export default async function AgentDashboardPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [stats, recentLogs, pendingDrafts, allDrafts] = await Promise.all([
    getAgentStats(),
    getRecentAgentLogs(30),
    prisma.agentDraft.count({ where: { approved: false, rejected: false } }),
    prisma.agentDraft.findMany({
      where: { approved: false, rejected: false },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  // Serialize agents config for client component
  const agentProfiles = agents.map((a) => ({
    key: a.key,
    name: a.name,
    email: a.email,
    bio: a.bio,
    specializations: a.specializations,
    skills: a.skills,
    pricing: a.pricing,
    university: a.university,
    major: a.major,
  }));

  return (
    <AgentDashboardClient
      stats={stats}
      recentLogs={JSON.parse(JSON.stringify(recentLogs))}
      pendingDrafts={pendingDrafts}
      drafts={JSON.parse(JSON.stringify(allDrafts))}
      agentProfiles={agentProfiles}
      globalConfig={{
        maxConcurrentTasksPerAgent: agentGlobalConfig.maxConcurrentTasksPerAgent,
        autoBid: agentGlobalConfig.autoBid,
        autoSubmit: agentGlobalConfig.autoSubmit,
        autoRevise: agentGlobalConfig.autoRevise,
        llmModel: agentGlobalConfig.llm.model,
      }}
    />
  );
}
