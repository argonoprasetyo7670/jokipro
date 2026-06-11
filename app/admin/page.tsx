import { prisma } from "@/lib/prisma";
import { IconUsers, IconClock, IconCheck, IconX } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";

async function getStats() {
  const [total, pending, approved, rejected] = await Promise.all([
    prisma.workerProfile.count(),
    prisma.workerProfile.count({ where: { kycStatus: "PENDING" } }),
    prisma.workerProfile.count({ where: { kycStatus: "APPROVED" } }),
    prisma.workerProfile.count({ where: { kycStatus: "REJECTED" } }),
  ]);
  return { total, pending, approved, rejected };
}

export default async function AdminPage() {
  const stats = await getStats();

  const statCards = [
    { label: "Total Worker", value: stats.total, icon: IconUsers, color: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Menunggu Verifikasi", value: stats.pending, icon: IconClock, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Terverifikasi", value: stats.approved, icon: IconCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Ditolak", value: stats.rejected, icon: IconX, color: "text-rose-400", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola verifikasi worker dan pantau aktivitas platform.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
