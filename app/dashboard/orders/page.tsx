import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  IconClock,
  IconCheck,
  IconAlertTriangle,
  IconStarFilled,
  IconMessageCircle,
  IconEye,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { UserAvatar } from "@/components/user-avatar";
import { PageTransition, AnimatedCard } from "@/components/motion";

const tabOptions = [
  { label: "Semua", value: "ALL" },
  { label: "Dikerjakan", value: "IN_PROGRESS" },
  { label: "Review", value: "IN_REVIEW" },
  { label: "Selesai", value: "COMPLETED" },
  { label: "Sengketa", value: "IN_DISPUTE" },
];

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default async function OrdersPage(props: { searchParams?: Promise<{ status?: string }> | { status?: string } }) {
  // In Next.js 15+, searchParams is a Promise. We await it to be safe.
  const sp = props.searchParams ? await props.searchParams : {};
  const statusFilter = sp?.status as string | undefined;

  const session = await auth();
  
  if (!session?.user?.id) {
    return <div>Harap login terlebih dahulu</div>;
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Build the where clause
  const whereClause: any = userRole === "CLIENT" ? { clientId: userId } : { workerId: userId };
  if (statusFilter && statusFilter !== "ALL") {
    whereClause.task = { status: statusFilter };
  }

  // Ambil data pesanan dari database sesuai role dan filter
  const dbOrders = await prisma.order.findMany({
    where: whereClause,
    include: {
      task: true,
      worker: true,
      client: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageTransition className="space-y-6">
      <AnimatedCard>
        <PageHeader
          title="Pesanan Saya"
          description="Pantau semua tugas yang sedang berjalan dan yang sudah selesai."
        />
      </AnimatedCard>

      {/* Tabs */}
      <AnimatedCard className="flex gap-2 overflow-x-auto pb-2">
        {tabOptions.map((tab) => {
          const isActive = statusFilter ? statusFilter === tab.value : tab.value === "ALL";
          return (
            <Button
              key={tab.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={`flex-shrink-0 rounded-full ${isActive ? "shadow-lg shadow-primary/25" : ""}`}
              asChild
            >
              <Link href={tab.value === "ALL" ? "/dashboard/orders" : `/dashboard/orders?status=${tab.value}`}>
                {tab.label}
              </Link>
            </Button>
          );
        })}
      </AnimatedCard>

      {/* Orders */}
      <div className="space-y-4">
        {dbOrders.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground border rounded-xl border-dashed">
            Belum ada pesanan saat ini.
          </div>
        ) : (
          dbOrders.map((order) => {
            const taskStatus = order.task.status;
            
            // Map task status to UI string
            let uiStatus = "IN_PROGRESS";
            if (taskStatus === "IN_REVIEW") uiStatus = "REVIEW";
            if (taskStatus === "COMPLETED") uiStatus = "COMPLETED";
            if (taskStatus === "IN_DISPUTE") uiStatus = "DISPUTE";

            // Dummy progress based on status
            const progress = taskStatus === "COMPLETED" ? 100 : taskStatus === "IN_REVIEW" ? 90 : 40;

            const targetUser = userRole === "CLIENT" ? order.worker : order.client;

            return (
              <AnimatedCard key={order.id}>
                <Card className="border-border/50 hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Avatar */}
                      <UserAvatar name={targetUser.name || "User"} image={targetUser.image} size="md" className="hidden sm:flex" />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs text-muted-foreground font-mono">#{order.id.slice(0, 8)}</span>
                          <StatusBadge
                            status={uiStatus}
                            icon={
                              uiStatus === "IN_PROGRESS" ? <IconClock size={12} /> :
                              uiStatus === "REVIEW" ? <IconEye size={12} /> :
                              uiStatus === "COMPLETED" ? <IconCheck size={12} /> :
                              <IconAlertTriangle size={12} />
                            }
                          />
                        </div>

                        <h3 className="font-semibold text-sm line-clamp-1">{order.task.title}</h3>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{userRole === "CLIENT" ? "Worker" : "Client"}: <strong className="text-foreground">{targetUser.name}</strong></span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <IconClock size={13} />
                            Deadline: {formatDate(order.task.deadline)}
                          </span>
                        </div>

                        {/* Progress bar */}
                        {taskStatus !== "COMPLETED" && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="text-muted-foreground">Progres</span>
                              <span className="font-semibold">{progress}%</span>
                            </div>
                            <div className="h-2 bg-accent rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right side */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                        <div className="text-base sm:text-lg font-bold text-primary">{formatCurrency(order.amount)}</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
                            <IconMessageCircle size={16} />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
                            <IconEye size={16} />
                          </Button>
                        </div>
                        {userRole === "CLIENT" && taskStatus === "IN_REVIEW" && (
                          <Button size="sm" className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs hover:from-emerald-400 hover:to-teal-400">
                            Terima Hasil
                          </Button>
                        )}
                        {taskStatus === "COMPLETED" && (
                          <Button variant="outline" size="sm" className="rounded-lg border-amber-500/30 text-amber-400 text-xs hover:bg-amber-500/10">
                            <IconStarFilled size={14} />
                            Beri Rating
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            );
          })
        )}
      </div>
    </PageTransition>
  );
}
