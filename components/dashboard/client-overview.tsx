"use client";

import {
  IconBriefcase,
  IconCash,
  IconCheck,
  IconClock,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { UserAvatar } from "@/components/user-avatar";
import { PageTransition, AnimatedCard } from "@/components/motion";
import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ClientData {
  activeTasks: number;
  totalSpent: number;
  inReviewTasks: number;
  completedTasks: number;
  recentOrders: {
    id: string;
    title: string;
    worker: string;
    status: any;
    budget: number;
    deadline: string;
  }[];
  activeTasksList: any[];
  spentOrdersList: any[];
  inReviewTasksList: any[];
  completedTasksList: any[];
}

export function ClientOverview({ userName, data }: { userName: string; data: ClientData }) {
  const [activeDialog, setActiveDialog] = useState<"activeTasks" | "totalSpent" | "inReviewTasks" | "completedTasks" | null>(null);

  const stats = [
    { id: "activeTasks", label: "Tugas Aktif", value: data.activeTasks.toString(), change: "Sedang dikerjakan", icon: IconBriefcase, gradient: "from-violet-500 to-indigo-500", list: data.activeTasksList },
    { id: "totalSpent", label: "Total Pengeluaran", value: formatRupiah(data.totalSpent), change: "Keseluruhan", icon: IconCash, gradient: "from-emerald-500 to-teal-500", list: data.spentOrdersList },
    { id: "inReviewTasks", label: "Menunggu Review", value: data.inReviewTasks.toString(), change: "Perlu konfirmasi", icon: IconClock, gradient: "from-amber-500 to-orange-500", list: data.inReviewTasksList },
    { id: "completedTasks", label: "Tugas Selesai", value: data.completedTasks.toString(), change: "Keseluruhan", icon: IconCheck, gradient: "from-blue-500 to-cyan-500", list: data.completedTasksList },
  ] as const;

  const currentStat = stats.find(s => s.id === activeDialog);
  return (
    <PageTransition className="space-y-6">
      <AnimatedCard>
        <PageHeader
          title={`Selamat Datang, ${userName}! 👋`}
          description="Pantau progres tugas yang Anda posting di JokiPro."
        />
      </AnimatedCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <AnimatedCard key={stat.label}>
            <StatCard {...stat} onClick={() => setActiveDialog(stat.id)} />
          </AnimatedCard>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <AnimatedCard>
          <Link href="/dashboard/tasks/new">
            <Card className="group border-border/50 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <IconBriefcase size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base">Buat Tugas Baru</div>
                  <div className="text-xs text-muted-foreground">
                    Posting tugas dan dapatkan penawaran dari worker
                  </div>
                </div>
                <IconArrowRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        </AnimatedCard>

        <AnimatedCard>
          <Link href="/dashboard/my-tasks">
            <Card className="group border-border/50 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <IconClock size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base">Daftar Tugas Saya</div>
                  <div className="text-xs text-muted-foreground">
                    Lihat semua tugas yang telah Anda posting
                  </div>
                </div>
                <IconArrowRight size={20} className="text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        </AnimatedCard>
      </div>

      <AnimatedCard>
        <Card className="border-border/50">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/50">
            <h2 className="font-semibold text-sm sm:text-base">Tugas Terbaru Anda</h2>
            <Link
              href="/dashboard/my-tasks"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Lihat Semua <IconArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-border/50">
            {data.recentOrders.length > 0 ? data.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-accent/50 transition-colors"
              >
                <UserAvatar name={order.worker} size="md" className="hidden sm:flex" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{order.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Dikerjakan oleh: {order.worker}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <StatusBadge status={order.status} />
                  <div className="text-sm font-semibold mt-1">{formatRupiah(order.budget)}</div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Belum ada tugas yang berjalan.
              </div>
            )}
          </div>
        </Card>
      </AnimatedCard>

      {/* Pop-up Dialog untuk Detail Data */}
      <Dialog open={activeDialog !== null} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail: {currentStat?.label}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {currentStat?.list && currentStat.list.length > 0 ? (
              currentStat.list.map((item: any) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">Worker: {item.worker}</div>
                    <div className="text-xs text-muted-foreground">Deadline: {item.deadline}</div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                    <StatusBadge status={item.status} />
                    <div className="text-sm font-bold text-emerald-500">{formatRupiah(item.budget)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-muted-foreground bg-muted/30 rounded-lg">
                Tidak ada data untuk kategori ini.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
