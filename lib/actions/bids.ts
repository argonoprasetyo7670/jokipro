"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const bidSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  amount: z.coerce.number().min(10000, "Harga penawaran minimal Rp 10.000"),
  estimatedDays: z.coerce.number().min(1, "Estimasi waktu minimal 1 hari"),
  coverLetter: z.string().min(10, "Pesan minimal 10 karakter"),
});

export async function createBidAction(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Anda harus login terlebih dahulu");
  }

  if (session.user.role !== "WORKER") {
    throw new Error("Hanya Worker yang dapat mengajukan penawaran");
  }

  // Check if Worker is APPROVED
  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId: session.user.id },
    select: { kycStatus: true }
  });

  if (!workerProfile || workerProfile.kycStatus !== "APPROVED") {
    throw new Error("Akun Anda sedang direview oleh Admin. Anda belum dapat mengirim penawaran.");
  }

  const rawData = {
    taskId: formData.get("taskId"),
    amount: formData.get("amount"),
    estimatedDays: formData.get("estimatedDays"),
    coverLetter: formData.get("coverLetter"),
  };

  const parsed = bidSchema.safeParse(rawData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { taskId, amount, estimatedDays, coverLetter } = parsed.data;

  // Validate task status
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { status: true, clientId: true }
  });

  if (!task) {
    throw new Error("Tugas tidak ditemukan");
  }

  if (task.status !== "OPEN") {
    throw new Error("Maaf, tugas ini sudah tidak menerima penawaran (sudah In Progress atau Selesai)");
  }

  // Prevent bidding on own task (if somehow client is also worker, but roles are strictly separated anyway)
  if (task.clientId === session.user.id) {
    throw new Error("Anda tidak dapat menawar tugas Anda sendiri");
  }

  // Check if worker already placed a bid
  const existingBid = await prisma.bid.findFirst({
    where: {
      taskId,
      workerId: session.user.id
    }
  });

  if (existingBid) {
    throw new Error("Anda sudah mengajukan penawaran untuk tugas ini");
  }

  // Handle Attachment Upload
  let attachmentUrl = null;
  const file = formData.get("attachment") as File | null;
  
  if (file && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error("Ukuran file lampiran maksimal 5MB");
    }
    
    try {
      const { uploadFileToMinio } = await import("@/lib/s3");
      attachmentUrl = await uploadFileToMinio(file, "bids");
    } catch (err) {
      console.error("Gagal mengunggah lampiran bid:", err);
      throw new Error("Gagal mengunggah lampiran. Silakan coba lagi tanpa lampiran atau hubungi admin.");
    }
  }

  // Create the bid
  await prisma.$transaction(async (tx) => {
    await tx.bid.create({
      data: {
        taskId,
        workerId: session.user.id,
        amount,
        estimatedDays,
        coverLetter,
        // @ts-ignore: VSCode TS Server cache issue
        attachment: attachmentUrl,
        status: "PENDING"
      }
    });

    // Send notification to Client
    await tx.notification.create({
      data: {
        userId: task.clientId,
        title: "Penawaran Baru Diterima",
        message: `${session.user.name || "Seorang Worker"} mengajukan penawaran baru sebesar Rp ${new Intl.NumberFormat('id-ID').format(amount)} untuk tugas Anda.`,
        link: `/dashboard/tasks/${taskId}#bids`,
      }
    });
  });

  revalidatePath(`/dashboard/tasks/${taskId}`);
  revalidatePath(`/dashboard/tasks`);
  revalidatePath(`/dashboard/my-tasks`);
  
  return { success: true };
}

export async function acceptBidAction(bidId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Anda harus login terlebih dahulu");
  }

  if (session.user.role !== "CLIENT") {
    throw new Error("Hanya Client yang dapat menyetujui penawaran");
  }

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: { task: true, worker: true }
  });

  if (!bid) {
    throw new Error("Penawaran tidak ditemukan");
  }

  if (bid.task.clientId !== session.user.id) {
    throw new Error("Anda tidak memiliki akses untuk menyetujui penawaran ini");
  }

  if (bid.task.status !== "OPEN") {
    throw new Error("Tugas ini sudah dalam proses pengerjaan atau selesai");
  }

  // Calculate platform fee (e.g. 5%)
  const platformFee = bid.amount * 0.05;

  await prisma.$transaction(async (tx) => {
    // 1. Terima bid yang dipilih
    await tx.bid.update({
      where: { id: bidId },
      data: { status: "ACCEPTED" }
    });

    // 2. Tolak sisa bid lainnya
    await tx.bid.updateMany({
      where: { 
        taskId: bid.taskId,
        id: { not: bidId }
      },
      data: { status: "REJECTED" }
    });

    // 3. Ubah status tugas menjadi IN_PROGRESS
    await tx.task.update({
      where: { id: bid.taskId },
      data: { status: "IN_PROGRESS" }
    });

    // 4. Buat Order baru
    await tx.order.create({
      data: {
        taskId: bid.taskId,
        bidId: bid.id,
        clientId: bid.task.clientId,
        workerId: bid.workerId,
        amount: bid.amount,
        platformFee: platformFee,
        status: "PENDING_PAYMENT"
      }
    });

    // 5. Kirim Notifikasi ke Worker yang Terpilih
    await tx.notification.create({
      data: {
        userId: bid.workerId,
        title: "Penawaran Diterima! 🎉",
        message: `Selamat! Penawaran Anda untuk tugas "${bid.task.title}" telah disetujui. Silakan periksa detail pesanan.`,
        link: `/dashboard/orders`,
      }
    });
  });

  revalidatePath(`/dashboard/tasks/${bid.taskId}`);
  revalidatePath(`/dashboard/orders`);
  revalidatePath(`/dashboard/my-tasks`);

  return { success: true };
}
