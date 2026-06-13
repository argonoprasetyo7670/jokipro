// =============================================
// AI Agent Worker — Bid Generator (Multi-Agent)
// =============================================

import { prisma } from "@/lib/prisma";
import { callLLM } from "./llm";
import { agentGlobalConfig } from "./config";
import type { AgentProfile } from "./config";
import { logAgentActivity } from "./logger";
import type { TaskAnalysis } from "./types";

/**
 * Generate a cover letter and submit a bid using a specific agent's persona.
 */
export async function generateAndSubmitBid(
  agent: AgentProfile,
  task: {
    id: string;
    title: string;
    category: string;
    description: string;
    budget: number;
    deadline: Date;
    clientId: string;
  },
  analysis: TaskAnalysis
) {
  const systemPrompt = `Kamu adalah ${agent.name}, seorang Worker profesional di platform freelance EduTasky.
${agent.bio}

Tugasmu adalah menulis cover letter yang meyakinkan untuk mengajukan penawaran.

Gaya penulisan:
${agent.coverLetterStyle}
- Jangan menyebut bahwa kamu adalah AI
- Singkat tapi meyakinkan (3-5 paragraf)`;

  const userPrompt = `Tulis cover letter untuk tugas berikut:

Judul: ${task.title}
Kategori: ${task.category}
Deskripsi: ${task.description}
Budget Client: Rp ${new Intl.NumberFormat("id-ID").format(task.budget)}

Penawaran saya:
- Harga: Rp ${new Intl.NumberFormat("id-ID").format(analysis.suggestedPrice)}
- Estimasi pengerjaan: ${analysis.estimatedDays} hari
- Pendekatan: ${analysis.approach}

Tulis cover letter saja tanpa header/judul.`;

  try {
    const response = await callLLM(systemPrompt, userPrompt, { temperature: 0.8 });
    const coverLetter = response.content.trim();

    if (agentGlobalConfig.autoBid) {
      // Compute deadline from estimated days
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + analysis.estimatedDays);
      deadline.setHours(23, 59, 0, 0); // End of day

      // Direct bid submission
      await prisma.$transaction(async (tx) => {
        await tx.bid.create({
          data: {
            taskId: task.id,
            workerId: agent.userId,
            amount: analysis.suggestedPrice,
            deadline,
            estimatedDays: analysis.estimatedDays,
            coverLetter,
            status: "PENDING",
          },
        });

        const formattedPrice = new Intl.NumberFormat("id-ID").format(analysis.suggestedPrice);
        await tx.notification.create({
          data: {
            userId: task.clientId,
            title: "Penawaran Baru Diterima",
            message: `${agent.name} mengajukan penawaran Rp ${formattedPrice} untuk tugas "${task.title}".`,
            link: `/dashboard/tasks/${task.id}#bids`,
          },
        });
      });

      await logAgentActivity({
        taskId: task.id,
        action: "BID",
        status: "SUCCESS",
        details: `[${agent.key}] Bid submitted: Rp ${analysis.suggestedPrice}`,
        tokens: response.totalTokens,
        cost: response.estimatedCost,
      });
    } else {
      // Save as draft for admin approval
      await prisma.agentDraft.create({
        data: {
          taskId: task.id,
          type: "BID",
          content: coverLetter,
          analysis: {
            agentKey: agent.key,
            agentName: agent.name,
            agentUserId: agent.userId,
            ...analysis,
          },
        },
      });

      await logAgentActivity({
        taskId: task.id,
        action: "BID",
        status: "SUCCESS",
        details: `[${agent.key}] Bid draft saved: Rp ${analysis.suggestedPrice}`,
        tokens: response.totalTokens,
        cost: response.estimatedCost,
      });
    }

    return { coverLetter, tokens: response.totalTokens, cost: response.estimatedCost };
  } catch (error) {
    await logAgentActivity({
      taskId: task.id,
      action: "BID",
      status: "FAILED",
      details: `[${agent.key}] Bid error: ${error instanceof Error ? error.message : String(error)}`,
    });
    throw error;
  }
}
