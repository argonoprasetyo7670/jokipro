// =============================================
// AI Agent Worker — Server Actions (Multi-Agent)
// =============================================

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { agents, agentGlobalConfig } from "@/lib/agent/config";

/**
 * Get all pending agent drafts for admin review.
 */
export async function getAgentDrafts() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.agentDraft.findMany({
    where: { approved: false, rejected: false },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Approve an agent draft (bid or result) and execute the action.
 */
export async function approveAgentDraft(draftId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const draft = await prisma.agentDraft.findUnique({ where: { id: draftId } });
  if (!draft) throw new Error("Draft tidak ditemukan");
  if (draft.approved || draft.rejected) throw new Error("Draft sudah di-review");

  const analysis = draft.analysis as any;
  const agentKey = analysis?.agentKey;
  const agentProfile = agents.find((a) => a.key === agentKey);
  const agentUserId = analysis?.agentUserId ?? agentProfile?.userId;
  const agentName = analysis?.agentName ?? agentProfile?.name ?? "AI Worker";

  if (draft.type === "BID") {
    const task = await prisma.task.findUnique({
      where: { id: draft.taskId },
      select: { clientId: true, status: true, title: true },
    });

    if (!task || task.status !== "OPEN") {
      throw new Error("Tugas sudah tidak tersedia");
    }

    if (!agentUserId) throw new Error("Agent user ID tidak ditemukan di draft");

    await prisma.$transaction(async (tx) => {
      await tx.bid.create({
        data: {
          taskId: draft.taskId,
          workerId: agentUserId,
          amount: analysis?.suggestedPrice ?? 75_000,
          estimatedDays: analysis?.estimatedDays ?? 3,
          coverLetter: draft.content,
          status: "PENDING",
        },
      });

      await tx.agentDraft.update({
        where: { id: draftId },
        data: { approved: true, reviewedBy: session.user.id },
      });

      const formattedPrice = new Intl.NumberFormat("id-ID").format(analysis?.suggestedPrice ?? 75_000);
      await tx.notification.create({
        data: {
          userId: task.clientId,
          title: "Penawaran Baru Diterima",
          message: `${agentName} mengajukan penawaran Rp ${formattedPrice} untuk tugas "${task.title}".`,
          link: `/dashboard/tasks/${draft.taskId}#bids`,
        },
      });
    });
  } else if (draft.type === "RESULT") {
    if (!draft.orderId) throw new Error("Order ID tidak ditemukan di draft");
    if (!agentUserId) throw new Error("Agent user ID tidak ditemukan di draft");

    const order = await prisma.order.findUnique({
      where: { id: draft.orderId },
      include: { task: true },
    });

    if (!order) throw new Error("Order tidak ditemukan");
    if (order.task.status !== "IN_PROGRESS") throw new Error("Tugas tidak dalam status pengerjaan");

    await prisma.$transaction(async (tx) => {
      await tx.message.create({
        data: { taskId: order.taskId, senderId: agentUserId, content: draft.content },
      });
      await tx.message.create({
        data: { taskId: order.taskId, senderId: agentUserId, content: "📦 Saya telah menyelesaikan pekerjaan ini. Silakan periksa hasilnya." },
      });
      await tx.task.update({
        where: { id: order.taskId },
        data: { status: "IN_REVIEW" },
      });
      await tx.agentDraft.update({
        where: { id: draftId },
        data: { approved: true, reviewedBy: session.user.id },
      });
      await tx.notification.create({
        data: {
          userId: order.clientId,
          title: "Hasil Kerja Dikirim 📦",
          message: `${agentName} telah mengirimkan hasil untuk tugas "${order.task.title}".`,
          link: `/dashboard/orders/${order.id}`,
        },
      });
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/orders");
  return { success: true };
}

/**
 * Reject an agent draft with a note.
 */
export async function rejectAgentDraft(draftId: string, note: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.agentDraft.update({
    where: { id: draftId },
    data: { rejected: true, reviewedBy: session.user.id, reviewNote: note },
  });

  revalidatePath("/dashboard");
  return { success: true };
}
