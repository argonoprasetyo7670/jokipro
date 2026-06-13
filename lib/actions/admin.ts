"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { createUserSchema, updateUserSchema } from "@/lib/schemas/users";
import { z } from "zod";

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

// ======================= CRUD USER MANAGEMENT =======================

/**
 * Fetch all users for admin management
 */
export async function getAllUsersAction() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const users = await prisma.user.findMany({
    include: {
      workerProfile: {
        select: {
          id: true,
          kycStatus: true,
          university: true,
          major: true,
        },
      },
      clientProfile: {
        select: {
          id: true,
          companyName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
}

/**
 * Create a new user (Admin action)
 */
export async function createUserAction(data: z.infer<typeof createUserSchema>) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const parsed = createUserSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password, role } = parsed.data;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email sudah terdaftar." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
    });

    if (role === "CLIENT") {
      await tx.clientProfile.create({
        data: { userId: user.id },
      });
    } else if (role === "WORKER") {
      await tx.workerProfile.create({
        data: { userId: user.id },
      });
    }
  });

  revalidatePath("/dashboard/users");
  return { success: true };
}

/**
 * Update an existing user (Admin action)
 */
export async function updateUserAction(
  userId: string,
  data: z.infer<typeof updateUserSchema>
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const parsed = updateUserSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, role, phone } = parsed.data;

  // Check if email is taken by another user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser && existingUser.id !== userId) {
    return { error: "Email sudah digunakan oleh pengguna lain." };
  }

  // Fetch current user to check role change
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      workerProfile: true,
      clientProfile: true,
    },
  });

  if (!currentUser) {
    return { error: "Pengguna tidak ditemukan." };
  }

  await prisma.$transaction(async (tx) => {
    // Update user data
    await tx.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role,
        phone: phone || null,
      },
    });

    // Handle role migration if role changed
    if (currentUser.role !== role) {
      // Delete old profile
      if (currentUser.role === "CLIENT" && currentUser.clientProfile) {
        await tx.clientProfile.delete({
          where: { userId },
        });
      } else if (currentUser.role === "WORKER" && currentUser.workerProfile) {
        await tx.workerProfile.delete({
          where: { userId },
        });
      }

      // Create new profile
      if (role === "CLIENT") {
        await tx.clientProfile.upsert({
          where: { userId },
          update: {},
          create: { userId },
        });
      } else if (role === "WORKER") {
        await tx.workerProfile.upsert({
          where: { userId },
          update: {},
          create: { userId },
        });
      }
    }
  });

  revalidatePath("/dashboard/users");
  return { success: true };
}

/**
 * Delete a user (Admin action)
 */
export async function deleteUserAction(userId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Prevent self-deletion
  if (userId === session.user.id) {
    return { error: "Anda tidak dapat menghapus akun Anda sendiri." };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "Pengguna tidak ditemukan." };
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/dashboard/users");
  return { success: true };
}
