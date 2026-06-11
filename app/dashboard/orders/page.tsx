"use client";

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

const orders = [
  {
    id: "ORD-001", title: "Tugas Algoritma & Pemrograman — Implementasi BFS/DFS",
    worker: { name: "Ahmad Fauzi" }, status: "IN_PROGRESS" as const,
    budget: "Rp 180.000", deadline: "15 Jun 2026", progress: 60, createdAt: "10 Jun 2026",
  },
  {
    id: "ORD-002", title: "Makalah Ekonomi Makro — Analisis Kebijakan Fiskal",
    worker: { name: "Siti Nurhaliza" }, status: "REVIEW" as const,
    budget: "Rp 85.000", deadline: "12 Jun 2026", progress: 100, createdAt: "8 Jun 2026",
  },
  {
    id: "ORD-003", title: "Desain UI/UX E-Commerce App — Figma High Fidelity",
    worker: { name: "Budi Santoso" }, status: "COMPLETED" as const,
    budget: "Rp 300.000", deadline: "10 Jun 2026", progress: 100, createdAt: "3 Jun 2026",
  },
  {
    id: "ORD-004", title: "Website Portfolio Personal — Next.js + Tailwind CSS",
    worker: { name: "Diana Kusuma" }, status: "IN_PROGRESS" as const,
    budget: "Rp 350.000", deadline: "20 Jun 2026", progress: 30, createdAt: "11 Jun 2026",
  },
  {
    id: "ORD-005", title: "Laporan Praktikum Fisika — Gerak Parabola",
    worker: { name: "Rizky Putra" }, status: "DISPUTE" as const,
    budget: "Rp 75.000", deadline: "9 Jun 2026", progress: 80, createdAt: "5 Jun 2026",
  },
];

const tabs = ["Semua", "Dikerjakan", "Review", "Selesai", "Sengketa"];

export default function OrdersPage() {
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
        {tabs.map((tab, i) => (
          <Button
            key={tab}
            variant={i === 0 ? "default" : "outline"}
            size="sm"
            className={`flex-shrink-0 rounded-full ${i === 0 ? "shadow-lg shadow-primary/25" : ""}`}
          >
            {tab}
          </Button>
        ))}
      </AnimatedCard>

      {/* Orders */}
      <div className="space-y-4">
        {orders.map((order) => (
          <AnimatedCard key={order.id}>
            <Card className="border-border/50 hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Worker Avatar */}
                  <UserAvatar name={order.worker.name} size="md" className="hidden sm:flex" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs text-muted-foreground font-mono">{order.id}</span>
                      <StatusBadge
                        status={order.status}
                        icon={
                          order.status === "IN_PROGRESS" ? <IconClock size={12} /> :
                          order.status === "REVIEW" ? <IconEye size={12} /> :
                          order.status === "COMPLETED" ? <IconCheck size={12} /> :
                          <IconAlertTriangle size={12} />
                        }
                      />
                    </div>

                    <h3 className="font-semibold text-sm line-clamp-1">{order.title}</h3>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>Worker: <strong className="text-foreground">{order.worker.name}</strong></span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <IconClock size={13} />
                        Deadline: {order.deadline}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {order.status !== "COMPLETED" && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">Progres</span>
                          <span className="font-semibold">{order.progress}%</span>
                        </div>
                        <div className="h-2 bg-accent rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right side */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                    <div className="text-base sm:text-lg font-bold text-primary">{order.budget}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
                        <IconMessageCircle size={16} />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
                        <IconEye size={16} />
                      </Button>
                    </div>
                    {order.status === "REVIEW" && (
                      <Button size="sm" className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs hover:from-emerald-400 hover:to-teal-400">
                        Terima Hasil
                      </Button>
                    )}
                    {order.status === "COMPLETED" && (
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
        ))}
      </div>
    </PageTransition>
  );
}
