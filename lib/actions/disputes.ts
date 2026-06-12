"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { DisputeStatus, TaskStatus, PaymentStatus } from "@prisma/client";

// --- Create Dispute Action ---

const createDisputeSchema = z.object({
  taskId: z.string().min(1, "ID Tugas tidak valid"),
  reason: z.string().min(10, "Alasan sengketa minimal 10 karakter"),
});

export async function createDisputeAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Anda harus login");

  const parsed = createDisputeSchema.safeParse({
    taskId: formData.get("taskId"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { taskId, reason } = parsed.data;

  // Verify task and order
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { order: true },
  });

  if (!task || !task.order) throw new Error("Tugas atau pesanan tidak ditemukan");

  const order = task.order;
  const isClient = order.clientId === session.user.id;
  const isWorker = order.workerId === session.user.id;

  if (!isClient && !isWorker) {
    throw new Error("Anda tidak memiliki akses ke pesanan ini");
  }

  if (task.status !== TaskStatus.IN_PROGRESS && task.status !== TaskStatus.IN_REVIEW) {
    throw new Error("Sengketa hanya dapat diajukan untuk tugas yang sedang berjalan atau direview");
  }

  const existingDispute = await prisma.dispute.findUnique({
    where: { taskId },
  });

  if (existingDispute) {
    throw new Error("Sengketa sudah pernah diajukan untuk tugas ini");
  }

  await prisma.$transaction(async (tx) => {
    // 1. Create the dispute
    await tx.dispute.create({
      data: {
        taskId: taskId,
        reporterId: session.user.id,
        reason: reason,
        status: DisputeStatus.OPEN,
      },
    });

    // 2. Change Task status to IN_DISPUTE
    await tx.task.update({
      where: { id: taskId },
      data: { status: TaskStatus.IN_DISPUTE },
    });

    // 3. Send notification to the other party
    const opponentId = isClient ? order.workerId : order.clientId;
    await tx.notification.create({
      data: {
        userId: opponentId,
        title: "Sengketa Diajukan 🚨",
        message: `${session.user.name || "Pengguna"} telah mengajukan sengketa untuk tugas "${task.title}". Admin akan segera meninjau kasus ini.`,
        link: `/dashboard/orders/${order.id}`,
      },
    });

    // We might also want to notify all admins here, but for now we rely on the Admin dashboard view.
  });

  revalidatePath(`/dashboard/orders/${order.id}`);
  return { success: true };
}

// --- Resolve Dispute Action (Admin Only) ---

const resolveDisputeSchema = z.object({
  disputeId: z.string().min(1),
  resolution: z.enum(["FAVOR_CLIENT", "FAVOR_WORKER"]),
  adminNotes: z.string().min(1, "Catatan putusan admin wajib diisi"),
});

export async function resolveDisputeAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Hanya Admin yang dapat menyelesaikan sengketa");
  }

  const parsed = resolveDisputeSchema.safeParse({
    disputeId: formData.get("disputeId"),
    resolution: formData.get("resolution"),
    adminNotes: formData.get("adminNotes"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { disputeId, resolution, adminNotes } = parsed.data;

  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: {
      task: { include: { order: true } },
      reporter: true,
    },
  });

  if (!dispute || !dispute.task.order) {
    throw new Error("Data sengketa atau pesanan tidak ditemukan");
  }

  if (dispute.status !== DisputeStatus.OPEN) {
    throw new Error("Sengketa ini sudah pernah diselesaikan");
  }

  const order = dispute.task.order;

  await prisma.$transaction(async (tx) => {
    // 1. Update Dispute
    await tx.dispute.update({
      where: { id: disputeId },
      data: {
        status: resolution === "FAVOR_CLIENT" ? DisputeStatus.RESOLVED_CLIENT : DisputeStatus.RESOLVED_WORKER,
        adminNotes: adminNotes,
      },
    });

    // 2. Update Task and Order Status based on Resolution
    if (resolution === "FAVOR_CLIENT") {
      // Client wins: Task Cancelled, Refund Client (simulate)
      await tx.task.update({
        where: { id: dispute.taskId },
        data: { status: TaskStatus.CANCELLED },
      });
      await tx.order.update({
        where: { id: order.id },
        data: { status: PaymentStatus.REFUNDED },
      });

      // Notify both parties
      await tx.notification.createMany({
        data: [
          {
            userId: order.clientId,
            title: "Sengketa Diselesaikan (Memihak Anda)",
            message: `Admin memutuskan Anda berhak mendapat pengembalian dana untuk tugas "${dispute.task.title}".`,
            link: `/dashboard/orders/${order.id}`,
          },
          {
            userId: order.workerId,
            title: "Sengketa Diselesaikan",
            message: `Admin memutuskan untuk membatalkan pesanan "${dispute.task.title}". Uang dikembalikan ke Client.`,
            link: `/dashboard/orders/${order.id}`,
          }
        ]
      });

    } else {
      // Worker wins: Task Completed, Release funds to Worker
      await tx.task.update({
        where: { id: dispute.taskId },
        data: { status: TaskStatus.COMPLETED },
      });
      await tx.order.update({
        where: { id: order.id },
        data: { status: PaymentStatus.RELEASED },
      });

      // Notify both parties
      await tx.notification.createMany({
        data: [
          {
            userId: order.workerId,
            title: "Sengketa Diselesaikan (Memihak Anda)",
            message: `Admin memutuskan Anda berhak atas dana untuk tugas "${dispute.task.title}". Dana telah dicairkan.`,
            link: `/dashboard/orders/${order.id}`,
          },
          {
            userId: order.clientId,
            title: "Sengketa Diselesaikan",
            message: `Admin memutuskan Worker telah menyelesaikan tugas "${dispute.task.title}". Dana dicairkan ke Worker.`,
            link: `/dashboard/orders/${order.id}`,
          }
        ]
      });
    }
  });

  revalidatePath(`/dashboard/disputes`);
  revalidatePath(`/dashboard/orders/${order.id}`);
  
  return { success: true };
}
