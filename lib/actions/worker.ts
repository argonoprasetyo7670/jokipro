"use server";

import { prisma } from "@/lib/prisma";

export async function submitWorkerProfile(userId: string, data: {
  bio: string;
  university: string;
  major: string;
  educationLevel: string;
  graduationYear: number | null;
  cvUrl: string;
  portfolioUrl: string;
  skills: string[];
}) {
  const profile = await prisma.workerProfile.upsert({
    where: { userId },
    update: {
      ...data,
      kycStatus: "PENDING",
      rejectionNote: null,
    },
    create: {
      userId,
      ...data,
      kycStatus: "PENDING",
    },
  });

  return profile;
}

export async function approveWorker(profileId: string) {
  const profile = await prisma.workerProfile.update({
    where: { id: profileId },
    data: {
      kycStatus: "APPROVED",
      verifiedAt: new Date(),
      rejectionNote: null,
    },
  });
  return profile;
}

export async function rejectWorker(profileId: string, reason: string) {
  const profile = await prisma.workerProfile.update({
    where: { id: profileId },
    data: {
      kycStatus: "REJECTED",
      rejectionNote: reason,
      verifiedAt: null,
    },
  });
  return profile;
}

export async function getPendingWorkers() {
  return prisma.workerProfile.findMany({
    where: { kycStatus: "PENDING" },
    include: { user: { select: { name: true, email: true, image: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllWorkers() {
  return prisma.workerProfile.findMany({
    include: { user: { select: { name: true, email: true, image: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWorkerProfile(userId: string) {
  return prisma.workerProfile.findUnique({
    where: { userId },
    include: { user: { select: { name: true, email: true } } },
  });
}
