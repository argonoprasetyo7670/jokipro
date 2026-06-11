import { prisma } from "@/lib/prisma";

export async function getClientById(id: string) {
  const client = await prisma.user.findUnique({
    where: { id },
    include: {
      postedTasks: {
        where: {
          status: "COMPLETED"
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          order: {
            include: {
              worker: true
            }
          }
        }
      },
      _count: {
        select: {
          postedTasks: true,
          clientOrders: {
            where: {
              status: { in: ["RELEASED"] }
            }
          }
        }
      }
    }
  });

  if (!client || client.role !== "CLIENT") return null;

  // Calculate join date
  const joinDate = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(client.createdAt);

  return {
    id: client.id,
    name: client.name || client.email || "Unknown Client",
    email: client.email,
    image: client.image,
    joinDate,
    totalPostedTasks: client._count.postedTasks,
    totalCompletedOrders: client._count.clientOrders,
    location: "Indonesia",
    verified: !!client.emailVerified,
    recentTasks: client.postedTasks.map((t) => ({
      id: t.id,
      title: t.title,
      category: t.category,
      budget: t.budget,
      completedDate: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(t.updatedAt),
      worker: t.order?.worker ? (t.order.worker.name || t.order.worker.email) : "Unknown Worker"
    }))
  };
}
