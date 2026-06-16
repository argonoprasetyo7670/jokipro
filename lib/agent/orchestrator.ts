// =============================================
// AI Agent Worker — Multi-Agent Orchestrator
// =============================================

import { prisma } from "@/lib/prisma";
import { agents, agentGlobalConfig, getAgentsForCategory } from "./config";
import type { AgentProfile } from "./config";
import { scanAvailableTasks, getAgentAcceptedOrders, getOrdersNeedingRevision } from "./scanner";
import { analyzeTask } from "./analyzer";
import { generateAndSubmitBid } from "./bidder";
import { executeTask, executeRevision } from "./executor";
import type { AgentCycleResult } from "./types";

/**
 * Ensure an agent user exists in the database.
 * Creates the Worker account + profile if not found.
 */
async function ensureAgentUser(agent: AgentProfile): Promise<string> {
  if (agent.userId) return agent.userId;

  let user = await prisma.user.findUnique({
    where: { email: agent.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: agent.email,
        name: agent.name,
        role: "WORKER",
        passwordHash: "AGENT_NO_LOGIN",
      },
    });

    await prisma.workerProfile.create({
      data: {
        userId: user.id,
        bio: agent.bio,
        skills: agent.skills,
        university: agent.university,
        major: agent.major,
        educationLevel: agent.educationLevel,
        graduationYear: agent.graduationYear,
        kycStatus: "APPROVED",
        verifiedAt: new Date(),
      },
    });

    console.log(`🤖 [${agent.key}] Created agent user: ${agent.name} (${user.id})`);
  }

  agent.userId = user.id;
  return user.id;
}

// =============================================
// EVENT-DRIVEN: Run agents for a specific task
// =============================================

/**
 * Run agents ONLY for a specific newly created task.
 * Called automatically when a client creates a new task.
 * 
 * Flow: Find matching agents → analyze → bid (no execute/revise)
 */
export async function runAgentForTask(taskId: string): Promise<{
  agents: Record<string, AgentCycleResult>;
  summary: AgentCycleResult;
}> {
  // Fetch the specific task
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      client: { select: { name: true, email: true } },
      _count: { select: { bids: true } },
    },
  });

  if (!task || task.status !== "OPEN") {
    console.log(`🤖 Task ${taskId} not found or not OPEN, skipping agent cycle.`);
    return {
      agents: {},
      summary: { scanned: 0, analyzed: 0, bidded: 0, executed: 0, skipped: 0, errors: [] },
    };
  }

  // Find agents that can handle this task's category
  const matchingAgents = getAgentsForCategory(task.category);

  if (matchingAgents.length === 0) {
    console.log(`🤖 No agents available for category: ${task.category}`);
    return {
      agents: {},
      summary: { scanned: 1, analyzed: 0, bidded: 0, executed: 0, skipped: 1, errors: [] },
    };
  }

  console.log(`🤖 Task "${task.title}" (${task.category}) → ${matchingAgents.length} matching agent(s)`);

  // Ensure agent users exist
  await Promise.all(matchingAgents.map((a) => ensureAgentUser(a)));

  // Run matching agents in parallel — each only processes THIS task
  const results = await Promise.allSettled(
    matchingAgents.map(async (agent) => ({
      key: agent.key,
      result: await runSingleAgentForTask(agent, task),
    }))
  );

  // Aggregate results
  const agentResults: Record<string, AgentCycleResult> = {};
  const summary: AgentCycleResult = {
    scanned: 0, analyzed: 0, bidded: 0, executed: 0, skipped: 0, errors: [],
  };

  for (const r of results) {
    if (r.status === "fulfilled") {
      agentResults[r.value.key] = r.value.result;
      summary.scanned += r.value.result.scanned;
      summary.analyzed += r.value.result.analyzed;
      summary.bidded += r.value.result.bidded;
      summary.executed += r.value.result.executed;
      summary.skipped += r.value.result.skipped;
      summary.errors.push(...r.value.result.errors);
    } else {
      summary.errors.push(`Agent failed: ${r.reason}`);
    }
  }

  console.log(`🤖 Task "${task.title}" done — Bid: ${summary.bidded}, Skip: ${summary.skipped}`);
  return { agents: agentResults, summary };
}

/**
 * Run a single agent's analyze → bid cycle for ONE specific task.
 */
