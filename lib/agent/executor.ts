// =============================================
// AI Agent Worker — Task Executor (Multi-Agent)
// =============================================

import { callLLM } from "./llm";
import { logAgentActivity } from "./logger";
import type { AgentProfile } from "./config";
import type { TaskResult } from "./types";

/**
 * Execute a task using the specialized agent's system prompt and expertise.
 * Each agent has deeply specialized knowledge for their domain.
 */
export async function executeTask(
  agent: AgentProfile,
  task: {
    id: string;
    title: string;
    category: string;
    description: string;
    attachment?: string | null;
  }
): Promise<{ result: TaskResult; tokens: number; cost: number }> {
  const userPrompt = `Kerjakan tugas berikut dengan lengkap dan detail:

Judul: ${task.title}
Kategori: ${task.category}
Deskripsi / Instruksi:
${task.description}

${task.attachment ? `Lampiran: ${task.attachment}` : ""}

Berikan hasil yang lengkap, siap pakai, dan berkualitas tinggi.
Gunakan format markdown yang rapi.`;

  try {
    const response = await callLLM(agent.systemPrompt, userPrompt, {
      maxTokens: 8192,
      temperature: 0.6,
    });

    // Generate brief summary
    const summaryResponse = await callLLM(
      "Kamu adalah asisten ringkasan. Berikan ringkasan 1-2 kalimat dari hasil kerja berikut.",
      `Ringkas hasil kerja ini dalam 1-2 kalimat:\n\n${response.content.substring(0, 2000)}`,
      { maxTokens: 200, temperature: 0.3 }
    );

    const result: TaskResult = {
      content: response.content,
      summary: summaryResponse.content.trim(),
    };

    const totalTokens = response.totalTokens + summaryResponse.totalTokens;
    const totalCost = response.estimatedCost + summaryResponse.estimatedCost;

    await logAgentActivity({
      taskId: task.id,
      action: "EXECUTE",
      status: "SUCCESS",
      details: `[${agent.key}] Task executed: ${result.summary}`,
      tokens: totalTokens,
      cost: totalCost,
    });

    return { result, tokens: totalTokens, cost: totalCost };
  } catch (error) {
    await logAgentActivity({
      taskId: task.id,
      action: "EXECUTE",
      status: "FAILED",
      details: `[${agent.key}] Error: ${error instanceof Error ? error.message : String(error)}`,
    });
    throw error;
  }
}

/**
 * Handle a revision request using the agent's specialized knowledge.
 */
export async function executeRevision(
  agent: AgentProfile,
  params: {
    taskId: string;
    title: string;
    category: string;
    description: string;
    originalContent: string;
    revisionNote: string;
  }
): Promise<{ result: TaskResult; tokens: number; cost: number }> {
  const userPrompt = `Kamu sebelumnya telah mengerjakan tugas ini dan client meminta revisi.

Tugas Original:
Judul: ${params.title}
Deskripsi: ${params.description}

Hasil kerja sebelumnya:
${params.originalContent.substring(0, 4000)}

Catatan revisi dari client:
${params.revisionNote}

Perbaiki hasil kerja sesuai permintaan revisi. Berikan hasil yang sudah direvisi secara lengkap.`;

  try {
    const response = await callLLM(agent.systemPrompt, userPrompt, {
      maxTokens: 8192,
      temperature: 0.5,
    });

    const result: TaskResult = {
      content: response.content,
      summary: `Revisi: ${params.revisionNote.substring(0, 100)}`,
    };

    await logAgentActivity({
      taskId: params.taskId,
      action: "REVISE",
      status: "SUCCESS",
      details: `[${agent.key}] Revision completed`,
      tokens: response.totalTokens,
      cost: response.estimatedCost,
    });

    return { result, tokens: response.totalTokens, cost: response.estimatedCost };
  } catch (error) {
    await logAgentActivity({
      taskId: params.taskId,
      action: "REVISE",
      status: "FAILED",
      details: `[${agent.key}] Revision error: ${error instanceof Error ? error.message : String(error)}`,
    });
    throw error;
  }
}
