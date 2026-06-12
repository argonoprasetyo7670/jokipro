"use client";

import {
  IconBriefcase,
  IconCash,
  IconStarFilled,
  IconTrendingUp,
  IconClock,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { PageTransition, AnimatedCard } from "@/components/motion";
import { formatRupiah } from "@/lib/utils";

interface WorkerData {
  activeOrders: number;
  totalIncome: number;
  rating: number;
  completedOrders: number;
  recentOrders: {
    id: string;
    title: string;
    client: string;
    status: any;
    budget: number;
    deadline: string;
  }[];
  kycStatus: string;
}

export function WorkerOverview({ userName, data }: { userName: string; data: WorkerData }) {
  const stats = [
    { label: "Tugas Aktif", value: data.activeOrders.toString(), change: "Sedang dikerjakan", icon: IconBriefcase, gradient: "from-violet-500 to-indigo-500" },
    { label: "Pendapatan Bersih", value: formatRupiah(data.totalIncome), change: "Total penghasilan", icon: IconCash, gradient: "from-emerald-500 to-teal-500" },
    { label: "Rating Pekerja", value: data.rating.toFixed(1), change: "Bintang", icon: IconStarFilled, gradient: "from-amber-500 to-orange-500" },
    { label: "Tugas Selesai", value: data.completedOrders.toString(), change: "Berhasil ditarik", icon: IconTrendingUp, gradient: "from-pink-500 to-rose-500" },
  ];
  return (
    <PageTransition className="space-y-6">
      <AnimatedCard>
        <PageHeader
          title={`Selamat Datang, ${userName}! 👋`}
          description="Berikut ringkasan aktivitas pengerjaan tugas Anda di JokiPro."
        />
      </AnimatedCard>

      {data.kycStatus !== "APPROVED" && (
        <AnimatedCard>
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <IconClock className="text-amber-500" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-amber-600 dark:text-amber-400">Akun Dalam Proses Review</h3>
              <p className="text-xs sm:text-sm text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                Profil Anda sedang diperiksa oleh tim Admin. Selama proses ini, Anda belum dapat mengajukan penawaran pada tugas. Mohon menunggu maksimal 1x24 jam.
              </p>
            </div>
          </div>
        </AnimatedCard>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <AnimatedCard key={stat.label}>
            <StatCard {...stat} />
          </AnimatedCard>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <AnimatedCard>
          <Link href="/dashboard/tasks">
            <Card className="group border-border/50 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <IconBriefcase size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base">Cari Tugas Baru</div>
                  <div className="text-xs text-muted-foreground">
                    Temukan tugas terbuka dan ajukan penawaran
                  </div>
                </div>
                <IconArrowRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        </AnimatedCard>

        <AnimatedCard>
          <Link href="/dashboard/wallet">
            <Card className="group border-border/50 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <IconCash size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base">Cairkan Saldo</div>
                  <div className="text-xs text-muted-foreground">
                    Tarik pendapatan Anda ke rekening bank
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
            <h2 className="font-semibold text-sm sm:text-base">Tugas yang Sedang Dikerjakan</h2>
            <Link
              href="/dashboard/orders"
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
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{order.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Deadline: {order.deadline}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <StatusBadge status={order.status} />
                  <div className="text-sm font-semibold mt-1">{formatRupiah(order.budget)}</div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Belum ada tugas yang dikerjakan saat ini.
              </div>
            )}
          </div>
        </Card>
      </AnimatedCard>
    </PageTransition>
  );
}
