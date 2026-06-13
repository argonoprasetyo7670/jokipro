import { prisma } from "@/lib/prisma";
import { formatDateMediumWIB } from "@/lib/utils";

export async function getAdminDashboardData() {
  const [totalUsers, totalOrders, openDisputes, orders] = await Promise.all([
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { amount: true } }),
    prisma.dispute.count({ where: { status: "OPEN" } }),
    prisma.order.aggregate({ _sum: { platformFee: true } }),
  ]);

  const recentDisputes = await prisma.dispute.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      task: true,
      reporter: true,
    },
  });

  // Map to UI format
  const formattedDisputes = recentDisputes.map((d: any) => ({
    id: d.id,
    orderId: d.taskId, // Currently using taskId as order reference
    client: d.reporter.name || d.reporter.email,
    worker: "Unknown", // Would need an order include to get the worker
    issue: d.reason,
    status: d.status,
  }));

  return {
    totalUsers,
    totalTransaction: totalOrders._sum.amount || 0,
    openDisputes,
    platformProfit: orders._sum.platformFee || 0,
    recentDisputes: formattedDisputes,
  };
}

export async function getClientDashboardData(userId: string) {
  const [activeTasksRaw, spentOrdersRaw, inReviewTasksRaw, completedTasksRaw] = await Promise.all([
    prisma.task.findMany({ 
      where: { clientId: userId, status: { in: ["OPEN", "IN_PROGRESS"] } },
      orderBy: { createdAt: "desc" },
      include: { order: { include: { worker: true } } }
    }),
    prisma.order.findMany({ 
      where: { clientId: userId, status: "RELEASED" },
      orderBy: { createdAt: "desc" },
      include: { task: true, worker: true }
    }),
    prisma.task.findMany({ 
      where: { clientId: userId, status: "IN_REVIEW" },
      orderBy: { createdAt: "desc" },
      include: { order: { include: { worker: true } } }
    }),
    prisma.task.findMany({ 
      where: { clientId: userId, status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      include: { order: { include: { worker: true } } }
    }),
  ]);

  const activeTasksCount = activeTasksRaw.length;
  const inReviewTasksCount = inReviewTasksRaw.length;
  const completedTasksCount = completedTasksRaw.length;
  const totalSpentSum = spentOrdersRaw.reduce((sum: number, order: any) => sum + order.amount, 0);

  // Format arrays for UI usage (Pop-ups)
  const formatTask = (t: any) => ({
    id: t.id,
    title: t.title,
    worker: t.order?.worker ? (t.order.worker.name || t.order.worker.email) : "Menunggu Penawaran",
    status: t.status,
    budget: t.budget,
    deadline: formatDateMediumWIB(t.deadline),
  });

  const formatOrder = (o: any) => ({
    id: o.id,
    title: o.task.title,
    worker: o.worker.name || o.worker.email,
    status: o.status,
    budget: o.amount,
    deadline: formatDateMediumWIB(o.createdAt), // Paid date approximation
  });

  const activeTasksList = activeTasksRaw.map(formatTask);
  const inReviewTasksList = inReviewTasksRaw.map(formatTask);
  const completedTasksList = completedTasksRaw.map(formatTask);
  const spentOrdersList = spentOrdersRaw.map(formatOrder);

  const recentTasks = await prisma.task.findMany({
    where: { clientId: userId },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        include: { worker: true }
      }
    },
  });

  const formattedOrders = recentTasks.map((t: any) => ({
    id: t.id,
    title: t.title,
    worker: t.order?.worker ? (t.order.worker.name || t.order.worker.email) : "Menunggu Penawaran",
    status: t.status,
    budget: t.budget,
    deadline: formatDateMediumWIB(t.deadline),
  }));

  return {
    activeTasks: activeTasksCount,
    totalSpent: totalSpentSum,
    inReviewTasks: inReviewTasksCount,
    completedTasks: completedTasksCount,
    recentOrders: formattedOrders,
    
    // Detailed Lists for Popups
    activeTasksList,
    spentOrdersList,
    inReviewTasksList,
    completedTasksList,
  };
}

export async function getWorkerDashboardData(userId: string) {
  const [activeOrders, totalIncome, workerProfile, completedOrders] = await Promise.all([
    prisma.order.count({ where: { workerId: userId, task: { status: { in: ["IN_PROGRESS", "IN_REVIEW"] } } } }),
    prisma.order.findMany({ where: { workerId: userId, status: "RELEASED" }, select: { amount: true, platformFee: true } }),
    prisma.workerProfile.findUnique({ where: { userId } }),
    prisma.order.count({ where: { workerId: userId, task: { status: "COMPLETED" } } }),
  ]);

  const incomeSum = totalIncome.reduce((acc: number, order: any) => acc + (order.amount - order.platformFee), 0);
  const rating = workerProfile?.rating || 0.0;

  const recentOrders = await prisma.order.findMany({
    where: { workerId: userId },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      task: true,
      client: true,
    },
  });

  const formattedOrders = recentOrders.map((o: any) => ({
    id: o.id,
    title: o.task.title,
    client: o.client.name || o.client.email,
    status: o.task.status,
    budget: o.amount,
    deadline: formatDateMediumWIB(o.task.deadline),
  }));

  return {
    activeOrders,
    totalIncome: incomeSum,
    rating,
    completedOrders,
    recentOrders: formattedOrders,
    kycStatus: workerProfile?.kycStatus || "PENDING",
  };
}
