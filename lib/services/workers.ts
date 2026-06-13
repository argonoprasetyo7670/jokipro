import { prisma } from "@/lib/prisma";

export type FormattedWorker = {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  tasks: number;
  location: string;
  skills: string[];
};

export async function getAvailableWorkers(): Promise<FormattedWorker[]> {
  const workers = await prisma.user.findMany({
    where: { role: "WORKER" },
    include: {
      workerProfile: true,
      _count: {
        select: {
          receivedReviews: true,
          workerOrders: {
            where: {
              status: {
                in: ["RELEASED"] // Assuming released means task completed and paid
              }
            }
          }
        }
      }
    }
  });

  return workers.map((w) => ({
    id: w.id,
    name: w.name || w.email || "Unknown Worker",
    title: w.workerProfile?.bio ? w.workerProfile.bio.substring(0, 30) + "..." : "Profesional Freelancer",
    rating: w.workerProfile?.rating || 0,
    reviews: w._count.receivedReviews,
    tasks: w._count.workerOrders,
    location: "Indonesia", // Schema doesn't have location yet
    skills: w.workerProfile?.skills || [],
  }));
}

export async function getWorkerById(id: string) {
  const worker = await prisma.user.findUnique({
    where: { id },
    include: {
      workerProfile: true,
      receivedReviews: {
        include: {
          reviewer: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      _count: {
        select: {
          receivedReviews: true,
          workerOrders: {
            where: {
              status: { in: ["RELEASED"] }
            }
          }
        }
      }
    }
  });

  if (!worker || worker.role !== "WORKER") return null;

  // Calculate total transactions
  const orders = await prisma.order.findMany({
    where: { workerId: id, status: "RELEASED" },
    select: { amount: true, platformFee: true }
  });
  const earned = orders.reduce((sum, order) => sum + (order.amount - order.platformFee), 0);
  const totalTransaction = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(earned);

  // Calculate join date
  const joinDate = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(worker.createdAt);

  return {
    id: worker.id,
    name: worker.name || worker.email || "Unknown Worker",
    image: worker.image,
    title: worker.workerProfile?.educationLevel ? `${worker.workerProfile.educationLevel} di ${worker.workerProfile.university}` : "Profesional Freelancer",
    rating: worker.workerProfile?.rating || 0,
    reviews: worker._count.receivedReviews,
    tasksCompleted: worker._count.workerOrders,
    totalTransaction,
    location: "Indonesia",
    joinDate,
    responseTime: "< 24 Jam", // Not tracked in DB yet
    verified: worker.workerProfile?.kycStatus === "APPROVED",
    skills: worker.workerProfile?.skills || [],
    bio: worker.workerProfile?.bio || "Pekerja lepas ini belum menuliskan biodata.",
    portfolioUrls: worker.workerProfile?.portfolioUrl ? [worker.workerProfile.portfolioUrl] : [],
    recentReviews: worker.receivedReviews.map(r => ({
      client: r.reviewer.name || r.reviewer.email,
      rating: r.rating,
      date: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(r.createdAt),
      comment: r.comment || "Tidak ada komentar",
    }))
  };
}
