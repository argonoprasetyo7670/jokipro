import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  IconArrowLeft,
  IconStarFilled,
  IconClock,
  IconCash,
  IconShieldCheck,
  IconMessageCircle,
  IconPaperclip,
  IconSend,
  IconUser,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge, SkillTag } from "@/components/status-badge";
import { UserAvatar } from "@/components/user-avatar";
import { PageTransition, AnimatedCard } from "@/components/motion";
import { BidForm } from "@/components/dashboard/bid-form";
import { BidCard } from "@/components/dashboard/bid-card";
import { formatDateLongWIB } from "@/lib/utils";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const userRole = session?.user?.role || "CLIENT";
  
  let workerKycStatus = "NONE";
  if (userRole === "WORKER" && session?.user?.id) {
    const wp = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
      select: { kycStatus: true }
    });
    if (wp) {
      workerKycStatus = wp.kycStatus;
    }
  }
  
  const dbTask = await prisma.task.findUnique({
    where: { id },
    include: {
      client: {
        include: {
          // @ts-ignore: VSCode TS Server cache issue
          clientProfile: true,
          _count: { select: { postedTasks: true, clientOrders: true } }
        }
      },
      bids: {
        include: {
          worker: {
            include: {
              workerProfile: true,
              _count: { select: { workerOrders: { where: { status: "RELEASED" } } } }
            }
          }
        }
      }
    }
  });

  if (!dbTask) {
    return (
      <PageTransition className="space-y-6 flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold">Tugas Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-4">Tugas dengan ID ini tidak ada atau telah dihapus.</p>
        <Link href="/dashboard/tasks">
          <Button>Kembali ke Daftar Tugas</Button>
        </Link>
      </PageTransition>
    );
  }

  // Format data
  const taskData: any = dbTask;
  const task = {
    id: taskData.id,
    title: taskData.title,
    description: taskData.description,
    budget: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(taskData.budget),
    deadline: formatDateLongWIB(taskData.deadline),
    status: taskData.status,
    tags: taskData.category.split(",").map((t: string) => t.trim()),
    clientName: taskData.client.name || "Client",
    clientImage: taskData.client.image,
    clientJoined: new Date(taskData.client.createdAt).getFullYear().toString(),
    clientRating: taskData.client.clientProfile?.rating || 0,
    clientCompleted: taskData.client._count?.clientOrders || 0,
    clientLocation: "Indonesia", 
    bids: taskData.bids.map((bid: any) => ({
      id: bid.id,
      workerId: bid.worker.id,
      workerName: bid.worker.name || "Worker",
      workerImage: bid.worker.image,
      workerRating: bid.worker.workerProfile?.rating || 0,
      workerCompleted: bid.worker._count?.workerOrders || 0,
      amount: bid.amount,
      deadline: bid.deadline,
      estimatedDays: bid.estimatedDays,
      coverLetter: bid.coverLetter,
      // @ts-ignore: VSCode TS Server cache issue
      attachment: bid.attachment,
      status: bid.status,
    })),
  };

  return (
    <PageTransition className="space-y-6">
      {/* Back */}
      <AnimatedCard>
        <Link
          href="/dashboard/tasks"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconArrowLeft size={16} />
          Kembali ke Daftar Tugas
        </Link>
      </AnimatedCard>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Header */}
          <AnimatedCard>
            <Card className="border-border/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <CategoryBadge category={task.tags[0]} />
                  <Badge variant="outline" className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10">
                    {task.status}
                  </Badge>
                </div>

                <h1 className="text-lg sm:text-xl font-bold tracking-tight">{task.title}</h1>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <IconCash size={16} className="text-emerald-400" />
                    <strong className="text-foreground">{task.budget}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconClock size={16} />
                    {task.deadline}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconMessageCircle size={16} />
                    {task.bids.length} penawaran
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {task.tags.map((tag: string) => (
                    <SkillTag key={tag} skill={tag} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Description */}
          <AnimatedCard>
            <Card className="border-border/50">
              <CardContent className="p-4 sm:p-6">
                <h2 className="font-semibold mb-4">Deskripsi & Instruksi</h2>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {task.description}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Task Attachment */}
          {dbTask.attachment && (
            <AnimatedCard>
              <Card className="border-border/50 bg-primary/5">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <IconPaperclip size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Lampiran dari Client</h3>
                      <p className="text-xs text-muted-foreground">Unduh file referensi untuk memahami tugas ini lebih baik.</p>
                    </div>
                  </div>
                  <a 
                    href={dbTask.attachment} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">Buka Lampiran</Button>
                  </a>
                </CardContent>
              </Card>
            </AnimatedCard>
          )}

          {/* Bids */}
          <AnimatedCard>
            <Card className="border-border/50 scroll-mt-24" id="bids">
              <div className="p-4 sm:p-6 border-b border-border/50">
                <h2 className="font-semibold">Penawaran ({task.bids.length})</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Bandingkan penawaran dari worker dan pilih yang terbaik.
                </p>
              </div>

              <div className="divide-y divide-border/50">
                {task.bids.map((bid: any) => (
                  <BidCard 
                    key={bid.id} 
                    bid={bid} 
                    userRole={userRole} 
                    taskStatus={task.status} 
                  />
                ))}
                
                {task.bids.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="text-sm">Belum ada penawaran untuk tugas ini.</p>
                  </div>
                )}
              </div>
            </Card>
          </AnimatedCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <AnimatedCard>
            <Card className="border-border/50">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-sm mb-4">Informasi Client</h3>
                <div className="flex items-center gap-3 mb-4">
                  <UserAvatar name={task.clientName} size="lg" />
                  <div>
                    <Link href={`/dashboard/clients`} className="font-semibold text-sm hover:text-primary hover:underline transition-colors">
                      {task.clientName}
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <IconStarFilled size={12} className="text-amber-400" />
                      {task.clientRating} · {task.clientCompleted} tugas
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <IconUser size={14} className="inline mr-1" />
                  Bergabung sejak {task.clientJoined}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Quick Bid (Only for Worker) */}
          {userRole === "WORKER" && task.status === "OPEN" && workerKycStatus === "APPROVED" && (
            <AnimatedCard>
              <BidForm taskId={task.id} />
            </AnimatedCard>
          )}

          {userRole === "WORKER" && task.status === "OPEN" && workerKycStatus !== "APPROVED" && (
            <AnimatedCard>
              <Card className="border-border/50 bg-amber-500/10 border-amber-500/20">
                <CardContent className="p-4 sm:p-6 text-center">
                  <h3 className="font-semibold text-sm mb-1 text-amber-600 dark:text-amber-400">Akun Sedang Direview</h3>
                  <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                    Anda belum dapat mengajukan penawaran karena akun profil Anda masih menunggu persetujuan dari Admin.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
          )}

          {userRole === "WORKER" && task.status !== "OPEN" && (
            <AnimatedCard>
              <Card className="border-border/50 bg-accent/30">
                <CardContent className="p-4 sm:p-6 text-center">
                  <h3 className="font-semibold text-sm mb-1 text-muted-foreground">Tugas Tidak Tersedia</h3>
                  <p className="text-xs text-muted-foreground">
                    Tugas ini sudah dalam proses pengerjaan atau telah selesai, sehingga tidak lagi menerima penawaran.
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
