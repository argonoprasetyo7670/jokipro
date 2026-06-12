"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Send a message in an order workspace
 */
export async function sendMessageAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Anda harus login");

  const orderId = formData.get("orderId") as string;
  const content = formData.get("content") as string;

  if (!orderId || !content?.trim()) {
    throw new Error("Pesan tidak boleh kosong");
  }

  // Verify user is part of this order
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { 
      clientId: true, 
      workerId: true, 
      taskId: true,
      task: { select: { title: true } }
    },
  });

  if (!order) throw new Error("Pesanan tidak ditemukan");
  if (order.clientId !== session.user.id && order.workerId !== session.user.id) {
    throw new Error("Anda tidak memiliki akses ke pesanan ini");
  }

  // Handle optional file attachment
  let attachmentUrl = null;
  const file = formData.get("attachment") as File | null;
  if (file && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) throw new Error("Ukuran file maksimal 10MB");
    try {
      const { uploadFileToMinio } = await import("@/lib/s3");
      attachmentUrl = await uploadFileToMinio(file, "messages");
    } catch (err) {
      console.error("Gagal upload file pesan:", err);
      throw new Error("Gagal mengunggah file");
    }
  }

  await prisma.$transaction(async (tx) => {
    // 1. Simpan pesan
    await tx.message.create({
      data: {
        taskId: order.taskId,
        senderId: session.user.id,
        content: content.trim(),
        attachment: attachmentUrl,
      },
    });

    // 2. Kirim Notifikasi ke penerima pesan
    const recipientId = session.user.id === order.clientId ? order.workerId : order.clientId;
    
    // Potong konten pesan jika terlalu panjang untuk notifikasi
    const shortContent = content.trim().length > 50 
      ? content.trim().substring(0, 50) + "..." 
      : content.trim();

    await tx.notification.create({
      data: {
        userId: recipientId,
        title: `Pesan Baru: ${order.task.title}`,
        message: `${session.user.name || "Seseorang"} berkata: "${shortContent}"${attachmentUrl ? " (Mengirimkan lampiran)" : ""}`,
        link: `/dashboard/orders/${orderId}`,
      }
    });
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  return { success: true };
}

/**
 * Worker submits their work (IN_PROGRESS → IN_REVIEW)
 */
export async function submitWorkAction(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Anda harus login");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { task: true },
  });

  if (!order) throw new Error("Pesanan tidak ditemukan");
  if (order.workerId !== session.user.id) throw new Error("Hanya Worker yang dapat submit hasil");
  if (order.task.status !== "IN_PROGRESS") throw new Error("Tugas tidak dalam status pengerjaan");

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: order.taskId },
      data: { status: "IN_REVIEW" },
    });

    await tx.notification.create({
      data: {
        userId: order.clientId,
        title: "Hasil Kerja Dikirim 📦",
        message: `Worker telah mengirimkan hasil untuk tugas "${order.task.title}". Silakan periksa dan berikan tanggapan.`,
        link: `/dashboard/orders/${orderId}`,
      },
    });

    // Auto-post system message
    await tx.message.create({
      data: {
        taskId: order.taskId,
        senderId: session.user.id,
        content: "📦 Saya telah menyelesaikan pekerjaan ini. Silakan periksa hasilnya.",
      },
    });
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/dashboard/orders");
  return { success: true };
}

/**
 * Client accepts the result (IN_REVIEW → COMPLETED, payment RELEASED)
 */
export async function acceptResultAction(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Anda harus login");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { task: true },
  });

  if (!order) throw new Error("Pesanan tidak ditemukan");
  if (order.clientId !== session.user.id) throw new Error("Hanya Client yang dapat menerima hasil");
  if (order.task.status !== "IN_REVIEW") throw new Error("Tugas tidak dalam status review");

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: order.taskId },
      data: { status: "COMPLETED" },
    });

    await tx.order.update({
      where: { id: orderId },
      data: { status: "RELEASED" },
    });

    await tx.notification.create({
      data: {
        userId: order.workerId,
        title: "Tugas Selesai! 🎉",
        message: `Client telah menerima hasil kerja Anda untuk "${order.task.title}". Dana akan segera dicairkan.`,
        link: `/dashboard/orders/${orderId}`,
      },
    });

    await tx.message.create({
      data: {
        taskId: order.taskId,
        senderId: session.user.id,
        content: "✅ Hasil kerja telah diterima. Tugas selesai! Terima kasih.",
      },
    });
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/dashboard/orders");
  return { success: true };
}

/**
 * Client requests a revision (IN_REVIEW → IN_PROGRESS)
 */
export async function requestRevisionAction(orderId: string, note: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Anda harus login");
  if (!note?.trim()) throw new Error("Catatan revisi wajib diisi");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { task: true },
  });

  if (!order) throw new Error("Pesanan tidak ditemukan");
  if (order.clientId !== session.user.id) throw new Error("Hanya Client yang dapat meminta revisi");
  if (order.task.status !== "IN_REVIEW") throw new Error("Tugas tidak dalam status review");

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: order.taskId },
      data: { status: "IN_PROGRESS" },
    });

    await tx.notification.create({
      data: {
        userId: order.workerId,
        title: "Revisi Diminta 🔄",
        message: `Client meminta revisi untuk tugas "${order.task.title}": ${note}`,
        link: `/dashboard/orders/${orderId}`,
      },
    });

    await tx.message.create({
      data: {
        taskId: order.taskId,
        senderId: session.user.id,
        content: `🔄 **Revisi Diminta:**\n${note.trim()}`,
      },
    });
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/dashboard/orders");
  return { success: true };
}
