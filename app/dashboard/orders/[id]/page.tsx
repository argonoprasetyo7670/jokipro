import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  IconArrowLeft,
  IconClock,
  IconCash,
  IconCalendar,
  IconCheck,
  IconShieldCheck,
  IconStarFilled,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/user-avatar";
import { StatusBadge } from "@/components/status-badge";
import { PageTransition, AnimatedCard } from "@/components/motion";
import { OrderChat } from "@/components/dashboard/order-chat";
import { OrderActions } from "@/components/dashboard/order-actions";
import { ReviewForm } from "@/components/dashboard/review-form";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      task: true,
      client: true,
      worker: {
        include: { workerProfile: true },
      },
      bid: true,
    },
  });

  if (!order) {
    return (
      <PageTransition className="flex flex-col items-center justify-center py-20 space-y-4">
        <h1 className="text-2xl font-bold">Pesanan Tidak Ditemukan</h1>
        <p className="text-muted-foreground">Pesanan dengan ID ini tidak ada.</p>
        <Link href="/dashboard/orders">
          <Badge variant="outline" className="cursor-pointer">Kembali</Badge>
        </Link>
      </PageTransition>
    );
  }

  // Access control: only client or worker of this order
  if (order.clientId !== session.user.id && order.workerId !== session.user.id) {
    redirect("/dashboard/orders");
  }

  const userRole = session.user.role as string;
  const isClient = order.clientId === session.user.id;
  const otherUser = isClient ? order.worker : order.client;

  // Fetch messages
  const messages = await prisma.message.findMany({
    where: { taskId: order.taskId },
    include: {
      sender: {
        select: { name: true, image: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  let userReview = null;
  if (order.task.status === "COMPLETED") {
    userReview = await prisma.review.findFirst({
      where: {
        taskId: order.taskId,
        reviewerId: session.user.id,
      },
    });
  }

  const serializedMessages = messages.map((m) => ({
    id: m.id,
    senderId: m.senderId,
    content: m.content,
    attachment: m.attachment,
    createdAt: m.createdAt.toISOString(),
    sender: {
      name: m.sender.name,
      image: m.sender.image,
    },
  }));

  // Status mapping for UI
  const statusMap: Record<string, string> = {
    IN_PROGRESS: "Dalam Pengerjaan",
    IN_REVIEW: "Menunggu Review",
    COMPLETED: "Selesai",
    IN_DISPUTE: "Sengketa",
  };

  return (
    <PageTransition className="space-y-6">
      {/* Back */}
      <AnimatedCard>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconArrowLeft size={16} />
          Kembali ke Daftar Pesanan
        </Link>
      </AnimatedCard>

      {/* Header */}
      <AnimatedCard>
        <Card className="border-border/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground font-mono">#{order.id.slice(0, 8)}</span>
                  <StatusBadge
                    status={order.task.status === "IN_REVIEW" ? "REVIEW" : order.task.status === "COMPLETED" ? "COMPLETED" : order.task.status === "IN_DISPUTE" ? "DISPUTE" : "IN_PROGRESS"}
                    icon={order.task.status === "COMPLETED" ? <IconCheck size={12} /> : <IconClock size={12} />}
                  />
                </div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">{order.task.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <IconCash size={16} className="text-emerald-400" />
                    <strong className="text-foreground">{formatCurrency(order.amount)}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconCalendar size={16} />
                    Deadline: {formatDate(order.task.deadline)}
                  </span>
                </div>
              </div>

              {/* Other user info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border shrink-0">
                <UserAvatar name={otherUser.name || "User"} image={otherUser.image} size="md" />
                <div>
                  <p className="text-xs text-muted-foreground">{isClient ? "Worker" : "Client"}</p>
                  <p className="font-semibold text-sm">{otherUser.name}</p>
                  {!isClient && order.worker.workerProfile?.kycStatus === "APPROVED" && (
                    <p className="text-[10px] text-emerald-500 flex items-center gap-1 mt-0.5">
                      <IconShieldCheck size={10} /> Terverifikasi
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <AnimatedCard>
            <Card className="border-border/50 overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-sm">Ruang Diskusi</h2>
                <p className="text-xs text-muted-foreground">Komunikasi langsung dengan {isClient ? "Worker" : "Client"}</p>
              </div>
              <OrderChat
                orderId={order.id}
                messages={serializedMessages}
                currentUserId={session.user.id}
              />
            </Card>
          </AnimatedCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <AnimatedCard>
            <OrderActions
              orderId={order.id}
              taskId={order.taskId}
              taskStatus={order.task.status}
              userRole={session.user.id === order.workerId ? "WORKER" : "CLIENT"}
            />
          </AnimatedCard>

          {/* Order Info */}
          <AnimatedCard>
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-sm">Detail Pesanan</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nilai Deal</span>
                    <span className="font-semibold">{formatCurrency(order.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biaya Platform (5%)</span>
                    <span className="text-muted-foreground">{formatCurrency(order.platformFee)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-muted-foreground">Worker Menerima</span>
                    <span className="font-bold text-primary">{formatCurrency(order.amount - order.platformFee)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Review System for Completed Tasks */}
          {order.task.status === "COMPLETED" && (
            <AnimatedCard>
              {(() => {

                if (userReview) {
                  return (
                    <Card className="border-border/50 bg-amber-500/5 border-amber-500/20">
                      <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold text-sm flex items-center gap-2 text-amber-600 dark:text-amber-400">
                          <IconStarFilled size={16} /> Ulasan Anda
                        </h3>
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <IconStarFilled
                              key={star}
                              size={14}
                              className={
                                star <= userReview.rating
                                  ? "text-amber-400"
                                  : "text-muted/30"
                              }
                            />
                          ))}
                        </div>
                        {userReview.comment && (
                          <p className="text-xs text-muted-foreground italic">
                            "{userReview.comment}"
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                }

                return (
                  <ReviewForm
                    orderId={order.id}
                    targetName={otherUser.name || "Pengguna"}
                  />
                );
              })()}
            </AnimatedCard>
          )}

          {/* Task Description */}
          <AnimatedCard>
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-sm">Deskripsi Tugas</h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-6">
                  {order.task.description}
                </p>
                <Link href={`/dashboard/tasks/${order.taskId}`} className="text-xs text-primary hover:underline">
                  Lihat detail tugas →
                </Link>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
}
