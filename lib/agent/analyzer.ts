// =============================================
// AI Agent Worker — Task Analyzer (Multi-Agent)
// =============================================

import { callLLMJson } from "./llm";
import { logAgentActivity } from "./logger";
import type { AgentProfile } from "./config";
import type { TaskAnalysis } from "./types";

/**
 * Analyze a task using a specific agent's expertise.
 * The agent's system prompt defines what it can/cannot do.
 */
export async function analyzeTask(
  agent: AgentProfile,
  task: {
    id: string;
    title: string;
    category: string;
    description: string;
    budget: number;
    deadline: Date;
  }
): Promise<{ analysis: TaskAnalysis; tokens: number; cost: number }> {
  const daysUntilDeadline = Math.max(
    1,
    Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  const systemPrompt = `Kamu adalah ${agent.name}, seorang profesional di bidang ${agent.specializations.join(", ")}.
${agent.bio}

Tugasmu adalah menganalisis apakah kamu bisa mengerjakan tugas yang diberikan.

Kamu HANYA bisa mengerjakan tugas di bidang: ${agent.specializations.join(", ")}.
Kamu TIDAK bisa mengerjakan tugas di luar spesialisasimu.

Berikan analisis dalam format JSON.`;

  const userPrompt = `Analisis tugas berikut:

Judul: ${task.title}
Kategori: ${task.category}
Deskripsi: ${task.description}
Budget Client: Rp ${new Intl.NumberFormat("id-ID").format(task.budget)}
Deadline: ${daysUntilDeadline} hari dari sekarang

Berikan response JSON dengan format:
{
  "canHandle": true/false,
  "difficulty": "easy" | "medium" | "hard",
  "estimatedDays": number,
  "suggestedPrice": number (dalam Rupiah, harus <= budget client),
  "reason": "alasan singkat",
  "approach": "pendekatan pengerjaan jika canHandle=true"
}`;

  try {
    const { data, tokens, cost } = await callLLMJson<TaskAnalysis>(
      systemPrompt,
      userPrompt,
      { temperature: 0.3 }
    );

    // Override with fixed pricing from agent config
    const fixedPrice = agent.pricing[task.category] ?? agent.defaultPrice;
    const finalPrice = Math.min(fixedPrice, task.budget);
    const configDays = agent.estimatedDays[task.category] ?? agent.defaultEstimatedDays;
    const canMeetDeadline = daysUntilDeadline >= configDays;

    const analysis: TaskAnalysis = {
      ...data,
      suggestedPrice: finalPrice,
      estimatedDays: configDays,
      canHandle: data.canHandle && canMeetDeadline,
      reason: !canMeetDeadline
        ? `Deadline terlalu dekat (${daysUntilDeadline} hari, butuh ${configDays} hari)`
        : data.reason,
    };

    await logAgentActivity({
      taskId: task.id,
      action: "ANALYZE",
      status: analysis.canHandle ? "SUCCESS" : "SKIPPED",
      details: `[${agent.key}] ${analysis.canHandle ? "Can handle" : "Skip"}: ${analysis.reason}`,
      tokens,
      cost,
    });

    return { analysis, tokens, cost };
  } catch (error) {
    await logAgentActivity({
      taskId: task.id,
      action: "ANALYZE",
      status: "FAILED",
      details: `[${agent.key}] Analysis error: ${error instanceof Error ? error.message : String(error)}`,
    });
    throw error;
  }
}
