"use client";

import {
  IconUsers,
  IconReceipt,
  IconAlertCircle,
  IconWallet,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { PageHeader } from "@/components/page-header";
import { UserAvatar } from "@/components/user-avatar";
import { PageTransition, AnimatedCard } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatRupiah } from "@/lib/utils";

interface AdminData {
  totalUsers: number;
  totalTransaction: number;
  openDisputes: number;
  platformProfit: number;
  recentDisputes: {
    id: string;
    orderId: string;
    client: string;
    worker: string;
    issue: string;
    status: string;
  }[];
}

export function AdminOverview({ userName, data }: { userName: string; data: AdminData }) {
  const stats = [
    { label: "Total Pengguna", value: formatNumber(data.totalUsers), change: "Akun Terdaftar", icon: IconUsers, gradient: "from-blue-500 to-secondary" },
    { label: "Total Transaksi", value: formatRupiah(data.totalTransaction), change: "Nilai Order", icon: IconReceipt, gradient: "from-emerald-500 to-teal-500" },
    { label: "Dispute Aktif", value: data.openDisputes.toString(), change: "Perlu mediasi", icon: IconAlertCircle, gradient: "from-red-500 to-rose-500" },
    { label: "Keuntungan Platform", value: formatRupiah(data.platformProfit), change: "Potongan Fee", icon: IconWallet, gradient: "from-primary to-purple-500" },
  ];
  return (
    <PageTransition className="space-y-6">
      <AnimatedCard>
        <PageHeader
          title={`Dashboard Admin — ${userName}`}
          description="Pantau kesehatan platform, transaksi, dan selesaikan dispute."
        />
      </AnimatedCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <AnimatedCard key={stat.label}>
            <StatCard {...stat} />
          </AnimatedCard>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <AnimatedCard>
          <Link href="/dashboard/users">
            <Card className="group border-border/50 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-secondary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <IconUsers size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base">Kelola Pengguna</div>
                  <div className="text-xs text-muted-foreground">
                    Verifikasi worker dan kelola akun pengguna
                  </div>
                </div>
                <IconArrowRight size={20} className="text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        </AnimatedCard>

        <AnimatedCard>
          <Link href="/dashboard/disputes">
            <Card className="group border-border/50 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <IconAlertCircle size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm sm:text-base">Pusat Resolusi</div>
                  <div className="text-xs text-muted-foreground">
                    Tinjau dan selesaikan konflik transaksi
                  </div>
                </div>
                <IconArrowRight size={20} className="text-muted-foreground group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        </AnimatedCard>
      </div>

      <AnimatedCard>
        <Card className="border-border/50">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/50">
            <h2 className="font-semibold text-sm sm:text-base">Dispute Terbaru</h2>
            <Link
              href="/dashboard/disputes"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Lihat Semua <IconArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-border/50">
            {data.recentDisputes.length > 0 ? data.recentDisputes.map((dispute) => (
              <div
                key={dispute.id}
                className="flex items-start sm:items-center flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">{dispute.id}</span>
                    <Badge variant="outline" className={dispute.status === "OPEN" ? "border-red-500/30 text-red-500 bg-red-500/10" : "border-amber-500/30 text-amber-500 bg-amber-500/10"}>
                      {dispute.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Order: {dispute.orderId} • Client: {dispute.client} • Worker: {dispute.worker}
                  </div>
                  <div className="text-sm line-clamp-1">{dispute.issue}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <Link href={`/dashboard/disputes/${dispute.id}`} className="text-xs font-semibold text-primary hover:underline">
                    Tinjau Dispute
                  </Link>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Tidak ada sengketa / dispute saat ini.
              </div>
            )}
          </div>
        </Card>
      </AnimatedCard>
    </PageTransition>
  );
}