async function runSingleAgentForTask(
  agent: AgentProfile,
  task: {
    id: string;
    title: string;
    category: string;
    description: string;
    budget: number;
    deadline: Date;
    clientId: string;
    attachment?: string | null;
  }
): Promise<AgentCycleResult> {
  const result: AgentCycleResult = {
    scanned: 1,
    analyzed: 0,
    bidded: 0,
    executed: 0,
    skipped: 0,
    errors: [],
  };

  try {
    // Check if agent already bid on this task
    const existingBid = await prisma.bid.findFirst({
      where: { taskId: task.id, workerId: agent.userId },
    });
    if (existingBid) {
      console.log(`   ⏭️ [${agent.key}] Already bid on "${task.title}"`);
      result.skipped = 1;
      return result;
    }

    // Check concurrent limit
    const currentOrders = await prisma.order.count({
      where: {
        workerId: agent.userId,
        task: { status: { in: ["IN_PROGRESS", "IN_REVIEW"] } },
      },
    });
    if (currentOrders >= agentGlobalConfig.maxConcurrentTasksPerAgent) {
      console.log(`   ⚠️ [${agent.key}] Concurrent limit reached (${agentGlobalConfig.maxConcurrentTasksPerAgent})`);
      result.skipped = 1;
      return result;
    }

    // Analyze the task
    const { analysis } = await analyzeTask(agent, task);
    result.analyzed = 1;

    if (!analysis.canHandle) {
      console.log(`   ⏭️ [${agent.key}] Skip: "${task.title}" — ${analysis.reason}`);
      result.skipped = 1;
      return result;
    }

    // Generate and submit bid
    await generateAndSubmitBid(agent, task, analysis);
    result.bidded = 1;
    console.log(`   ✅ [${agent.key}] Bid: "${task.title}" — Rp ${new Intl.NumberFormat("id-ID").format(analysis.suggestedPrice)}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    result.errors.push(`[${agent.key}] Task ${task.id}: ${msg}`);
    console.error(`   ❌ [${agent.key}] Error: "${task.title}" — ${msg}`);
  }

  return result;
}

// =============================================
// ADMIN MANUAL: Full cycle for all agents
// =============================================

/**
 * Run ALL agents' complete cycle (admin manual trigger only).
 * Scans all open tasks, executes accepted orders, handles revisions.
 */
export async function runAgentCycle(): Promise<{
  agents: Record<string, AgentCycleResult>;
  summary: AgentCycleResult;
}> {
  console.log("=".repeat(60));
  console.log("🤖 Multi-Agent Full Cycle (Admin Manual)...");
  console.log(`   Agents: ${agents.map((a) => `${a.name} (${a.key})`).join(", ")}`);
  console.log("=".repeat(60));

  // Ensure all agent users exist
  await Promise.all(agents.map((a) => ensureAgentUser(a)));

  // Run all agents in parallel
  const results = await Promise.allSettled(
    agents.map(async (agent) => ({
      key: agent.key,
      result: await runFullAgentCycle(agent),
    }))
  );

  // Aggregate results
  const agentResults: Record<string, AgentCycleResult> = {};
  const summary: AgentCycleResult = {
    scanned: 0, analyzed: 0, bidded: 0, executed: 0, skipped: 0, errors: [],
  };

  for (const r of results) {
    if (r.status === "fulfilled") {
      agentResults[r.value.key] = r.value.result;
      summary.scanned += r.value.result.scanned;
      summary.analyzed += r.value.result.analyzed;
      summary.bidded += r.value.result.bidded;
      summary.executed += r.value.result.executed;
      summary.skipped += r.value.result.skipped;
      summary.errors.push(...r.value.result.errors);
    } else {
      summary.errors.push(`Agent failed: ${r.reason}`);
    }
  }

  console.log("=".repeat(60));
  console.log("🤖 All agents done!", summary);
  console.log("=".repeat(60));

  return { agents: agentResults, summary };
}

/**
 * Run one agent's complete cycle: scan → analyze → bid → execute → revise.
 * Only used for admin manual trigger.
 */
async function runFullAgentCycle(agent: AgentProfile): Promise<AgentCycleResult> {
  const result: AgentCycleResult = {
    scanned: 0,
    analyzed: 0,
    bidded: 0,
    executed: 0,
    skipped: 0,
    errors: [],
  };

  console.log(`\n🤖 [${agent.key}] ${agent.name} starting full cycle...`);
  console.log(`   Spesialisasi: ${agent.specializations.join(", ")}`);

  // =================== PHASE 1: SCAN & BID ===================
  const tasks = await scanAvailableTasks(agent);
  result.scanned = tasks.length;
  console.log(`   📋 Found ${tasks.length} available tasks`);

  // Check concurrent limit
  const currentOrders = await prisma.order.count({
    where: {
      workerId: agent.userId,
      task: { status: { in: ["IN_PROGRESS", "IN_REVIEW"] } },
    },
  });
  const canTakeMore = agentGlobalConfig.maxConcurrentTasksPerAgent - currentOrders;

  for (const task of tasks) {
    if (canTakeMore > 0 && result.bidded >= canTakeMore) {
      console.log(`   ⚠️ Concurrent limit reached (${agentGlobalConfig.maxConcurrentTasksPerAgent})`);
      break;
    }

    try {
      const { analysis } = await analyzeTask(agent, task);
      result.analyzed++;

      if (!analysis.canHandle) {
        console.log(`   ⏭️ Skip: "${task.title}" — ${analysis.reason}`);
        result.skipped++;
        continue;
      }

      await generateAndSubmitBid(agent, { ...task, clientId: task.clientId }, analysis);
      result.bidded++;
      console.log(`   ✅ Bid: "${task.title}" — Rp ${new Intl.NumberFormat("id-ID").format(analysis.suggestedPrice)}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      result.errors.push(`[${agent.key}] Task ${task.id}: ${msg}`);
      console.error(`   ❌ Error: "${task.title}" — ${msg}`);
    }
  }

  // =================== PHASE 2: EXECUTE ===================
  const acceptedOrders = await getAgentAcceptedOrders(agent);
  console.log(`   📦 Found ${acceptedOrders.length} orders to execute`);

  for (const order of acceptedOrders) {
    try {
      const existingDraft = await prisma.agentDraft.findFirst({
        where: { taskId: order.taskId, orderId: order.id, type: "RESULT", rejected: false },
      });
      if (existingDraft) {
        console.log(`   ⏭️ Already drafted: "${order.task.title}"`);
        continue;
      }

      const { result: taskResult } = await executeTask(agent, order.task);

      if (agentGlobalConfig.autoSubmit) {
        await prisma.$transaction(async (tx) => {
          await tx.task.update({ where: { id: order.taskId }, data: { status: "IN_REVIEW" } });
          await tx.message.create({
            data: { taskId: order.taskId, senderId: agent.userId, content: taskResult.content },
          });
          await tx.message.create({
            data: { taskId: order.taskId, senderId: agent.userId, content: "📦 Saya telah menyelesaikan pekerjaan ini. Silakan periksa hasilnya." },
          });
          await tx.notification.create({
            data: {
              userId: order.clientId,
              title: "Hasil Kerja Dikirim 📦",
              message: `${agent.name} telah mengirimkan hasil untuk tugas "${order.task.title}".`,
              link: `/dashboard/orders/${order.id}`,
            },
          });
        });
      } else {
        await prisma.agentDraft.create({
          data: {
            taskId: order.taskId,
            orderId: order.id,
            type: "RESULT",
            content: taskResult.content,
            analysis: { agentKey: agent.key, agentName: agent.name, summary: taskResult.summary },
          },
        });
      }

      result.executed++;
      console.log(`   ✅ Executed: "${order.task.title}"`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      result.errors.push(`[${agent.key}] Order ${order.id}: ${msg}`);
    }
  }

  // =================== PHASE 3: REVISIONS ===================
  if (agentGlobalConfig.autoRevise) {
    const revisionOrders = await getOrdersNeedingRevision(agent);
    for (const order of revisionOrders) {
      try {
        const revisionMessage = order.task.messages.find(
          (m: any) => m.content.includes("Revisi Diminta")
        );
        if (!revisionMessage) continue;

        const previousDraft = await prisma.agentDraft.findFirst({
          where: { taskId: order.taskId, type: "RESULT" },
          orderBy: { createdAt: "desc" },
        });

        const { result: revisedResult } = await executeRevision(agent, {
          taskId: order.taskId,
          title: order.task.title,
          category: order.task.category,
          description: order.task.description,
          originalContent: previousDraft?.content ?? "",
          revisionNote: revisionMessage.content.replace("🔄 **Revisi Diminta:**\n", "").trim(),
        });

        await prisma.agentDraft.create({
          data: {
            taskId: order.taskId,
            orderId: order.id,
            type: "RESULT",
            content: revisedResult.content,
            analysis: { agentKey: agent.key, agentName: agent.name, summary: revisedResult.summary, isRevision: true },
          },
        });

        console.log(`   🔄 Revision: "${order.task.title}"`);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        result.errors.push(`[${agent.key}] Revision: ${msg}`);
      }
    }
  }

  console.log(`🤖 [${agent.key}] Cycle done — Scanned: ${result.scanned}, Bid: ${result.bidded}, Executed: ${result.executed}`);
  return result;
}
