"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const reviewSchema = z.object({
  orderId: z.string().min(1),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function submitReviewAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Anda harus login");

  const rawData = {
    orderId: formData.get("orderId"),
    rating: formData.get("rating"),
    comment: formData.get("comment") || "",
  };

  const parsed = reviewSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error("Data ulasan tidak valid");
  }

  const { orderId, rating, comment } = parsed.data;

  // Verify order and get users
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { task: true },
  });

  if (!order) throw new Error("Pesanan tidak ditemukan");
  if (order.task.status !== "COMPLETED") throw new Error("Tugas belum selesai");

  const isClient = order.clientId === session.user.id;
  const isWorker = order.workerId === session.user.id;

  if (!isClient && !isWorker) {
    throw new Error("Anda tidak memiliki akses untuk memberikan ulasan pada pesanan ini");
  }

  const revieweeId = isClient ? order.workerId : order.clientId;
  const reviewerRole = isClient ? "CLIENT" : "WORKER";
  const revieweeRole = isClient ? "WORKER" : "CLIENT";

  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: {
      taskId_reviewerId: {
        taskId: order.taskId,
        reviewerId: session.user.id,
      },
    },
  });

  if (existingReview) {
    throw new Error("Anda sudah memberikan ulasan untuk tugas ini");
  }

  await prisma.$transaction(async (tx) => {
    // 1. Create the review
    await tx.review.create({
      data: {
        taskId: order.taskId,
        reviewerId: session.user.id,
        revieweeId: revieweeId,
        rating: rating,
        comment: comment,
      },
    });

    // 2. Send notification to the reviewee
    await tx.notification.create({
      data: {
        userId: revieweeId,
        title: "Ulasan Baru Diterima 🌟",
        message: `${session.user.name || "Seseorang"} memberikan rating ${rating} bintang untuk tugas "${order.task.title}".`,
        link: `/dashboard/orders/${orderId}`,
      },
    });

    // 3. Recalculate average rating for the reviewee
    const allReviews = await tx.review.findMany({
      where: { revieweeId: revieweeId },
      select: { rating: true },
    });

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

    if (revieweeRole === "WORKER") {
      await tx.workerProfile.updateMany({
        where: { userId: revieweeId },
        data: { rating: averageRating },
      });
    } else {
      await tx.clientProfile.updateMany({
        where: { userId: revieweeId },
        data: { rating: averageRating },
      });
    }
  });

  revalidatePath(`/dashboard/orders/${orderId}`);
  
  if (revieweeRole === "WORKER") {
    revalidatePath(`/profile/${revieweeId}`);
  }
  
  return { success: true };
}
