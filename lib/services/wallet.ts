import { prisma } from "@/lib/prisma";

export interface WalletTransaction {
  id: string;
  taskTitle: string;
  taskId: string;
  orderId: string;
  otherPartyName: string;
  otherPartyImage: string | null;
  amount: number;
  platformFee: number;
  netAmount: number;
  paymentStatus: string;
  taskStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletSummary {
  totalAmount: number;
  totalPlatformFee: number;
  totalNet: number;
  completedCount: number;
  pendingCount: number;
  escrowCount: number;
}

export interface WalletData {
  summary: WalletSummary;
  transactions: WalletTransaction[];
  role: "CLIENT" | "WORKER";
}

export async function getWalletData(userId: string, role: string): Promise<WalletData> {
  const isClient = role === "CLIENT";

  const orders = await prisma.order.findMany({
    where: isClient ? { clientId: userId } : { workerId: userId },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
      client: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      worker: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Build transactions
  const transactions: WalletTransaction[] = orders.map((order) => {
    const otherParty = isClient ? order.worker : order.client;
    const netAmount = isClient ? order.amount : order.amount - order.platformFee;

    return {
      id: order.id,
      taskTitle: order.task.title,
      taskId: order.task.id,
      orderId: order.id,
      otherPartyName: otherParty.name || otherParty.email,
      otherPartyImage: otherParty.image,
      amount: order.amount,
      platformFee: order.platformFee,
      netAmount,
      paymentStatus: order.status,
      taskStatus: order.task.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  });

  // Calculate summary
  const completedOrders = orders.filter((o) => o.status === "RELEASED");
  const pendingOrders = orders.filter((o) => o.status === "PENDING_PAYMENT");
  const escrowOrders = orders.filter((o) => o.status === "ESCROW_HOLD");

  const totalAmount = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalPlatformFee = orders.reduce((sum, o) => sum + o.platformFee, 0);
  const totalNet = isClient
    ? totalAmount
    : completedOrders.reduce((sum, o) => sum + (o.amount - o.platformFee), 0);

  return {
    summary: {
      totalAmount,
      totalPlatformFee,
      totalNet,
      completedCount: completedOrders.length,
      pendingCount: pendingOrders.length,
      escrowCount: escrowOrders.length,
    },
    transactions,
    role: isClient ? "CLIENT" : "WORKER",
  };
}
