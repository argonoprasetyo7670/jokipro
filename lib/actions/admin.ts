"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Fetch pending workers for Admin Verification
 */
export async function getPendingWorkersAction() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const workers = await prisma.workerProfile.findMany({
    where: {
      kycStatus: "PENDING",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return workers;
}

/**
 * Verify a worker (Approve or Reject)
 */
export async function verifyWorkerAction(
  workerProfileId: string,
  status: "APPROVED" | "REJECTED",
  rejectionNote?: string
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (status === "REJECTED" && !rejectionNote) {
    throw new Error("Catatan penolakan wajib diisi jika menolak.");
  }

  await prisma.workerProfile.update({
    where: { id: workerProfileId },
    data: {
      kycStatus: status,
      verifiedAt: new Date(),
      rejectionNote: status === "REJECTED" ? rejectionNote : null,
    },
  });

  revalidatePath("/dashboard/users");
  
  return { success: true };
}
