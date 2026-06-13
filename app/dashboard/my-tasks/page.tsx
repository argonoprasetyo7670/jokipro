import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageTransition, AnimatedCard } from "@/components/motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconPlus, IconMessageCircle, IconCash, IconClock } from "@tabler/icons-react";

export const metadata = {
  title: "Tugas Saya | Edutasky",
  description: "Kelola tugas yang telah Anda buat",
};

export default async function MyTasksPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/dashboard");
  }

  // Ambil semua tugas milik client ini beserta jumlah bids-nya
  const tasks = await prisma.task.findMany({
    where: {
      clientId: session.user.id,
    },
    include: {
      _count: {
        select: { bids: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tugas Saya</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Pantau status tugas Anda dan tinjau penawaran yang masuk.
            </p>
          </div>
          <Link href="/dashboard/tasks/new">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 gap-2 rounded-xl">
              <IconPlus size={18} />
              Buat Tugas Baru
            </Button>
          </Link>
        </div>

        {tasks.length === 0 ? (
          <AnimatedCard>
            <Card className="border-dashed border-2 border-border/50 bg-transparent">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <IconPlus size={32} />
                </div>
                <h3 className="font-semibold text-lg">Belum Ada Tugas</h3>
                <p className="text-muted-foreground text-sm mt-2 max-w-sm mb-6">
                  Anda belum membuat tugas apa pun. Mulai buat tugas pertama Anda untuk menemukan worker terbaik.
                </p>
                <Link href="/dashboard/tasks/new">
                  <Button className="rounded-xl">Buat Tugas Sekarang</Button>
                </Link>
              </CardContent>
            </Card>
          </AnimatedCard>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <AnimatedCard key={task.id}>
                <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-5 sm:p-6 relative">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/tasks/${task.id}`} className="hover:underline">
                            <h3 className="font-semibold text-lg text-foreground line-clamp-1">{task.title}</h3>
                          </Link>
                          {task.status === "OPEN" && (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-semibold h-5">
                              TERBUKA
                            </Badge>
                          )}
                          {task.status === "IN_PROGRESS" && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-semibold h-5">
                              DIKERJAKAN
                            </Badge>
                          )}
                          {task.status === "COMPLETED" && (
                            <Badge variant="outline" className="bg-zinc-500/10 text-zinc-500 border-zinc-500/20 text-[10px] font-semibold h-5">
                              SELESAI
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-4 pt-2">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <IconCash size={14} className="text-emerald-500" />
                            <span>Rp {new Intl.NumberFormat('id-ID').format(task.budget)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <IconClock size={14} />
                            <span>Deadline: {new Date(task.deadline).toLocaleDateString('id-ID')}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
                            <IconMessageCircle size={14} />
                            <span>{task._count.bids} Penawaran Masuk</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center justify-end gap-2 shrink-0">
                        <Link href={`/dashboard/tasks/${task.id}`}>
                          <Button variant="outline" size="sm" className="w-full sm:w-32 rounded-xl">Lihat Detail</Button>
                        </Link>
                        {task.status === "OPEN" && task._count.bids > 0 && (
                          <Link href={`/dashboard/tasks/${task.id}#bids`}>
                            <Button size="sm" className="w-full sm:w-32 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 shadow-none">
                              Pilih Worker
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
